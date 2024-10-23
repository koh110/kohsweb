import type { PropsWithChildren } from 'react'
import styles from './AmazonElement.module.css'

export type Props = {
  title: string
  date: string
  desc: string
  img: string
  url: string
}

export default function AmazonElement(props: PropsWithChildren<Props>) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.link}>
        <a href={props.url} target="_blank" aria-label={props.title}>
          <img src={props.img} alt={props.title} />
        </a>
      </div>
      <div className={styles.body}>
        <h2 className={styles.title}>{props.title}</h2>
        <div className={styles.content}>
          {props.desc.split('\n').map((e, i) => (
            <p key={i}>{e}</p>
          ))}
          <div style={{ padding: '0.5em 1em 0' }}>
            {props.children}
          </div>
          <p><a href={props.url} target="_blank">Amazon</a></p>
        </div>
      </div>
    </div>
  )
}
