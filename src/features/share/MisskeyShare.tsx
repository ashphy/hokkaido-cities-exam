import { ShareButton } from "./ShareButton";
import misskey from "./misskey.png";

interface Props {
  text: string;
}

export const MisskeyShare = ({ text }: Props) => {
  const handleOnClick = () => {
    // https://misskey-hub.net/ja/tools/share-link-generator/
    const params = new URLSearchParams({
      text,
      url: import.meta.env.VITE_BASE_URL,
      visibility: "public",
      localOnly: "0",
    });
    const openUrl = `https://misskey-hub.net/share/?${params.toString()}`;
    window.open(openUrl, "_blank");
    return false;
  };

  return (
    <ShareButton
      snsName="Misskey"
      image={misskey}
      onClick={handleOnClick}
      className="bg-sns-misskey hover:bg-sns-misskey/90"
    >
      Misskeyでシェア
    </ShareButton>
  );
};
