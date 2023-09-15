import TimeLine, { type Props } from './TimeLine'
import Title from '../../ContentTitle'
import styles from './index.module.css'

const logs: Props['log'][] = [
  {
    type: 'log',
    title: 'Node学園41時限目 書籍について',
    url: 'https://nodejs.connpass.com/event/275061/',
    img: 'https://res.cloudinary.com/techfeed/image/upload/w_600,h_315,c_fill/v1649221766/assets/images/techfeed-conference-2022.png',
    date: '2023/02/28',
    desc: '実践Node.js入門について',
    doc: 'https://docs.google.com/presentation/d/1mjsMfYje30Oz2WRscti_pGbM6eKBZRJdoo1J1SKzo-g/edit?usp=sharing'
  },
  {
    type: 'log',
    title: 'TechFeed Conference 2022',
    url: 'https://techfeed.io/entries/62affbd30e97835bea17df44',
    img: 'https://res.cloudinary.com/techfeed/image/upload/w_600,h_315,c_fill/v1649221766/assets/images/techfeed-conference-2022.png',
    date: '2022/05/14',
    desc: 'Node.jsパフォーマンスチェックポイント'
  },
  {
    type: 'log',
    title: 'ヤフーのIE11 サポート終了の進め方',
    url: 'https://techblog.yahoo.co.jp/entry/2022021630265506/',
    img: 'https://s.yimg.jp/images/tecblog/2021-H2/ie11/ogp_20220215T115912.png',
    date: '2022/02/16',
    desc: 'IE11のEOL対応で考えた事や調査したこと'
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
    desc: 'ヤフー社内でやった黒帯LTのまとめ'
  },
  {
    type: 'log',
    title: 'Cybozu Frontend Monthly #9',
    url: 'https://cybozu.github.io/frontend-monthly/posts/2021-03/',
    img: 'https://cybozu.github.io/frontend-monthly/_astro/header.dc458974_ZIMvDY.webp',
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
    desc: 'ヤフー社内でやった黒帯LTのまとめ'
  },
  {
    type: 'log',
    title: 'Cybozu Frontend Monthly #4',
    url: 'https://cybozu.connpass.com/event/192820/',
    img: 'https://cybozu.github.io/frontend-monthly/_astro/header.dc458974_ZIMvDY.webp',
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
    img: 'https://media.connpass.com/thumbs/b5/fa/b5fa47e7a9ca4797a9ec31e69cd4a8f9.png',
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
    img: 'https://media.connpass.com/thumbs/fb/48/fb484024d6023d77d8437d7852d173d1.png',
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
    desc: 'ヤフー内製チャットシステムMYMのフロントエンドの仕組みについて'
  },
  {
    type: 'log',
    title: '市ヶ谷Geek★Night #18 フロントエンド、マジ卍',
    date: '2018/03/26',
    url: 'https://ichigayageek.connpass.com/event/87792/',
    img: 'https://media.connpass.com/thumbs/ad/e6/ade6dfeefcef0978abddec6c5a8ccc8a.png',
    desc: 'Angularと私。自分がいなくなっても破綻しないようなフロントエンドを残すための試行錯誤について',
    doc: 'https://speakerdeck.com/koh110/angular-and-me'
  },
  {
    type: 'log',
    title: 'Bonfire Frontend #1',
    date: '2018/03/26',
    url: 'https://yj-meetup.connpass.com/event/58718/',
    img: 'https://media.connpass.com/thumbs/d5/4b/d54bd198ac0fdf4f803e4091e257e798.png',
    desc: '僕の考えるフロントエンドエンジニアの生き残り方。技術的な話というより考え方よりな話',
    doc: 'https://speakerdeck.com/koh110/bonfire-frontend-number-1'
  },
  {
    type: 'log',
    title: 'デブサミ2018',
    date: '2018/02/16',
    url: 'https://codezine.jp/article/detail/10693',
    img: 'https://codezine.jp/static/images/article/10693/10693_og.jpg',
    desc: (
      <>
        <p>「ヤフーを支える社内システム」ヤフーの情シスについて</p>
        <p>
          <a
            href="https://togetter.com/li/1199992"
            target="_blank"
            rel="noopener noreferrer"
          >
            まとめ
          </a>
        </p>
        <p>
          <a
            href="https://codezine.jp/article/detail/11209"
            target="_blank"
            rel="noopener noreferrer"
          >
            話題賞を頂いた
          </a>
        </p>
      </>
    ),
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
    desc: 'ヤフー社内のNode.jsサポートチームのはなし'
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

export default function Log() {
  return (
    <div className={styles.wrap}>
      <Title>Log</Title>
      <div className={styles.logs}>
        {logs.map((e, i) => {
          return <TimeLine log={e} index={i} key={`${i}-${e.title}`} />
        })}
      </div>
    </div>
  )
}
