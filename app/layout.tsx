import './globals.css'
import GA from '../components/GA'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

export const metadata = {
  title: 'kohsweb'
}
