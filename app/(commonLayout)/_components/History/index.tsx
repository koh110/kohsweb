import HistoryElement from './HistoryElement'
import HistoryDetail from './HistoryDetail'

export default function History() {
  return (
    <div>
      <HistoryElement date="2022/07-">
        <HistoryDetail title="RPGテック合同会社（エンジニア/コンサルタント）">
          <p>スタートアップの立ち上げや新規事業の企画/開発/運用を一緒に</p>
          <p>技術顧問としてエンジニアやシステム支援の提供</p>
          <ul>
            <li>
              <p>
                災害検知向けエッジAIプラットフォーム（
                <a
                  href="https://visnu.jp/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visnu
                </a>
                ）の立ち上げ
              </p>
              <p>
                企画/要件定義/設計/実装/運用まで横断して担当
              </p>
            </li>
            <li>
              <p>
                バックオフィスDXの推進、ワークフロー整理/改善・自動化・システム開発の提案/運用
              </p>
              <ul style={{ marginTop: '0.5em' }}>
                <li>
                  各種申請/入退社/人事評価/広報チェックなどの手動運用コストが高い社内業務の改善提案/システム実装など、情シス的な業務のサポート
                </li>
                <li>
                  SpreadSheet/GASを利用した自動化/社内運用改善/社内システム化の開発
                </li>
              </ul>
            </li>
            <li>
              <p>飲食業界DXのSaaS開発。人事管理/オンボーディング/etc...</p>
              <p>システム設計/認証認可/実装/運用</p>
            </li>
          </ul>
        </HistoryDetail>
      </HistoryElement>
      <HistoryElement date="2021-2022/07">
        <HistoryDetail title="ヤフー株式会社: CTO室に社内異動">
          <p>
            全社横断のフロントエンド領域を担当。Webパフォーマンス向上施策とIE11のサポート等終了対応。
          </p>
        </HistoryDetail>
        <ul>
          <li>
            <a
              href="https://codezine.jp/article/detail/15443"
              target="_blank"
              rel="noopener noreferrer"
            >
              ヤフー社内で実践しているWebパフォーマンス改善ことはじめ
            </a>
          </li>
          <li>
            <a
              href="https://techblog.yahoo.co.jp/entry/2022021630265506/"
              target="_blank"
              rel="noopener noreferrer"
            >
              ヤフーのIE11 サポート終了の進め方
            </a>
          </li>
        </ul>
      </HistoryElement>
      <HistoryElement date="2017-2022/07">
        <HistoryDetail title="ヤフー株式会社: 技術広報・Webフロントエンド領域の専門活動">
          <p>
            クリエイターエバンジェリスト（2018年まで）として技術広報に近い活動
          </p>
          <p>
            2019年から、第9代・第10代・第11代Webフロントエンド
            <a
              href="https://about.yahoo.co.jp/hr/workplace/mypolaris/"
              target="_blank"
              rel="noopener noreferrer"
            >
              黒帯
            </a>
            に認定（ヤフーの専門領域におけるスペシャリスト認定制度）
          </p>
        </HistoryDetail>
        <ul>
          <li>
            <a
              href="https://about.yahoo.co.jp/hr/linotice/20201218.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              ヤフーの黒帯制度とは？
            </a>
          </li>
          <li>
            <a
              href="https://about.yahoo.co.jp/hr/linotice/20210910.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              ヤフー第10代黒帯が語る最新技術動向
            </a>
          </li>
          <li>
            <a
              href="https://about.yahoo.co.jp/hr/linotice/20220207.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              第11代Webフロントエンド黒帯が語る
            </a>
          </li>
        </ul>
      </HistoryElement>
      <HistoryElement date="2016-2022/07">
        <HistoryDetail title="ヤフー株式会社: Node.jsサポートチームの立ち上げ">
          <p>社内のNode.js利用支援、ハンズオンの実施</p>
          <p>Node.jsや利用OSSへのフィードバック、バグ修正</p>
        </HistoryDetail>
        <ul>
          <li>
            <a
              href="https://about.yahoo.co.jp/hr/linotice/20171013.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              Node.js勉強会
            </a>
          </li>
          <li>
            <a
              href="https://techblog.yahoo.co.jp/javascript/nodejs/Node-es6/"
              target="_blank"
              rel="noopener noreferrer"
            >
              ES6時代のNode.js
            </a>
          </li>
          <li>
            <a
              href="https://www.slideshare.net/techblogyahoo/yjtc18-a6-nodejs"
              target="_blank"
              rel="noopener noreferrer"
            >
              ヤフーのNode.js
            </a>
          </li>
          <li>
            <a
              href="https://eh-career.com/engineerhub/entry/2019/08/08/103000"
              target="_blank"
              rel="noopener noreferrer"
            >
              Node.js徹底攻略 ─
              ヤフーのノウハウに学ぶ、パフォーマンス劣化やコールバック地獄との戦い方
            </a>
          </li>
        </ul>
      </HistoryElement>
      <HistoryElement date="2013-2021">
        <HistoryDetail title="ヤフー株式会社: 情報システム本部での社内システム開発・運用">
          <p>社内システムの企画・開発・運用とチームマネジメントを担当。</p>
          <p>
            <strong>主なシステム</strong>
          </p>
          <ul>
            <li>内製チャット、社内ポータル</li>
            <li>社員プロフィール（名簿）ツール、アンケート作成・回答ツール</li>
            <li>承認管理プラットフォーム、社内位置情報検索システム</li>
          </ul>
          <p>
            <strong>Slack導入</strong>
          </p>
          <p>
            導入に向けた移行推進に加え、周辺連携システムの開発、セキュリティ設計、ワークスペース設計を担当。
          </p>
          <ul>
            <li>
              <a
                href="https://codezine.jp/article/detail/10693"
                target="_blank"
                rel="noopener noreferrer"
              >
                ヤフーを支える社内システム
              </a>
            </li>
            <li>
              <a
                href="https://techblog.yahoo.co.jp/advent-calendar-2016/pozzy/"
                target="_blank"
                rel="noopener noreferrer"
              >
                ヤフーの社内システムを紹介します
              </a>
            </li>
            <li>
              <a
                href="https://speakerdeck.com/koh110/nodexue-yuan-ji-2017"
                target="_blank"
                rel="noopener noreferrer"
              >
                社内位置情報検索システム
              </a>
            </li>
            <li>
              <a
                href="https://techblog.yahoo.co.jp/advent-calendar-2018/goodbye-mym/"
                target="_blank"
                rel="noopener noreferrer"
              >
                ありがとう、MYM 安らかに眠れ
              </a>
            </li>
            <li>
              <a
                href="https://techblog.yahoo.co.jp/advent-calendar-2018/thankyou-mym/"
                target="_blank"
                rel="noopener noreferrer"
              >
                おつかれさま、MYM
              </a>
            </li>
          </ul>
        </HistoryDetail>
      </HistoryElement>
      <HistoryElement date="-2013">
        <p>法政大学情報科学部 卒業</p>
        <p>HAL東京夜間ゲーム学科 卒業</p>
      </HistoryElement>
    </div>
  )
}
