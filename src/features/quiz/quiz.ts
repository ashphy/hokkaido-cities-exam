import { City } from "./city";

export const isSameCity = (ansewer: string, userInput: string): boolean => {
  if (userInput.match(/.+?[市町村]$/)) {
    // ユーザーが市町村まで入力した場合は、市町村の一致まで比較する
    return ansewer === userInput;
  }

  // ユーザーが市町村をはぶいて入力した場合は、市町村名のみで比較する
  const normalizedAnswer = ansewer.replace(/市|町|村$/, "");
  return normalizedAnswer === userInput;
};

export const isCorrect = (city: City | undefined) => {
  if (city == null) {
    return false;
  }
  return isSameCity(city.name, city.answer);
};

export const isWrong = (city: City | undefined) => {
  return !isCorrect(city);
};
