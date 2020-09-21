import WorkWrapper from './WorkWrapper'
import Element from './LogElement'

const logs: {
  url: string
  title: string
  date: string
  desc: string
  img: string
  doc?: string
}[] = [
  {
    title: 'ヤフー福岡 Tech Meetup #5',
    url: 'https://yahoo-fukuoka.connpass.com/event/142571/',
    img:
      'https://connpass-tokyo.s3.amazonaws.com/thumbs/76/24/76243196f5fa8d10313054f4dfc44007.png',
    date: '2019/09/17',
    desc: '大規模Slackをセキュアに運用するためのTips'
  },
  {
    title:
      'Node.js徹底攻略 ─ ヤフーのノウハウに学ぶ、パフォーマンス劣化やコールバック地獄との戦い方',
    url: 'https://employment.en-japan.com/engineerhub/entry/2019/08/08/103000',
    img:
      'https://cdn-ak.f.st-hatena.com/images/fotolife/b/blog-media/20190801/20190801212613.jpg',
    date: '2019/08/08',
    desc: 'ヤフーでのNode.js利用についてのインタビュー'
  },
  {
    title: '関西Node学園 6時限目',
    date: '2019/05/09',
    url: 'https://nodejs.connpass.com/event/126358/',
    img:
      'https://connpass-tokyo.s3.amazonaws.com/thumbs/42/eb/42eb10e3566c37dd6f200049cd04b142.png',
    desc: 'Node.jsに半年かけてコミットして得た知見について',
    doc: 'https://speakerdeck.com/koh110/nodejs-commit'
  },
  {
    title: 'Callback を撲滅せよ',
    date: '2018/12/25',
    url: 'https://techblog.yahoo.co.jp/javascript/nodejs/callback-to-promise/',
    img: 'https://s.yimg.jp/images/tecblog/website/v1/images/ogp.png',
    desc: 'CallbackをPromise化する手法について'
  },
  {
    title: 'おつかれさま、MYM 〜僕とMYMのフロントエンド戦争〜',
    date: '2018/12/25',
    url: 'https://techblog.yahoo.co.jp/advent-calendar-2018/thankyou-mym/',
    img:
      'https://s.yimg.jp/images/tecblog/2018-2H/thankyou-mym/thankyoumym_ogp.png',
    desc: '内製チャットシステムMYMのフロントエンドの仕組みについて'
  },
  {
    title: '市ヶ谷Geek★Night #18 フロントエンド、マジ卍',
    date: '2018/03/26',
    url: 'https://ichigayageek.connpass.com/event/87792/',
    img:
      'https://connpass-tokyo.s3.amazonaws.com/thumbs/e1/5d/e15d8c9a06f047d8e37080de466685d5.png',
    desc:
      'Angularと私。自分がいなくなっても破綻しないようなフロントエンドを残すための試行錯誤について',
    doc: 'https://speakerdeck.com/koh110/angular-and-me'
  },
  {
    title: 'Bonfire Frontend #1',
    date: '2018/03/26',
    url: 'https://yj-meetup.connpass.com/event/58718/',
    img:
      'https://connpass-tokyo.s3.amazonaws.com/thumbs/d1/28/d1284989fa5d17e979cd69f88d62cef1.png',
    desc:
      '僕の考えるフロントエンドエンジニアの生き残り方。技術的な話というよりエモな感じ',
    doc: 'https://speakerdeck.com/koh110/bonfire-frontend-number-1'
  },
  {
    title: 'デブサミ2018',
    date: '2018/02/16',
    url: 'https://codezine.jp/article/detail/10693',
    img: 'https://codezine.jp/static/images/article/10693/10693_og.jpg',
    desc: '「ヤフーを支える社内システム」ヤフーの情シスについて',
    doc: 'https://www.slideshare.net/techblogyahoo/devsumi-16a2'
  },
  {
    title: 'INSIDE FRONTEND',
    date: '2018/02/11',
    url: 'https://inside-frontend.com/#ama-c3-2',
    img: 'https://inside-frontend.com/stat/ogimage_issue_3.png',
    desc:
      'コンポーネント座談会。React, Angular, Vueのコンポーネントをどう設計しているか。誘って頂いた。'
  },
  {
    title: 'Yahoo! JAPAN Tech Conference',
    date: '2018/01/27',
    url: 'https://techconference.yahoo.co.jp/2018/',
    img: 'https://s.yimg.jp/images/techconf/2018/images/ogp_image.png',
    desc:
      'ヤフーのNode.js。ヤフーでなぜNode.jsを使うのか。どこで使われているのか。',
    doc: 'https://www.slideshare.net/techblogyahoo/yjtc18-a6-nodejs'
  },
  {
    title: '東京Node学園祭2017',
    date: '2017/11/25',
    url: 'https://nodefest.jp/2017/schedule.html',
    img: 'https://nodefest.jp/2017/img/ogimage.png',
    desc:
      'スポンサートークの枠を使ってひたすらNode.jsで作ったシステムの話をしていた。',
    doc: 'https://speakerdeck.com/koh110/nodexue-yuan-ji-2017'
  },
  {
    title:
      'Node.jsのコミッターを迎え、炎の特訓—Node.js社内勉強会はこうして始まった',
    date: '2017/10/13',
    url: 'https://linotice.tumblr.com/post/166348035844/20171013',
    img:
      'https://66.media.tumblr.com/f1ea3ed85f4dcd19447186ab41f9771b/tumblr_inline_oxq22uRv9h1utbyrh_540.jpg',
    desc: '社内のNode.jsサポートチームのはなし'
  },
  {
    title: 'ヤフーの社内システムを紹介します',
    date: '2016/12/05',
    url: 'https://techblog.yahoo.co.jp/advent-calendar-2016/pozzy/',
    img: 'https://s.yimg.jp/images/tecblog/2016-2H/advent-image.png',
    desc: 'ヤフーの内製IoT社内システムの紹介'
  },
  {
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
      <div>
        <h2>Log</h2>
        <div>いままで出たやつを忘れないようにするやつ</div>
        {logs.map((e, i) => (
          <Element {...e} key={`${i}-${e.title}`} />
        ))}
      </div>
    </WorkWrapper>
  )
}
export default Log
