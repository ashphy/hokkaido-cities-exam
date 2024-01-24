import { useAtom } from "jotai";
import { BlankMap } from "./components/BlankMap";

import { HokkaidoTopology } from "./HokkaidoTopology";
import { selectedCityIdAtom } from "./atom";

import { Answer } from "./components/Answer";
import { Counter } from "./components/Counter";
import { Header } from "./components/Header";
import { License } from "./components/License";
import { QuizForm } from "./components/QuizForm";

import GithubCorner from "react-github-corner";
import json from "./data/hokkaido.json";

function App() {
  const [selectedCityId, setSelectedCityId] = useAtom(selectedCityIdAtom);
  const topology = json as unknown as HokkaidoTopology;

  return (
    <main className="w-full h-dvh bg-blue-100">
      <div className="h-full grid grid-cols-[300px_1fr] grid-rows-[150px_50px_calc(100dvh-280px)_80px]">
        <div className="border-b-2 border-solid">
          <Header />
        </div>
        <div className="row-span-3 overflow-y-hidden pt-10 px-10">
          <BlankMap
            topology={topology}
            selectedCityId={selectedCityId}
            onSelect={(id) => setSelectedCityId(id)}
          />
        </div>
        <div className="w-full ml-4">
          <Counter />
        </div>
        <div className="w-full h-full rounded-md bg-white ml-4 shadow-md py-4 pl-2">
          <QuizForm
            topology={topology}
            selectedCityId={selectedCityId}
            onSelect={(id) => setSelectedCityId(id)}
          />
        </div>
        <div className="w-full center ml-4 mr-4">
          <Answer />
        </div>
        <div className="">
          <License />
        </div>
      </div>
      <GithubCorner href="https://github.com/ashphy/hokkaido-cities-exam" />
    </main>
  );
}

export default App;
