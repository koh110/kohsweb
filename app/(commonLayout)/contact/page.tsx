import type { Metadata } from 'next'
import Title from '../../../components/ContentTitle'
import Content from './_components/Content'
import styles from './styles.module.css'

export default function Contact() {
  return (
    <div className={styles.wrap}>
      <Title>Contact</Title>
      <Content />
    </div>
  )
}

const title = 'Contact'

export const metadata: Metadata = {
  title,
  description: 'contact form',
  openGraph: {
    title
  }
}
