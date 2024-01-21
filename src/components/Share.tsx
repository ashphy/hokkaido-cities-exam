import { numOfCorrectAtom, quizDataAtom } from "@/atom";
import { MastodonShare } from "@/features/share/MastodonShare";
import { MisskeyShare } from "@/features/share/MisskeyShare";
import { XShare } from "@/features/share/XShare";
import { useAtomValue } from "jotai";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

export const Share = () => {
  const cities = useAtomValue(quizDataAtom);
  const numberOfCities = cities.length;
  const numberOfCorrectAnswers = useAtomValue(numOfCorrectAtom);
  const shareText = `#北海道市町村テスト で${numberOfCities}市町村中${numberOfCorrectAnswers}市町村正解しました！`;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="py-4">
          <Button className="w-full">SNSでシェアする</Button>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-screen-md">
        <DialogHeader>
          <DialogTitle>北海道市町村テストをシェアしよう</DialogTitle>
          <DialogDescription>
            <DialogClose className="w-full">
              <div className="flex justify-between mt-4">
                <MastodonShare text={shareText} />
                <MisskeyShare text={shareText} />
                <XShare text={shareText} />
              </div>
            </DialogClose>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
