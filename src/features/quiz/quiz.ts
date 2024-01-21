export const isSameCity = (ansewer: string, userInput: string): boolean => {
  if (userInput.match(/.+?[市町村]$/)) {
    // ユーザーが市町村まで入力した場合は、市町村の一致まで比較する
    return ansewer === userInput;
  }

  // ユーザーが市町村をはぶいて入力した場合は、市町村名のみで比較する
  const normalizedAnswer = ansewer.replace(/市|町|村$/, "");
  return normalizedAnswer === userInput;
};
