import { PageComponent } from '../../types/Component'
import WorkWrapper from '../WorkWrapper'
import { SoftwareElement, Props } from './SoftwareElement'

const npmImage = '/npm-logo-simplifed-with-white-space.png'

const softs: Props[] = [
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

export const Software: PageComponent = () => {
  return (
    <WorkWrapper>
      <style jsx>{`
        .soft {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          column-gap: 2rem;
          row-gap: 2rem;
        }
      `}</style>
      <div>
        <h2>Software</h2>
        <div className="soft">
          {softs.map((e, i) => (
            <SoftwareElement key={`${i}-${e.title}`} {...e} />
          ))}
        </div>
      </div>
    </WorkWrapper>
  )
}
