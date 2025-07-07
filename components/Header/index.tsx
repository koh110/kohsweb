import styles from './styles.module.css'
import HeaderInner from './HeaderInner.client'

export default function Header() {
  return (
    <div className={styles.header}>
      <HeaderInner />
    </div>
  )
}
