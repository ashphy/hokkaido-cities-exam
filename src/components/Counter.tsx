import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { Eraser } from "lucide-react";
import { useCallback } from "react";
import {
  answerModeAtom,
  numOfAnsweredAtom,
  numOfCorrectAtom,
  quizDataAtom,
} from "../atom";
import {
  AlertDialog,
  AlertDialogDestructiveAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";

export const Counter = () => {
  const answerMode = useAtomValue(answerModeAtom);

  return (
    <div className="flex justify-center items-center content-center w-full h-[40px] bg-white rounded-md shadow text-lg text-slate-700">
      {answerMode ? <CorrectCounter /> : <AnsweredCounter />}
    </div>
  );
};

const AnswerEraser = () => {
  const setCities = useSetAtom(quizDataAtom);

  const handleOnClearAnswer = useCallback(() => {
    setCities((draft) => {
      for (const city of draft) {
        city.answer = "";
      }
    });
  }, [setCities]);

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Eraser />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>回答を削除する</AlertDialogTitle>
          <AlertDialogDescription>
            入力した回答をすべて削除します。元に戻すことはできません。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>やっぱりやめる</AlertDialogCancel>
          <AlertDialogDestructiveAction onClick={handleOnClearAnswer}>
            すべての回答を削除する
          </AlertDialogDestructiveAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const AnsweredCounter = () => {
  const numberOfAnswered = useAtomValue(numOfAnsweredAtom);
  const cities = useAtomValue(quizDataAtom);

  return (
    <div className="h-fit flex items-center gap-2">
      <div>
        回答数 <span className="text-2xl">{numberOfAnswered}</span>
        {` / ${cities.length}`}
      </div>
      <AnswerEraser />
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
