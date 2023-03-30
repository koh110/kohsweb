'use client'
import LogElement, { type Props as Log } from './LogElement'
import { useFadeup } from '../../lib/useFadeup'
import styles from './TimeLine.module.css'

export type Props = {
  index: number
  log: Log
}

export default function TimeLine(props: Props) {
  const { intersectionRef, classnames } = useFadeup()

  const isEven = props.index % 2 === 0
  const wrapClassName = isEven ? styles.wrapper : `${styles.wrapper} ${styles.reverse}`
  const contentClassName = [styles.content, ...classnames].join(' ')

  return (
    <div className={wrapClassName}>
      <div className={styles.circle}>
        <div className={styles.border}></div>
      </div>
      <div className={contentClassName} ref={intersectionRef}>
        <div className={styles.card}>
          <time>{props.log.date}</time>
          <LogElement {...props.log} />
        </div>
        <div className={styles.line} />
      </div>
      <div className={styles.date}>
        <time>{props.log.date}</time>
      </div>
    </div>
  )
}
