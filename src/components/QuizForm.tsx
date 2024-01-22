import { isSameCity } from "@/features/quiz/quiz";
import { cn } from "@/lib/utils";
import { useAtom, useAtomValue } from "jotai";
import { useEffect } from "react";
import { DefaultValues, FieldValues, useForm } from "react-hook-form";
import type { HokkaidoTopology } from "../HokkaidoTopology";
import { answerModeAtom, quizDataAtom } from "../atom";

interface Props {
  topology: HokkaidoTopology;
  selectedCityId: string | undefined;
  onSelect?: (cityId: string) => void;
}

export const QuizForm = ({ topology, selectedCityId, onSelect }: Props) => {
  const answerMode = useAtomValue(answerModeAtom);

  const [cities, setCities] = useAtom(quizDataAtom);
  const { register, setFocus } = useForm({
    values: cities.reduce<DefaultValues<FieldValues>>((acc, city) => {
      acc[city.code] = city.answer;
      return acc;
    }, {}),
  });

  const handleOnSelect = (code: string) => {
    onSelect?.(code);
  };

  const handleOnClickForm = (code: string) => {
    setFocus(code);
  };

  useEffect(() => {
    if (selectedCityId) {
      setFocus(selectedCityId);
    }
  }, [selectedCityId, setFocus]);

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
                  onInput={(e) => {
                    setCities((draft) => {
                      const targetCity = draft.find(
                        (c) => c.code === city.code
                      );
                      if (targetCity) {
                        targetCity.answer = e.currentTarget.value;
                      }
                    });
                  }}
                  onSelect={() => handleOnSelect(city.code)}
                  readOnly={answerMode}
                  className={cn(
                    "text-gray-900 bg-transparent border-0 focus:ring-0 focus-visible:outline-none"
                  )}
                  {...register(city.code)}
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
