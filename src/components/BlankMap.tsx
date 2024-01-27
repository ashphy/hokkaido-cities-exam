import { isCorrect } from "@/features/quiz/quiz";
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

const MapColors = {
  correct: {
    base: "#bbf7d0",
    selected: "#4ade80",
    hover: "#8df2b0",
  },
  wrong: {
    base: "#ffe4e6",
    selected: "#fb7185",
    hover: "#ffb3b8",
  },
} as const;

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
      <div className="w-full h-full max-w-full max-h-full">
        {/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
        {/* biome-ignore lint/a11y/useKeyWithMouseEvents: <explanation> */}
        <svg
          ref={svgRef}
          viewBox="0 0 600 500"
          preserveAspectRatio="xMidYMid meet"
          className="w-full h-full max-w-full max-h-full"
        >
          <g
            onMouseEnter={() => {
              if (answerMode) {
                d3.select("#map-tooltip").style("opacity", 1);
              }
            }}
            onMouseLeave={() => {
              if (answerMode) {
                d3.select("#map-tooltip").style("opacity", 0);
              }
            }}
          >
            {maps2geo.features.map((feature, index) => {
              const cityIndex = index + 1;
              return (
                <g key={feature.properties?.CODE}>
                  {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
                  {/* biome-ignore lint/a11y/useKeyWithMouseEvents: <explanation> */}
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
                    onMouseOver={(e) => {
                      if (!answerMode) return;

                      const rect = e.currentTarget.getBoundingClientRect();

                      d3.select(e.currentTarget).attr(
                        "fill",
                        isCorrect(
                          cities.find(
                            (c) => c.code === feature.properties?.CODE
                          )
                        )
                          ? MapColors.correct.hover
                          : MapColors.wrong.hover
                      );

                      d3.select("#map-tooltip")
                        .style("left", `${rect.left}px`)
                        .style("top", `${rect.top - 50}px`)
                        .text(feature.properties?.CITY);
                    }}
                    onMouseOut={(e) => {
                      if (!answerMode) return;

                      const city = cities.find(
                        (c) => c.code === feature.properties?.CODE
                      );
                      const isSelected = city?.code === selectedCityId;
                      d3.select(e.currentTarget).attr(
                        "fill",
                        isCorrect(city)
                          ? isSelected
                            ? MapColors.correct.selected
                            : MapColors.correct.base
                          : isSelected
                          ? MapColors.wrong.selected
                          : MapColors.wrong.base
                      );
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
          </g>
        </svg>
        <div
          className="absolute left-4 top-4 bg-white text-slate-800 rounded-full
           shadow-lg px-2 py-1 border border-gray-500 cursor-default
           transition-opacity	opacity-0"
          id="map-tooltip"
        >
          Tips
        </div>
      </div>
    );
  }, [onSelect, topology, answerMode, cities, selectedCityId]);

  useEffect(() => {
    // Reset styles
    d3.selectAll(".city").attr("fill", "#ffffff");

    if (answerMode) {
      for (const city of cities) {
        d3.select(`#city-${city.code}`).attr("fill", () => {
          if (isCorrect(city)) {
            if (selectedCityId === city.code) {
              return MapColors.correct.selected;
            }
            return MapColors.correct.base;
          }
          if (selectedCityId === city.code) {
            return MapColors.wrong.selected;
          }
          return MapColors.wrong.base;
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

  return (
    <div className=" flex justify-center content-center w-full h-full bg-blue-100">
      {map}
    </div>
  );
};
