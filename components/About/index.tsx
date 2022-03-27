import React from 'react'
import css from 'styled-jsx/css'
import Title from '../ContentTitle'
import { Accounts } from './Accounts'
import { Skill } from './Skill'
import { HexagonWrap, HexagonGroup, Hexagon } from './Hexagon'

const styles = css`
  .section {
    display: flex;
    flex-direction: column;
    border-radius: 8px;
    min-width: 200px;
    border: 1px solid var(--color-border);
    padding: 1em;
  }

  .profile {
    display: grid;
    grid-template-columns: 120px 1fr;
    grid-template-areas:
      'icon name'
      'desc desc';
  }

  .icon {
    grid-area: icon;
    border-radius: 50%;
    background: url('/icon.jpg') no-repeat left top;
    background-size: 100% 100%;
    height: 80px;
    min-width: 80px;
    justify-self: center;
  }

  .name {
    grid-area: name;
    padding-left: 1em;
  }

  .name h2 {
    margin: 1em 0 0 0;
  }

  .name h3 {
    margin: 0;
  }

  .desc {
    grid-area: desc;
    padding: 2em 1em 0;
  }

  .line {
    margin: 0;
    line-height: 1.9;
    font-size: 12pt;
  }

  .skill {
    margin-top: 1em;
  }

  .skill h3 {
    margin: 0 0 1em 0;
  }
  .skill h4 {
    margin: 0 0 0.5em 0;
  }

  .skill span {
    font-size: 0.875rem;
  }

  .skill li {
    margin: 0.5em 0 0 0;
  }

  .skill .others {
    border-radius: 8px;
    border: 1px solid var(--color-border);
    margin-top: 1em;
    padding: 1em;
  }
  .skill .title {
    font-size: 0.875rem;
  }
`

export const About: React.FC = () => {
  return (
    <>
      <style jsx>{styles}</style>
      <Title>About</Title>
      <section className="section">
        <div className="profile">
          <figure className="icon" />
          <div className="name">
            <h2>Kohta Ito@koh110</h2>
            <h3>Web Engineer</h3>
          </div>
          <div className="desc">
            <p className="line">
              フロントエンド/サーバサイド/インフラ整備までWebならなんでも。
            </p>
            <p className="line">
              技術を使って驚かせたり楽しませたりが好きです。
            </p>
          </div>
        </div>
        <Accounts />
      </section>
      <section className="skill section">
        <h3>Skills</h3>
        <h4>I love Node.js and JavaScript!!</h4>
        <span>フロントエンドからバックエンドまで一気通貫で行うシステム構築をNode.jsで行うのが得意です。</span>
        <span>一人でざっくりとシステムの設計/開発/運用/パフォーマンス調査・チューニングまで対応できます。</span>
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
        <section className="others">
          <div className="title">Others</div>
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
              <Hexagon>MongoDB</Hexagon>
              <Hexagon>Redis</Hexagon>
            </HexagonGroup>
            <HexagonGroup>
              <Hexagon>MySQL</Hexagon>
              <Hexagon>PostgreSQL</Hexagon>
            </HexagonGroup>
            <HexagonGroup>
              <Hexagon>Docker</Hexagon>
              <Hexagon>Docker-compose</Hexagon>
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
    </>
  )
}
