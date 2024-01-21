import { isSameCity } from "@/features/quiz/quiz";
import * as d3 from "d3";
import { useAtom, useAtomValue } from "jotai";
import { useEffect, useMemo, useRef } from "react";
import * as topojson from "topojson-client";
import type { Topology } from "topojson-specification";
import { answerModeAtom, quizDataAtom } from "../atom";

const filekey = "hokkaido";

interface Props {
  topology: Topology;
  selectedCityId: string | undefined;
  onSelect?: (cityId: string) => void;
}

export const BlankMap = ({ topology, selectedCityId, onSelect }: Props) => {
  const answerMode = useAtomValue(answerModeAtom);
  const [cities] = useAtom(quizDataAtom);
  const svgRef = useRef<SVGSVGElement>(null);

  const map = useMemo(() => {
    const maps2geo = topojson.feature(topology, topology.objects[filekey]);
    if (maps2geo.type !== "FeatureCollection") {
      return <div>loading...</div>;
    }

    const projection = d3.geoMercator().fitExtent(
      [
        [0, 0],
        [600, 500],
      ],
      maps2geo
    );
    const path = d3.geoPath().projection(projection);

    return (
      // biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
      <svg
        ref={svgRef}
        viewBox="0 0 600 500"
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-full"
      >
        {maps2geo.features.map((feature, index) => {
          const cityIndex = index + 1;
          return (
            <g key={feature.properties?.CODE}>
              <title>{feature.properties?.CITY}</title>
              {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
              <path
                d={path(feature) ?? undefined}
                fill="#ffffff"
                stroke="gray"
                strokeWidth="0.25"
                className="city cursor-pointer"
                id={`city-${feature.properties?.CODE}`}
                onClick={() => {
                  onSelect?.(feature.properties?.CODE);
                }}
              />
              <text
                x={path.centroid(feature)[0]}
                y={path.centroid(feature)[1] + 2}
                fill="#000000"
                fontSize="6px"
                textAnchor="middle"
                pointerEvents="none"
                className="select-none"
              >
                {cityIndex}
              </text>
            </g>
          );
        })}
      </svg>
    );
  }, [onSelect, topology]);

  useEffect(() => {
    // Reset styles
    d3.selectAll(".city").attr("fill", "#ffffff");

    if (answerMode) {
      for (const city of cities) {
        d3.select(`#city-${city.code}`).attr("fill", () => {
          if (isSameCity(city.name, city.answer)) {
            if (selectedCityId === city.code) {
              return "#4ade80";
            }
            return "#bbf7d0";
          }
          if (selectedCityId === city.code) {
            return "#fb7185";
          }
          return "#ffe4e6";
        });
      }
    } else {
      // Paint answered cities
      for (const city of cities) {
        if (city.answer === "") continue;
        d3.select(`#city-${city.code}`).attr("fill", () => {
          return "#8cc63f";
        });
      }

      // Paint selected city
      d3.select(`#city-${selectedCityId}`).attr("fill", () => {
        return "#fff838";
      });
    }

    return () => {};
  }, [selectedCityId, answerMode, cities]);

  return <div className="h-full bg-blue-100">{map}</div>;
};
