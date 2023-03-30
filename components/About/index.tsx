import styles from './index.module.css'
import Title from '../ContentTitle'
import Accounts from './Accounts'
import Skill from './Skill/index'
import { HexagonWrap, HexagonGroup, Hexagon } from './Hexagon'
import ProfileIcon from './ProfileIcon/index'
import History from './History'

export default function About() {
  return (
    <>
      <Title>About</Title>
      <section className  ={styles.section}>
        <div className={styles.profile}>
          <ProfileIcon />
          <div className={styles.name}>
            <h2>Kohta Ito@koh110</h2>
            <h3>Web Engineer</h3>
            <div className={styles.desc}>
              <p className={styles.line}>
                フロントエンド/サーバサイド/インフラ整備までWebならなんでも。
              </p>
              <p className={styles.line}>
                技術を使って驚かせたり楽しませたりが好きです。
              </p>
            </div>
          </div>
        </div>
        <Accounts />
      </section>
      <section className={`${styles.skill} ${styles.section}`}>
        <h3>Skills</h3>
        <h4>I love Node.js and JavaScript!!</h4>
        <span>システム構築をSPA+Node.jsで行うのが得意です。</span>
        <span>
          一人でざっくりとシステムの設計/開発/運用/パフォーマンス調査・チューニングの対応が可能です。
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
          title="Design"
          skills={[
            { name: 'HTML/CSS/CSS3', num: 50 },
            { name: 'MUI', num: 30 },
            { name: 'Sass', num: 20 }
          ]}
        />
        <Skill
          title="Backend"
          skills={[
            { name: 'Node.js', num: 80 },
            { name: 'express', num: 60 },
            { name: 'Next.js', num: 30 },
            { name: 'PHP', num: 10 },
            { name: 'Java/Go/etc...', num: 5 }
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
      <section className={`${styles.section} ${styles.history}`}>
        <History />
      </section>
    </>
  )
}
