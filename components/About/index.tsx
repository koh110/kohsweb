import React from 'react'
import Image from 'next/image'
import css from 'styled-jsx/css'
import Title from '../ContentTitle'
import { Accounts } from './Accounts'
import { Skill } from './Skill'
import { HexagonWrap, HexagonGroup, Hexagon } from './Hexagon'
import { ProfileIcon } from './ProfileIcon'

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
    display: flex;
  }

  .icon {
    grid-area: icon;
    border-radius: 50%;
    width: 80px;
    height: 80px;
    overflow: hidden;
    justify-self: center;
  }

  .name {
    padding-left: 2em;
  }

  .name h2 {
    margin: 1em 0 0 0;
  }

  .name h3 {
    margin: 0;
  }

  .desc {
    padding: 1em 0 0;
  }

  .line {
    margin: 0;
    line-height: 1.9;
    font-size: 0.875rem;
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
          <ProfileIcon />
          <div className="name">
            <h2>Kohta Ito@koh110</h2>
            <h3>Web Engineer</h3>
            <div className="desc">
              <p className="line">
                フロントエンド/サーバサイド/インフラ整備までWebならなんでも。
              </p>
              <p className="line">
                技術を使って驚かせたり楽しませたりが好きです。
              </p>
            </div>
          </div>
        </div>
        <Accounts />
      </section>
      <section className="skill section">
        <h3>Skills</h3>
        <h4>I love Node.js and JavaScript!!</h4>
        <span>
          フロントエンドからバックエンドまで一気通貫で行うシステム構築をNode.jsで行うのが得意です。
        </span>
        <span>
          一人でざっくりとシステムの設計/開発/運用/パフォーマンス調査・チューニングまで対応できます。
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
        <section className="others">
          <div className="title">Others</div>
          <HexagonWrap>
            <HexagonGroup>
              <Hexagon even={false}>Lighthouse</Hexagon>
              <Hexagon even={true}>Prisma.js</Hexagon>
            </HexagonGroup>
            <HexagonGroup>
              <Hexagon even={false}>webpack</Hexagon>
              <Hexagon even={true}>vite</Hexagon>
            </HexagonGroup>
            <HexagonGroup>
              <Hexagon even={false}>Redux</Hexagon>
              <Hexagon even={true}>Recoil</Hexagon>
            </HexagonGroup>
            <HexagonGroup>
              <Hexagon even={false}>MongoDB</Hexagon>
              <Hexagon even={true}>Redis</Hexagon>
            </HexagonGroup>
            <HexagonGroup>
              <Hexagon even={false}>MySQL</Hexagon>
              <Hexagon even={true}>PostgreSQL</Hexagon>
            </HexagonGroup>
            <HexagonGroup>
              <Hexagon even={false}>Docker</Hexagon>
              <Hexagon even={true}>Docker-compose</Hexagon>
            </HexagonGroup>
            <HexagonGroup>
              <Hexagon even={false}>Chef</Hexagon>
              <Hexagon even={true}>Fabric</Hexagon>
            </HexagonGroup>
            <HexagonGroup>
              <Hexagon even={false}>CircleCI</Hexagon>
              <Hexagon even={true}>GitHub Actions</Hexagon>
            </HexagonGroup>
            <HexagonGroup>
              <Hexagon even={false}>Screwdriver.cd</Hexagon>
              <Hexagon even={true}>Jenkins</Hexagon>
            </HexagonGroup>
            <HexagonGroup>
              <Hexagon even={false}>Ubuntu</Hexagon>
              <Hexagon even={true}>CentOS</Hexagon>
            </HexagonGroup>
            <HexagonGroup>
              <Hexagon even={false}>nginx</Hexagon>
              <Hexagon even={true}>Apache HTTP Server</Hexagon>
            </HexagonGroup>
            <HexagonGroup>
              <Hexagon even={false}>ElasticSearch</Hexagon>
              <Hexagon even={true}>Dev-Ops</Hexagon>
            </HexagonGroup>
          </HexagonWrap>
        </section>
      </section>
    </>
  )
}
