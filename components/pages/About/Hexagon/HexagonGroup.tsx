import { type PropsWithChildren } from 'react'
import styles from './HexagonGroup.module.css'

export default function HexagonGroup(props: PropsWithChildren) {
  return (
    <div className={styles.hexagon_group_wrap}>
      {props.children}
    </div>
  )
}
