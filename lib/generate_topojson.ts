import * as fs from "node:fs/promises";
import url from "node:url";
import path from "node:path";
import type { GeoJsonProperties } from "geojson";

import * as topojsonServer from "topojson-server";
import * as topojsonClient from "topojson-client";
import * as topojsonSimplify from "topojson-simplify";

import { filesize } from "filesize";

import type {
  GeometryObject,
  MultiPolygon,
  Objects,
  Polygon,
  Topology,
} from "topojson-specification";

export interface KsjTmpltProperties {
  N03_001: string;
  N03_002: string;
  N03_003: string;
  N03_004: string;
  N03_007: string;
}

type Shichoson = {
  CODE: string;
  CITY: string;
};

// Webアプリ内で利用するTopoJsonを公的データから生成します。
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

// 行政区域データ
// https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-N03-v3_1.html
const GML_FILE_PATH = path.join(__dirname, "N03-23_01_230101.geojson");

// 道内179市町村と
// 参照元データ： https://www.pref.hokkaido.lg.jp/link/shichoson/index.html
const SHICHOSON_FILE_PATH = path.join(__dirname, "shichoson.json");

// 出力先
const OUTPUT_PATH = "src/data/hokkaido.json";

// -----------------------------

const WARD_NAME_KEY = "N03_003"; // 郡・政令都市名
const CITY_NAME_KEY = "N03_004"; // 市区町村名
const CITY_CODE_KEY = "N03_007"; // 行政区域コード
const SAPPORO_CODE = "01100"; // 札幌市の行政区域コード

type HokkaidoTopoJSON = Topology<Objects<KsjTmpltProperties>>;

const isPolygonObject = (
  objects: GeometryObject<GeoJsonProperties>[],
): objects is Array<Polygon | MultiPolygon> => {
  return objects.every((object) => {
    return object.type === "Polygon" || object.type === "MultiPolygon";
  });
};

const isValidProperties = (
  properties: GeoJsonProperties | undefined | object,
): properties is KsjTmpltProperties => {
  if (properties == null) return false;
  if (
    "N03_001" in properties &&
    "N03_002" in properties &&
    "N03_003" in properties &&
    "N03_004" in properties &&
    "N03_007" in properties
  ) {
    return true;
  }
  return false;
};

const read = async (): Promise<HokkaidoTopoJSON> => {
  const geojson = JSON.parse(await fs.readFile(GML_FILE_PATH, "utf8"));
  return topojsonServer.topology(
    { hokkaido: geojson },
    1e5,
  ) as HokkaidoTopoJSON;
};

// 簡易化
// 地図のディテールを省略してファイルサイズを小さくする
const simplify = async (topology: HokkaidoTopoJSON) => {
  const transform = topology.transform;
  if (transform == null) {
    throw new Error("transform is null");
  }

  // type HokkaidoTopoJSON = Topology<Objects<GeoJsonProperties>>;
  const preSimplified = topojsonSimplify.presimplify(
    topology,
    topojsonSimplify.planarTriangleArea,
  );

  const minWeight = topojsonSimplify.quantile(preSimplified, 0.01);
  const simplified = topojsonSimplify.simplify(preSimplified, minWeight);

  const filterDetached = topojsonSimplify.filter(
    simplified,
    topojsonSimplify.filterAttachedWeight(
      simplified,
      minWeight,
      topojsonSimplify.planarRingArea,
    ),
  );

  return topojsonClient.quantize(filterDetached, transform);
};

// 元データは1つの自治体についき、閉じた領域が複数含まれるためそれらをまとめる
const mergeAreas = async (topology: HokkaidoTopoJSON) => {
  if (topology.objects.hokkaido.type !== "GeometryCollection") {
    throw new Error(
      `hokkaido.type is expected to GeometryCollection, not to be ${topology.objects.hokkaido.type}`,
    );
  }

  const shichoson = JSON.parse(
    await fs.readFile(SHICHOSON_FILE_PATH, "utf8"),
  ) as Shichoson[];

  // 一つの自治体に複数の領域がある場合は行政区域コードをキーにしてまとめる
  const geometries = new Map<string, GeometryObject<GeoJsonProperties>[]>();
  topology.objects.hokkaido.geometries.forEach((geo) => {
    if (geo.properties != null) {
      if (
        WARD_NAME_KEY in geo.properties &&
        geo.properties[WARD_NAME_KEY] === "札幌市"
      ) {
        // 札幌市は政令指定都市であるためにデータには区が登録されているため、行政区をまとめて札幌市一つにする
        const cityGio = geometries.get(SAPPORO_CODE) ?? [];
        cityGio?.push(geo);
        geometries.set(SAPPORO_CODE, cityGio);
      } else if (CITY_NAME_KEY in geo.properties) {
        // 市町村リストに含まれる市区町村のみを対象とする （除く: 政令指定都市行政区、北方領土）
        if (
          shichoson.some((cityData) => {
            if (!isValidProperties(geo.properties)) return false;
            return cityData.CODE === geo.properties[CITY_CODE_KEY];
          })
        ) {
          // 政令指定都市以外の市区町村は行政区域コードでまとめる
          const cityCode = geo.properties[CITY_CODE_KEY];
          const cityGio = geometries.get(cityCode) ?? [];
          cityGio?.push(geo);
          geometries.set(cityCode, cityGio);
        }
      }
    }
  });

  // 行政区域コードでまとめた複数の領域をマージして、ひとつの大きな領域にする
  const mergedGeometries: GeometryObject<KsjTmpltProperties>[] = [];
  geometries.forEach((geos, cityCode) => {
    if (isPolygonObject(geos)) {
      const mergedArcs = topojsonClient.mergeArcs(topology, geos);
      mergedArcs.properties = shichoson.find((cityData) => {
        if (!isValidProperties(geos[0].properties)) return false;
        return cityData.CODE === cityCode;
      });
      mergedGeometries.push(mergedArcs as GeometryObject<KsjTmpltProperties>);
    }
  });
  topology.objects.hokkaido.geometries = mergedGeometries;
  return topology;
};

const write = async (topology: HokkaidoTopoJSON) => {
  // write a json to the file
  await fs.writeFile(OUTPUT_PATH, JSON.stringify(topology));

  // Output a file size
  const fileSize = filesize((await fs.stat(OUTPUT_PATH)).size);
  console.log(`File generated to ${OUTPUT_PATH} with ${fileSize}`);
};

const topology = await read();
const simplified = await simplify(topology);
const merged = await mergeAreas(simplified);
await write(merged);
