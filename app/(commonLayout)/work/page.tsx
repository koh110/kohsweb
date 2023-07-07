import type { Metadata } from 'next'
import WorkComponent from '../../../components/pages/Work'

export default function Work() {
  return (
    <WorkComponent />
  )
}

const title = 'Work'

export const metadata: Metadata = {
  title,
  openGraph: {
    title
  }
}
