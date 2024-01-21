import type { GeometryCollection, Topology } from "topojson-specification";

export interface CityProperties {
  CODE: string;
  CITY: string;
}

export type HokkaidoTopology = Topology<{
  hokkaido: GeometryCollection<CityProperties>;
}>;
