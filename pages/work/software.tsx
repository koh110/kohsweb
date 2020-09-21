import { PageComponent } from '../../types/Component'
import WorkWrapper from '../../components/WorkWrapper'
import Element from '../../components/SoftwareElement'
import Layout from '../../components/Layout'

const npmImage = '/npm-logo-simplifed-with-white-space.png'

const softs: { url: string; img?: string; title: string; desc: string }[] = [
  {
    url: 'https://www.npmjs.com/package/rmtcmd',
    img: npmImage,
    title: 'rmtcmd',
    desc:
      'async/await でかけるシンプルなSSHクライアント。fabricのような手軽さでデプロイスクリプトを作るために作成'
  },
  {
    url: 'https://www.npmjs.com/package/japanese-date',
    img: npmImage,
    title: 'japanese-date',
    desc:
      '日本語からDateオブジェクトを取得するparser。チャットボットに日本語で話かけるために作成'
  },
  {
    url: 'https://www.npmjs.com/package/outerclick',
    img: npmImage,
    title: 'outerclick',
    desc:
      '要素の外をクリックした時に発火するイベントハンドラを提供するJavaScriptモジュール'
  },
  {
    url:
      'https://chrome.google.com/webstore/detail/twit-web-switcher/hedkbblkbhiagpppkgcbmkojnlphmcca?hl=ja',
    title: 'twit-web-switcher',
    desc: 'twitterのアカウントを切り替えるchrome拡張'
  }
]

const Software: PageComponent = () => {
  return (
    <WorkWrapper>
      <div>
        <h2>Software</h2>
        <div>いままで作ったやつを忘れないようにするやつ</div>
        {softs.map((e, i) => (
          <Element key={`${i}-${e.title}`} {...e} />
        ))}
      </div>
    </WorkWrapper>
  )
}

Software.Layout = Layout

export default Software
