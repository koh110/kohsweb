import type { Metadata } from 'next'
import Title from '../../../components/ContentTitle'
import Client from './ClientComponent'

export default function Contact() {
  return (
    <>
      <Title>Contact</Title>
      <Client />
    </>
  )
}

const title = 'Contact'

export const metadata: Metadata = {
  title,
  openGraph: {
    title
  }
}
