import { type PropsWithChildren } from 'react'
import styles from './HexagonWrap.module.css'

export default function HexagonWrap(props: PropsWithChildren) {
  return (
    <div className={styles.hexagon_wrap}>
      {props.children}
    </div>
  )
}
