import { ShareButton } from "./ShareButton";
import mastodon from "./mastodon.svg";

interface Props {
  text: string;
}

export const MastodonShare = ({ text }: Props) => {
  const handleOnClick = () => {
    const openUrl = `https://donshare.net/share.html?text=${encodeURIComponent(
      text
    )}&url=${encodeURIComponent(import.meta.env.VITE_BASE_URL)}`;
    window.open(openUrl, "_blank", "width=500,height=600");
    return false;
  };

  return (
    <ShareButton
      snsName="Mastodon"
      image={mastodon}
      onClick={handleOnClick}
      className="bg-sns-mastodon hover:bg-sns-mastodon/90"
    >
      Mastodonでシェア
    </ShareButton>
  );
};
