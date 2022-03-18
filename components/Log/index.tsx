import WorkWrapper from '../WorkWrapper'
import { LogElement, Props as Log } from './LogElement'
import { AmazonElement, Props as AmazonLog } from './AmazonElement'

const logs: (Log | AmazonLog)[] = [
  {
    type: 'log',
    title: 'ヤフーのIE11 サポート終了の進め方',
    url: 'https://techblog.yahoo.co.jp/entry/2022021630265506/',
    img: 'https://s.yimg.jp/images/tecblog/2021-H2/ie11/ogp_20220215T115912.png',
    date: '2022/02/16',
    desc: 'IE11のEOL対応で考えた事や調査したことのまとめ'
  },
  {
    type: 'log',
    title:
      'ヤフー社内で実践しているWebパフォーマンス改善ことはじめ～Web Vitalsの計測と改善手法',
    url: 'https://codezine.jp/article/detail/15443',
    img: 'https://codezine.jp/static/images/article/15443/15443_og.png',
    date: '2022/02/10',
    desc: 'ヤフーで行っているWebパフォーマンス向上PJで作成している改善の始め方ドキュメントを公開'
  },
  {
    type: 'log',
    title:
      '第11代Webフロントエンド黒帯が語る──私たちはこうして鍛えられ、エキスパートになった',
    url: 'https://about.yahoo.co.jp/hr/linotice/20220207.html',
    img: 'https://s.yimg.jp/i/docs/integrate/images/hr/linotice/kuroobi4.png',
    date: '2022/02/07',
    desc: '黒帯インタビュー'
  },
  {
    type: 'log',
    title:
      'ヤフー第10代黒帯が語る最新技術動向 ──ネットワーク・セキュリティ、自然言語処理、iOSアプリ、アクセシビリティ、ビジュアルデザイン',
    url: 'https://about.yahoo.co.jp/hr/linotice/20210910.html',
    img: 'https://s.yimg.jp/i/docs/integrate/images/hr/linotice/kuroobi4.png',
    date: '2021/09/10',
    desc: '社内でやった黒帯LTのまとめ'
  },
  {
    type: 'log',
    title: 'Cybozu Frontend Monthly #9',
    url: 'https://github.com/cybozu/frontend-monthly/blob/master/posts/2021/03.md',
    img: 'https://connpass-tokyo.s3.amazonaws.com/thumbs/79/69/796994454f725bb78b68a577459a6288.png',
    date: '2021/03/30',
    desc: 'またゲストで呼んでいただいた。ちょうどSharedArrayBufferの件を追っていてCybouzuの方に聞いてみたいことがあったので持ち込み。'
  },
  {
    type: 'log',
    title:
      'ヤフーの黒帯制度とは？──第9代黒帯が語る「技術専門家として歩むキャリア」',
    url: 'https://about.yahoo.co.jp/hr/linotice/20201218.html',
    img: 'https://cms-pctr.c.yimg.jp/dk/iwiz-blog-cms/about/hr/linotice/kuroobi3.png',
    date: '2020/12/18',
    desc: '社内でやった黒帯LTのまとめ'
  },
  {
    type: 'amazon',
    title: '動かして学ぶ! Slackアプリ開発入門',
    date: '2020/12/14',
    desc: 'SlackSDKを利用したアプリの作成方法についての解説本。\n業務フローの例に合わせてSlackAPIとサンプルコードを一緒に追っていく形式。',
    html: `<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="https://rcm-fe.amazon-adsystem.com/e/cm?ref=qf_sp_asin_til&t=koh110-22&m=amazon&o=9&p=8&l=as1&IS1=1&detail=1&asins=B08KDNPT2B&linkId=97b56cbebbad2dac7ae8918ad4e43b1f&bc1=ffffff&amp;lt1=_blank&fc1=333333&lc1=0066c0&bg1=ffffff&f=ifr">
    </iframe>`
  },
  {
    type: 'log',
    title: 'Cybozu Frontend Monthly #4',
    url: 'https://cybozu.connpass.com/event/192820/',
    img: 'https://connpass-tokyo.s3.amazonaws.com/thumbs/4f/db/4fdb88e8a02cd395721bb06ed873a4a1.png',
    date: '2020/10/27',
    desc: 'ゲスト参加'
  },
  {
    type: 'log',
    title: 'ヤフーのフロントエンドとNode.jsの関係性',
    url: 'https://techblog.yahoo.co.jp/entry/20191120782387/',
    img: 'https://s.yimg.jp/images/tecblog/2019-H2/node.js/ogp_20191115T150404.png',
    date: '2019/11/20',
    desc: 'ヤフーの中でNode.jsがどう使われているかの紹介'
  },
  {
    type: 'log',
    title: 'ヤフー福岡 Tech Meetup #5',
    url: 'https://yahoo-fukuoka.connpass.com/event/142571/',
    img: 'https://connpass-tokyo.s3.amazonaws.com/thumbs/76/24/76243196f5fa8d10313054f4dfc44007.png',
    date: '2019/09/17',
    desc: '大規模Slackをセキュアに運用するためのTips'
  },
  {
    type: 'log',
    title:
      'Node.js徹底攻略 ─ ヤフーのノウハウに学ぶ、パフォーマンス劣化やコールバック地獄との戦い方',
    url: 'https://employment.en-japan.com/engineerhub/entry/2019/08/08/103000',
    img: 'https://cdn-ak.f.st-hatena.com/images/fotolife/b/blog-media/20190801/20190801212613.jpg',
    date: '2019/08/08',
    desc: 'ヤフーでのNode.js利用についてのインタビュー'
  },
  {
    type: 'log',
    title: '関西Node学園 6時限目',
    date: '2019/05/09',
    url: 'https://nodejs.connpass.com/event/126358/',
    img: 'https://connpass-tokyo.s3.amazonaws.com/thumbs/42/eb/42eb10e3566c37dd6f200049cd04b142.png',
    desc: 'Node.jsに半年かけてコミットして得た知見について',
    doc: 'https://speakerdeck.com/koh110/nodejs-commit'
  },
  {
    type: 'log',
    title: 'Callback を撲滅せよ',
    date: '2018/12/25',
    url: 'https://techblog.yahoo.co.jp/javascript/nodejs/callback-to-promise/',
    img: 'https://s.yimg.jp/images/tecblog/website/v1/images/ogp.png',
    desc: 'CallbackをPromise化する手法について'
  },
  {
    type: 'log',
    title: 'おつかれさま、MYM 〜僕とMYMのフロントエンド戦争〜',
    date: '2018/12/25',
    url: 'https://techblog.yahoo.co.jp/advent-calendar-2018/thankyou-mym/',
    img: 'https://s.yimg.jp/images/tecblog/2018-2H/thankyou-mym/thankyoumym_ogp.png',
    desc: '内製チャットシステムMYMのフロントエンドの仕組みについて'
  },
  {
    type: 'log',
    title: '市ヶ谷Geek★Night #18 フロントエンド、マジ卍',
    date: '2018/03/26',
    url: 'https://ichigayageek.connpass.com/event/87792/',
    img: 'https://connpass-tokyo.s3.amazonaws.com/thumbs/e1/5d/e15d8c9a06f047d8e37080de466685d5.png',
    desc: 'Angularと私。自分がいなくなっても破綻しないようなフロントエンドを残すための試行錯誤について',
    doc: 'https://speakerdeck.com/koh110/angular-and-me'
  },
  {
    type: 'log',
    title: 'Bonfire Frontend #1',
    date: '2018/03/26',
    url: 'https://yj-meetup.connpass.com/event/58718/',
    img: 'https://connpass-tokyo.s3.amazonaws.com/thumbs/d1/28/d1284989fa5d17e979cd69f88d62cef1.png',
    desc: '僕の考えるフロントエンドエンジニアの生き残り方。技術的な話というよりエモな感じ',
    doc: 'https://speakerdeck.com/koh110/bonfire-frontend-number-1'
  },
  {
    type: 'log',
    title: 'デブサミ2018',
    date: '2018/02/16',
    url: 'https://codezine.jp/article/detail/10693',
    img: 'https://codezine.jp/static/images/article/10693/10693_og.jpg',
    desc: '「ヤフーを支える社内システム」ヤフーの情シスについて',
    doc: 'https://www.slideshare.net/techblogyahoo/devsumi-16a2'
  },
  {
    type: 'log',
    title: 'INSIDE FRONTEND',
    date: '2018/02/11',
    url: 'https://inside-frontend.com/#ama-c3-2',
    img: 'https://inside-frontend.com/stat/ogimage_issue_3.png',
    desc: 'コンポーネント座談会。React, Angular, Vueのコンポーネントをどう設計しているか。誘って頂いた。'
  },
  {
    type: 'log',
    title: 'Yahoo! JAPAN Tech Conference',
    date: '2018/01/27',
    url: 'https://techconference.yahoo.co.jp/2018/',
    img: 'https://s.yimg.jp/images/techconf/2018/images/ogp_image.png',
    desc: 'ヤフーのNode.js。ヤフーでなぜNode.jsを使うのか。どこで使われているのか。',
    doc: 'https://www.slideshare.net/techblogyahoo/yjtc18-a6-nodejs'
  },
  {
    type: 'log',
    title: '東京Node学園祭2017',
    date: '2017/11/25',
    url: 'https://nodefest.jp/2017/schedule.html',
    img: 'https://nodefest.jp/2017/img/ogimage.png',
    desc: 'スポンサートークの枠を使ってひたすらNode.jsで作ったシステムの話をしていた。',
    doc: 'https://speakerdeck.com/koh110/nodexue-yuan-ji-2017'
  },
  {
    type: 'log',
    title:
      'Node.jsのコミッターを迎え、炎の特訓—Node.js社内勉強会はこうして始まった',
    date: '2017/10/13',
    url: 'https://about.yahoo.co.jp/hr/linotice/20171013.html',
    img: 'https://cms-pctr.c.yimg.jp/dk/iwiz-blog-cms/about/hr/linotice/kakou_kakou_42A3935.jpg',
    desc: '社内のNode.jsサポートチームのはなし'
  },
  {
    type: 'log',
    title: 'ヤフーの社内システムを紹介します',
    date: '2016/12/05',
    url: 'https://techblog.yahoo.co.jp/advent-calendar-2016/pozzy/',
    img: 'https://s.yimg.jp/images/tecblog/2016-2H/advent-image.png',
    desc: 'ヤフーの内製IoT社内システムの紹介'
  },
  {
    type: 'log',
    title: 'ES6時代のNode.js',
    date: '2015/12/02',
    url: 'https://techblog.yahoo.co.jp/javascript/nodejs/Node-es6/',
    img: 'https://i.yimg.jp/images/tecblog/2015-2H/advent_image.jpg',
    desc: 'Node.jsのES6対応について'
  }
]

const Log = () => {
  return (
    <WorkWrapper>
      <style jsx>{`
        .logs {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          column-gap: 2rem;
          row-gap: 2rem;
        }
      `}</style>
      <h2>Log</h2>
      <div className="logs">
        {logs.map((e, i) => {
          if (e.type === 'amazon') {
            return <AmazonElement {...e} key={`${i}-${e.title}`} />
          }
          return <LogElement {...e} key={`${i}-${e.title}`} />
        })}
      </div>
    </WorkWrapper>
  )
}
export default Log
