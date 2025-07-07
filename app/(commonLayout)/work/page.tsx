import type { Metadata } from 'next'
import WorkComponent from './_components/index'

export default function Work() {
  return (
    <WorkComponent />
  )
}

const title = 'Work'

export const metadata: Metadata = {
  title,
  description: 'koh110\'s work',
  openGraph: {
    title
  }
}
