import { useAtom, useAtomValue } from "jotai";
import { RefObject, createRef, useEffect, useRef } from "react";
import type { HokkaidoTopology } from "../HokkaidoTopology";
import { answerModeAtom, quizDataAtom } from "../atom";
import { cn } from "@/lib/utils";
import { isSameCity } from "@/features/quiz/quiz";

interface Props {
  topology: HokkaidoTopology;
  selectedCityId: string | undefined;
  onSelect?: (cityId: string) => void;
}

export const QuizForm = ({ topology, selectedCityId, onSelect }: Props) => {
  const answerMode = useAtomValue(answerModeAtom);
  const [cities, setCities] = useAtom(quizDataAtom);

  const listRefs = useRef<RefObject<HTMLInputElement>[]>([]);
  cities.forEach((_, i) => {
    listRefs.current[i] = createRef<HTMLInputElement>();
  });

  const handleOnClickForm = (code: string) => {
    const refIndex = cities.findIndex((c) => c.code === code);
    const ref = listRefs.current[refIndex];
    ref.current?.focus();
  };

  useEffect(() => {
    if (selectedCityId) {
      const refIndex = cities.findIndex((c) => c.code === selectedCityId);
      const ref = listRefs.current[refIndex];
      ref.current?.focus();
    }
  }, [cities, selectedCityId]);

  if (!topology.objects.hokkaido) {
    return <div>loading...</div>;
  }

  return (
    <div className="h-full overflow-y-scroll scroll-smooth pr-2">
      <div className="flex flex-col gap-4 pl-2 pr-3">
        {cities.map((city, index) => {
          return (
            // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
            <div
              key={city.code}
              className="flex flex-col gap-2 snap-start h-full"
              onClick={() => handleOnClickForm(city.code)}
            >
              <div
                className={cn(
                  // 共通スタイル
                  "grid grid-cols-[2rem_1fr] gap-3 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-sky-600 p-2",
                  // 正解
                  answerMode &&
                    isSameCity(city.name, city.answer) &&
                    "bg-green-100 focus-within:ring-green-600",
                  // 不正解
                  answerMode &&
                    !isSameCity(city.name, city.answer) &&
                    "bg-red-100 focus-within:ring-red-600"
                )}
              >
                <p className="text-right text-gray-700">{index + 1}</p>
                <input
                  type="text"
                  ref={listRefs.current[index]}
                  onChange={(e) => {
                    setCities((draft) => {
                      const targetCity = draft.find(
                        (c) => c.code === city.code
                      );
                      if (targetCity) {
                        targetCity.answer = e.currentTarget.value;
                      }
                    });
                  }}
                  value={city.answer}
                  onSelect={() => onSelect?.(city.code)}
                  readOnly={answerMode}
                  className={cn(
                    "text-gray-900 bg-transparent border-0 focus:ring-0 focus-visible:outline-none"
                  )}
                />
              </div>
              {answerMode && (
                <div className="self-end text-muted-foreground">
                  {city.name}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
