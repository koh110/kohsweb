import type { Metadata } from 'next'
import LogComponent from './_components/index'

export default function Log() {
  return (
    <LogComponent />
  )
}

const title = 'Log'

export const metadata: Metadata = {
  title,
  description: 'koh110\'s log',
  openGraph: {
    title
  }
}
