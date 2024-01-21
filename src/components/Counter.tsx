import { useAtomValue } from "jotai";
import {
  answerModeAtom,
  numOfAnsweredAtom,
  numOfCorrectAtom,
  quizDataAtom,
} from "../atom";

export const Counter = () => {
  const answerMode = useAtomValue(answerModeAtom);

  return (
    <div className="flex justify-center items-center content-center w-full h-[40px] bg-white rounded-md shadow text-lg text-slate-700">
      {answerMode ? <CorrectCounter /> : <AnsweredCounter />}
    </div>
  );
};

const AnsweredCounter = () => {
  const numberOfAnswered = useAtomValue(numOfAnsweredAtom);
  const cities = useAtomValue(quizDataAtom);

  return (
    <div className="h-fit">
      回答数 <span className="text-2xl">{numberOfAnswered}</span>
      {` / ${cities.length}`}
    </div>
  );
};

const CorrectCounter = () => {
  const numberOfCorrected = useAtomValue(numOfCorrectAtom);
  const cities = useAtomValue(quizDataAtom);

  return (
    <div className="h-fit">
      正解 <span className="text-2xl text-red-800">{numberOfCorrected}</span>
      {` / ${cities.length}`}
    </div>
  );
};
