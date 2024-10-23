import { Metadata } from 'next'
import About from '../../components/pages/About'

export default function Index() {
  return (
    <About />
  )
}

const title = 'About'
export const metadata: Metadata = {
  title,
  description: 'About koh110',
  openGraph: {
    title
  }
}
