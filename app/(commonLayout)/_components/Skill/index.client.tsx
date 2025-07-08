'use client'
import { useAnimation } from '../../../../lib/useAnimation'
import styles from './index.module.css'

type Props = {
  title: string
  skills: {
    name: string
    num: number
  }[]
}

export default function Skill(props: Props) {
  const { intersectionRef, addClassnameFlag } = useAnimation()

  const denominator = props.skills.reduce((prev, next) => {
    return prev + next.num
  }, 0)

  const barWrap = addClassnameFlag ? `${styles.bar_wrap} ${styles.zoom_right}` : styles.bar_wrap

  return (
    <div className={styles.wrap}>
      <div className={styles.title}>{props.title}</div>
      <ul className={barWrap} ref={intersectionRef}>
        {props.skills.map((e, i) => {
          return (
            <li
              key={e.name}
              className={styles.bar}
              style={{ width: `${(e.num / denominator) * 100}%` }}
            ></li>
          )
        })}
      </ul>
      <div className={styles.skills}>
        {props.skills.map((e, i) => {
          return (
            <div key={e.name} className={styles.skill}>
              <span>{e.name}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
