import styles from './styles.module.css'
import ClientComponent from './ClientComponent'

export default function Header() {
  return (
    <div className={styles.header}>
      <ClientComponent />
    </div>
  )
}
