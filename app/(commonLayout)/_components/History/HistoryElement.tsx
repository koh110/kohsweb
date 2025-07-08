import React, { PropsWithChildren } from 'react'
import styles from './HistoryElement.module.css'

type Props = {
  date: string
}

export default function HistoryElement(props: PropsWithChildren<Props>) {
  return (
    <div className={styles.wrap}>
      <div className={styles.circle}>
        <div className={styles.border}></div>
      </div>
      <div className={styles.body}>
        <div className={styles.date}>{props.date}</div>
        {props.children}
      </div>
    </div>
  )
}
