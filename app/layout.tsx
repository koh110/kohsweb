import './globals.css'
import type { Metadata, Viewport } from 'next'
import type { PropsWithChildren } from 'react'
import GA from '../components/GA'

export default function RootLayout({
  children,
}: PropsWithChildren) {
  return (
    <html lang="ja">
      <head>
        <GA />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NODE_ENV === 'production' ? 'https://koh.dev' : 'http://localhost:3000'),
  title: 'kohsweb',
  openGraph: {
    url: './',
    type: 'website',
    siteName: 'kohsweb'
  },
  twitter: {
    card: 'summary',
    site: '@koh110',
    creator: '@koh110'
  }
}
