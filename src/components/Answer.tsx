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
import { MastodonShare } from "@/features/share/MastodonShare";
import { MisskeyShare } from "@/features/share/MisskeyShare";
import { XShare } from "@/features/share/XShare";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { useAtomValue, useSetAtom } from "jotai";
import { Button } from "./ui/button";

export const Answer = () => {
  const setAnswerMode = useSetAtom(answerModeAtom);
  const cities = useAtomValue(quizDataAtom);

  const numberOfCities = cities.length;
  const numberOfCorrectAnswers = useAtomValue(numOfCorrectAtom);

  const shareText = `#北海道市町村テスト で${numberOfCities}市町村中「${numberOfCorrectAnswers}」市町村正解しました！`;

  return (
    <Dialog
      onOpenChange={(open: boolean) => {
        if (!open) setAnswerMode(true);
      }}
    >
      <DialogTrigger asChild>
        <div className="py-4">
          <Button className="w-full">答え合わせ</Button>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-screen-md w-11/12 md:w-full">
        <DialogHeader>
          <DialogTitle>北海道市町村テスト 答え合わせ</DialogTitle>
          <DialogDescription asChild>
            <div className="flex flex-col items-center">
              <div>
                <span className="text-9xl text-red-800">
                  {numberOfCorrectAnswers}
                </span>
                <span className="text-6xl"> / {numberOfCities}</span>
              </div>
              <span className="text-xl"> 市町村 正解！</span>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose className="w-full" asChild>
            <div
              className="
                flex flex-col flex-wrap gap-2 content-center w-full
                md:flex-row md:justify-between"
            >
              <MastodonShare text={shareText} />
              <MisskeyShare text={shareText} />
              <XShare text={shareText} />
            </div>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
