import { useAtom } from "jotai";
import { BlankMap } from "./components/BlankMap";

import { HokkaidoTopology } from "./HokkaidoTopology";
import { selectedCityIdAtom } from "./atom";

import { Answer } from "./components/Answer";
import { Counter } from "./components/Counter";
import { Header } from "./components/Header";
import { License } from "./components/License";
import { QuizForm } from "./components/QuizForm";
import { NoticeForMobile } from "./components/NoticeForMobile";

import GithubCorner from "react-github-corner";
import json from "./data/hokkaido.json";

function App() {
  const [selectedCityId, setSelectedCityId] = useAtom(selectedCityIdAtom);
  const topology = json as unknown as HokkaidoTopology;

  return (
    <main className="w-dvw h-dvh bg-blue-100">
      <div className="md:hidden">
        <NoticeForMobile />
      </div>
      <div
        className="
          h-full grid
          grid-cols-1 grid-rows-auto-rows-auto
          md:grid-cols-[300px_1fr] md:grid-rows-[150px_50px_calc(100dvh-280px)_80px]"
      >
        <div className="border-b-2 border-solid justify-self-center">
          <Header />
        </div>
        <div
          className="
            overflow-y-hidden h-[100dvw]
            md:row-span-3 md:h-auto md:pt-10 md:px-10"
        >
          <BlankMap
            topology={topology}
            selectedCityId={selectedCityId}
            onSelect={(id) => setSelectedCityId(id)}
          />
        </div>
        <div className="mx-4 mb-4">
          <Counter />
        </div>
        <div className="h-full rounded-md bg-white mx-4 shadow-md py-4 pl-2">
          <QuizForm
            topology={topology}
            selectedCityId={selectedCityId}
            onSelect={(id) => setSelectedCityId(id)}
          />
        </div>
        <div className="center mx-4">
          <Answer />
        </div>
        <div className="">
          <License />
        </div>
      </div>
      <div className="hidden md:block">
        <GithubCorner href="https://github.com/ashphy/hokkaido-cities-exam" />
      </div>
    </main>
  );
}

export default App;
