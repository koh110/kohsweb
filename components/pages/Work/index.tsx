'use client'

import Title from '../../ContentTitle'
import WorkElement, { type Props as WorkProps } from './WorkElement'
import AmazonElement, { type Props as AmazonLogProps } from './AmazonElement'
import styles from './index.module.css'

const npmImage = '/npm-logo-simplifed-with-white-space.png'

const books: AmazonLogProps[] = [
  {
    type: 'amazon',
    title: '実践Node.js入門',
    date: '2023/01/26',
    desc: [
      'Node.jsの入門書です。',
      '基礎知識、環境構築、重要文法、非同期、CLIツール開発、Expressを用いたサーバーサイドの開発やフロントエンド（React）との連携などNode.jsの全体像が学べます。'
    ].join(''),
    img: '/nodejs-book.jpg',
    url: `https://amzn.to/4b2hrIQ`,
    dangerouslySetInnerHTML: [
      `<div><a href="https://gihyo.jp/book/2023/978-4-297-12956-9" target="_blank">https://gihyo.jp/book/2023/978-4-297-12956-9</a></div>`,
      `<div style="margin-top: 1em;"><a href="https://www.hanbit.co.kr/store/books/look.php?p_code=B5038538340" target="_blank">韓国語版</a></div>`,
    ].join('')
  },
  {
    type: 'amazon',
    title: '動かして学ぶ! Slackアプリ開発入門',
    date: '2020/12/14',
    desc: 'SlackSDKを利用したアプリの作成方法についての解説本。\n業務フローの例に合わせてSlackAPIとサンプルコードを一緒に追っていく形式。',
    img: '/slack-book.jpg',
    url: `https://amzn.to/48zE5qE`,
    dangerouslySetInnerHTML: `<a href="https://www.shoeisha.co.jp/book/detail/9784798164748" target="_blank">https://www.shoeisha.co.jp/book/detail/9784798164748</a>`
  }
]

const softs: WorkProps[] = [
  {
    url: 'https://github.com/koh110/tiny-type-api',
    img: npmImage,
    title: 'tiny-type-api',
    desc: 'モノレポの時にAPI定義をclient/serverでうまく共有する方法を模索してできたライブラリ。tRPCからzodを抜いたようなシンプルで軽量なものが欲しかった'
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
    <div className={styles.wrap}>
      <Title>Work</Title>
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
    </div>
  )
}
