import { atom } from "jotai";
import { withImmer } from "jotai-immer";
import { atomWithStorage } from "jotai/utils";
import type { HokkaidoTopology } from "./HokkaidoTopology";
import json from "./data/hokkaido.json";
import { isSameCity } from "./features/quiz/quiz";
import { City } from "./features/quiz/city";

type QuizData = City[];

const topology = json as unknown as HokkaidoTopology;
const initialCities: QuizData = topology.objects.hokkaido.geometries.map(
  (geo) => {
    if (
      geo.properties != null &&
      "CODE" in geo.properties &&
      "CITY" in geo.properties
    ) {
      return {
        code: geo.properties.CODE,
        name: geo.properties.CITY,
        answer: "",
      };
    }

    throw new Error("properties is null");
  }
);

export const selectedCityIdAtom = atom<string | undefined>(undefined);
export const quizDataAtom = withImmer(
  atomWithStorage<QuizData>("quiz-data", initialCities, undefined, {
    getOnInit: true,
  })
);

export const numOfAnsweredAtom = atom((get) => {
  return get(quizDataAtom).filter((c) => c.answer !== "").length;
});

export const numOfCorrectAtom = atom((get) => {
  return get(quizDataAtom).filter((city) => {
    return isSameCity(city.name, city.answer);
  }).length;
});

export const answerModeAtom = atom(false);
