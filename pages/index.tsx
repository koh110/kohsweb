import { PageComponent } from '../types/Component'
import styles from '../styles/Home.module.css'
import Layout from '../components/Layout'
import Title from '../components/ContentTitle'
import Accounts from '../components/Accounts'

const Index: PageComponent = () => {
  return (
    <>
      <Title>About</Title>
      <div className={styles.profile}>
        <figure className={styles.icon} />
        <div className={styles.name}>
          <h2>Kohta Ito</h2>
          <h3>Web Engineer</h3>
        </div>
        <div className={styles.desc}>
          <div className={styles.line}>
            CSS / フロントエンド / サーバサイド / インフラ整備まで Web
            ならなんでも。
          </div>
          <div className={styles.line}>
            技術を使って驚かせたり楽しませたりが好きです。
          </div>
        </div>
      </div>
      <div className={styles.skill}>
        <h3>Skill</h3>
        <h4>I love Node.js!!</h4>
        <ol>
          <li>
            <div>JavaScript</div> React, Angular, jQuery, AngularJS, TypeScript
          </li>
          <li>
            <div>Infrastructure</div>Chef Solo, Chef Server, Fablic
          </li>
          <li>
            <div>CI/CD</div>CircleCI, Screwdriver.cd, Jenkins
          </li>
          <li>
            <div>Database/KVS</div>MongoDB, Redis, MySQL, PostgreSQL
          </li>
          <li>
            <div>OS</div>Ubuntu, CentOS, Mac, Windows
          </li>
          <li>
            <div>Others</div>nginx, ElasticSearch, Docker-compose, CSS3, Sass,
            Dev-Ops, Android & iPhone App (Ionic or Native)
          </li>
        </ol>
      </div>
      <Accounts style={{ padding: '0 1em 0' }} />
    </>
  )
}

Index.Layout = Layout

export default Index
