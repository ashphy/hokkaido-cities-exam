import { ShareButton } from "./ShareButton";
import x from "./x.svg";

interface Props {
  text: string;
}

export const XShare = ({ text }: Props) => {
  const handleOnClick = () => {
    const openUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      text
    )}&url=${encodeURIComponent(import.meta.env.VITE_BASE_URL)}`;
    window.open(openUrl, "_blank");
    return false;
  };

  return (
    <ShareButton
      snsName="X"
      image={x}
      onClick={handleOnClick}
      className="bg-sns-x hover:bg-sns-x/90"
    >
      Xでシェア
    </ShareButton>
  );
};
