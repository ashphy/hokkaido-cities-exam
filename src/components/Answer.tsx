import { answerModeAtom, numOfCorrectAtom, quizDataAtom } from "@/atom";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { useAtomValue, useSetAtom } from "jotai";
import { Button } from "./ui/button";

export const Answer = () => {
  const setAnswerMode = useSetAtom(answerModeAtom);
  const cities = useAtomValue(quizDataAtom);

  const numberOfCities = cities.length;
  const numberOfCorrectAnswers = useAtomValue(numOfCorrectAtom);

  return (
    <Dialog
      onOpenChange={() => {
        setAnswerMode(true);
      }}
    >
      <DialogTrigger asChild>
        <div className="py-4">
          <Button className="w-full">答え合わせ</Button>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>北海道市町村テスト 答え合わせ</DialogTitle>
          <DialogDescription>
            <div className="text-center">
              <span className="text-9xl text-red-800">
                {numberOfCorrectAnswers}
              </span>
              <span className="text-6xl"> / {numberOfCities}</span>
              <span className="text-xl"> 市町村 正解！</span>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button">正解を見る</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
