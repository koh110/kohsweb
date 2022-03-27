import React, { useMemo } from 'react'
import css from 'styled-jsx/css'

type Props = {
  title: string
  skills: {
    name: string
    num: number
  }[]
}

const styles = css`
  .wrap {
    padding: 1em;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    margin: 1em 0 0 0;
    background: var(--color-body-card);
  }
  .skills {
    display: flex;
    flex-wrap: wrap;
  }
  .bar-wrap {
    width: 100%;
    height: 2px;
    margin: 1em 0 1em 0;
    padding: 0;
  }
  .bar {
    display: inline-block;
    height: 100%;
    vertical-align: top;
  }
  .title {
    font-size: 0.875rem;
  }
  .skill {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 1em;
  }
  .skill span {
    font-size: 0.875rem;
  }
  .skill:before {
    margin-right: 4px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    content: '';
  }

  .bar:nth-child(1),
  .skill:nth-child(1):before {
    background-color: var(--color-skill-1);
  }
  .bar:nth-child(2),
  .skill:nth-child(2):before {
    background-color: var(--color-skill-2);
  }
  .bar:nth-child(3),
  .skill:nth-child(3):before {
    background-color: var(--color-skill-3);
  }
  .bar:nth-child(4),
  .skill:nth-child(4):before {
    background-color: var(--color-skill-4);
  }
  .bar:nth-child(5),
  .skill:nth-child(5):before {
    background-color: var(--color-skill-5);
  }
`

export const Skill: React.FC<Props> = (props) => {
  const denominator = useMemo(() => {
    return props.skills.reduce((prev, next) => {
      return prev + next.num
    }, 0)
  }, [])

  return (
    <div className="wrap">
      <style jsx>{styles}</style>
      <div className="title">{props.title}</div>
      <ul className="bar-wrap">
        {props.skills.map((e, i) => {
          return (
            <li key={e.name} className="bar" style={{ width: `${e.num / denominator * 100}%` }}></li>
          )
        })}
      </ul>
      <div className="skills">
        {props.skills.map((e, i) => {
          return (
            <div key={e.name} className="skill"><span>{e.name}</span></div>
          )
        })}
      </div>
    </div>
  )
}