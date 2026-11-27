import styles from './index.module.css'
import Title from '../../../components/ContentTitle'
import Accounts from './Accounts'
import Skill from './Skill/index.client'
import { HexagonWrap, HexagonGroup, Hexagon } from './Hexagon'
import ProfileIcon from './ProfileIcon'
import History from './History'

export default function About() {
  return (
    <div className={styles.wrap}>
      <Title>About</Title>
      <section className={styles.section}>
        <div className={styles.profile}>
          <ProfileIcon />
          <div className={styles.name}>
            <h2>Kohta Ito@koh110</h2>
            <h3>Web Engineer</h3>
            <div className={styles.desc}>
              <p className={styles.line}>
                フロントエンド/サーバサイド/インフラ/ヒアリング/要件定義までなんでも
              </p>
              <p className={styles.line}>
                技術を使って驚かせたり楽しませたりすることが好きです
              </p>
            </div>
          </div>
        </div>
        <Accounts />
      </section>
      <section className={`${styles.skill} ${styles.section}`}>
        <h3>Skills</h3>
        <h4>主な技術・対応領域</h4>
        <span>
          Node.js・JavaScriptを中心に、SPAを含むWebシステムの構築を得意としています。
        </span>
        <span>
          一人でシステムの設計から開発・運用、パフォーマンス調査・改善まで対応できます。
        </span>
        <Skill
          title="Frontend"
          skills={[
            { name: 'React', num: 80 },
            { name: 'TypeScript', num: 80 },
            { name: 'Angular', num: 30 },
            { name: 'AngularJS', num: 20 },
            { name: 'jQuery', num: 20 }
          ]}
        />
        <Skill
          title="Backend"
          skills={[
            { name: 'Node.js', num: 100 },
            { name: 'express', num: 60 },
            { name: 'Hono', num: 20 },
            { name: 'Next.js', num: 20 },
            { name: 'PHP/Ruby/Java/Go/etc...', num: 5 }
          ]}
        />
        <Skill
          title="Design"
          skills={[
            { name: 'HTML/CSS/CSS3', num: 50 },
            { name: 'Tailwind CSS', num: 20 },
            { name: 'MUI/Emotion', num: 20 },
            { name: 'styled-components/Sass', num: 10 }
          ]}
        />
        <section className={styles.others}>
          <div className={styles.title}>Others</div>
          <HexagonWrap>
            <HexagonGroup>
              <Hexagon>Lighthouse</Hexagon>
              <Hexagon>Prisma.js</Hexagon>
            </HexagonGroup>
            <HexagonGroup>
              <Hexagon>webpack</Hexagon>
              <Hexagon>vite</Hexagon>
            </HexagonGroup>
            <HexagonGroup>
              <Hexagon>Redux</Hexagon>
              <Hexagon>Recoil</Hexagon>
            </HexagonGroup>
            <HexagonGroup>
              <Hexagon>Puppeteer</Hexagon>
              <Hexagon>Kubernetes</Hexagon>
            </HexagonGroup>
            <HexagonGroup>
              <Hexagon>MongoDB</Hexagon>
              <Hexagon>Redis</Hexagon>
            </HexagonGroup>
            <HexagonGroup>
              <Hexagon>MySQL</Hexagon>
              <Hexagon>PostgreSQL</Hexagon>
            </HexagonGroup>
            <HexagonGroup>
              <Hexagon>Docker</Hexagon>
              <Hexagon>Docker Compose</Hexagon>
            </HexagonGroup>
            <HexagonGroup>
              <Hexagon>Chef</Hexagon>
              <Hexagon>Fabric</Hexagon>
            </HexagonGroup>
            <HexagonGroup>
              <Hexagon>CircleCI</Hexagon>
              <Hexagon>GitHub Actions</Hexagon>
            </HexagonGroup>
            <HexagonGroup>
              <Hexagon>Screwdriver.cd</Hexagon>
              <Hexagon>Jenkins</Hexagon>
            </HexagonGroup>
            <HexagonGroup>
              <Hexagon>Ubuntu</Hexagon>
              <Hexagon>CentOS</Hexagon>
            </HexagonGroup>
            <HexagonGroup>
              <Hexagon>nginx</Hexagon>
              <Hexagon>Apache HTTP Server</Hexagon>
            </HexagonGroup>
            <HexagonGroup>
              <Hexagon>ElasticSearch</Hexagon>
              <Hexagon>Dev-Ops</Hexagon>
            </HexagonGroup>
          </HexagonWrap>
        </section>
      </section>
      <section
        className={`${styles.section} ${styles.history}`}
        aria-labelledby="career-history-heading"
      >
        <h3 id="career-history-heading">職務経歴</h3>
        <History />
      </section>
      <section
        className={`${styles.section} ${styles.history}`}
        aria-labelledby="writing-teaching-heading"
      >
        <h3 id="writing-teaching-heading">執筆・教育活動</h3>
        <ul>
          <li>
            <a
              href="https://amzn.to/4b2hrIQ"
              target="_blank"
              rel="noopener noreferrer"
            >
              実践Node.js入門の執筆・出版
            </a>
          </li>
          <li>
            <a
              href="https://www.amazon.co.jp/dp/B08KDNPT2B/ref=as_sl_pc_qf_sp_asin_til?tag=koh110-22&linkCode=w00&linkId=97b56cbebbad2dac7ae8918ad4e43b1f&creativeASIN=B08KDNPT2B"
              target="_blank"
              rel="noopener noreferrer"
            >
              動かして学ぶ! Slackアプリ開発入門の執筆・出版
            </a>
          </li>
          <li>
            <a
              href="https://syllabus.hosei.ac.jp/web/preview.php?no_id=2500188&nendo=2024&gakubueng=AK"
              target="_blank"
              rel="noopener noreferrer"
            >
              法政大学リクエスト集中講義（Node.js / JavaScript）
            </a>
          </li>
        </ul>
      </section>
    </div>
  )
}
