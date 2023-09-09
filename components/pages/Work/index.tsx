'use client'

import WorkElement, { type Props as WorkProps } from './WorkElement'
import AmazonElement, { type Props as AmazonLogProps } from './AmazonElement'
import styles from './index.module.css'

const npmImage = '/npm-logo-simplifed-with-white-space.png'

const books: AmazonLogProps[] = [
  {
    type: 'amazon',
    title: '実践Node.js入門',
    date: '2023/01/26',
    desc: 'Node.jsの入門書です。基礎知識、環境構築、重要文法、非同期、CLIツール開発、Expressを用いたサーバーサイドの開発やフロントエンド（React）との連携などNode.jsの全体像が学べます。',
    html: `<iframe sandbox="allow-popups allow-scripts allow-modals allow-forms allow-same-origin" style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="//rcm-fe.amazon-adsystem.com/e/cm?lt1=_blank&bc1=FFFFFF&IS2=1&bg1=FFFFFF&fc1=000000&lc1=0000FF&t=koh110088-22&language=ja_JP&o=9&p=8&l=as4&m=amazon&f=ifr&ref=as_ss_li_til&asins=B0BRPT1M95&linkId=7f1ea5638a9f16794eb0739900f5a712"></iframe>`,
    dangerouslySetInnerHTML: `<a href="https://gihyo.jp/book/2023/978-4-297-12956-9" target="_blank">https://gihyo.jp/book/2023/978-4-297-12956-9</a>`
  },
  {
    type: 'amazon',
    title: '動かして学ぶ! Slackアプリ開発入門',
    date: '2020/12/14',
    desc: 'SlackSDKを利用したアプリの作成方法についての解説本。\n業務フローの例に合わせてSlackAPIとサンプルコードを一緒に追っていく形式。',
    html: `<iframe sandbox="allow-popups allow-scripts allow-modals allow-forms allow-same-origin" style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="//rcm-fe.amazon-adsystem.com/e/cm?lt1=_blank&bc1=000000&IS2=1&bg1=FFFFFF&fc1=000000&lc1=0000FF&t=koh110088-22&language=ja_JP&o=9&p=8&l=as4&m=amazon&f=ifr&ref=as_ss_li_til&asins=B08KDNPT2B&linkId=4c4d4b52279ed98db331dc2506316bc3"></iframe>`,
    dangerouslySetInnerHTML: `<a href="https://www.shoeisha.co.jp/book/detail/9784798164748" target="_blank">https://www.shoeisha.co.jp/book/detail/9784798164748</a>`
  }
]

const softs: WorkProps[] = [
  {
    url: 'https://github.com/koh110/tiny-type-api',
    img: npmImage,
    title: 'tiny-type-api',
    desc: 'モノレポの時にAPI定義をclient/serverでうまく共有する方法を模索してできたライブラリ。tRPCからzodを抜いたようなシンプルで軽量あやつが欲しかった'
  },
  {
    url: 'https://mzm.dev',
    img: '/mzm.png',
    title: 'MZM',
    desc: '独自チャットを技術の実験場として運用中'
  },
  {
    url: 'https://www.npmjs.com/package/rmtcmd',
    img: npmImage,
    title: 'rmtcmd',
    desc: 'async/await でかけるシンプルなSSHクライアント。fabricのような手軽さでデプロイスクリプトを作るために作成'
  },
  {
    url: 'https://www.npmjs.com/package/japanese-date',
    img: npmImage,
    title: 'japanese-date',
    desc: '日本語からDateオブジェクトを取得するparser。チャットボットに日本語で話かけるために作成'
  },
  {
    url: 'https://www.npmjs.com/package/outerclick',
    img: npmImage,
    title: 'outerclick',
    desc: '要素の外をクリックした時に発火するイベントハンドラを提供するJavaScriptモジュール'
  },
  {
    url: 'https://chrome.google.com/webstore/detail/twit-web-switcher/hedkbblkbhiagpppkgcbmkojnlphmcca?hl=ja',
    title: 'twit-web-switcher',
    desc: 'twitterのアカウントを切り替えるchrome拡張。更新停止したので落とした'
  }
]

export default function Work() {
  return (
    <>
      <div>
        <h2 className={styles.title}>Book</h2>
        <div className={styles.book}>
          {books.map((e, i) => {
            return <AmazonElement key={`${i}-${e.title}`} {...e} />
          })}
        </div>
        <h2>Software</h2>
        <div className={styles.soft}>
          {softs.map((e, i) => (
            <WorkElement key={`${i}-${e.title}`} {...e} />
          ))}
        </div>
      </div>
    </>
  )
}
