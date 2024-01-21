import { ExternalLinkComponent } from "./ui/ExternalLink";

export const License = () => {
  return (
    <div className="h-full flex justify-end items-end text-sm leading-6 text-slate-600 p-2">
      <ul>
        <li>
          白地図は
          <ExternalLinkComponent href="https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-N03-v3_1.html">
            「国土数値情報（行政区域データ）」（国土交通省）
          </ExternalLinkComponent>
          を加工して作成しました。
        </li>
        <li>
          北海道の市町村一覧は
          <ExternalLinkComponent href="https://www.pref.hokkaido.lg.jp/link/shichoson/aiueo.html">
            北海道オープンデータ CC-BY4.0
          </ExternalLinkComponent>
          に基づいて作成しました。
        </li>
      </ul>
    </div>
  );
};
