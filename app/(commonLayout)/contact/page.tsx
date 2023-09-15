import type { Metadata } from 'next'
import Title from '../../../components/ContentTitle'
import Client from './ClientComponent'
import styles from './styles.module.css'

export default function Contact() {
  return (
    <div className={styles.wrap}>
      <Title>Contact</Title>
      <Client />
    </div>
  )
}

const title = 'Contact'

export const metadata: Metadata = {
  title,
  openGraph: {
    title
  }
}
