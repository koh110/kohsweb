import { PropsWithChildren } from 'react'
import ToggleSwitch from './ToggleSwitch'
import styles from './Menu.module.css'

export default function Menu({ children }: PropsWithChildren) {
  return (
    <div className={styles.wrap}>
      <div className={styles.inner}>
        {children}
      </div>
      <div className={styles.toggele}>
        <ToggleSwitch />
      </div>
    </div>
  )
}
