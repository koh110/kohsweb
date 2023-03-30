'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import Title from '../../../components/ContentTitle'

export default function WorkWrapper({ children }) {
  const pathname = usePathname()
  const selected = { opacity: 0.3 }
  const isLog = pathname.includes('/work/log')
  const log = isLog
    ? { ...selected, paddingLeft: '1em' }
    : { paddingLeft: '1em' }
  const work = !isLog ? { ...selected } : undefined

  return (
    <>
      <Title>Work</Title>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          padding: '0 1em'
        }}
      >
        <Link href="/work" passHref shallow style={work}>
          Work
        </Link>
        <Link href="/work/log" passHref shallow style={log}>
          Log
        </Link>
      </div>
      {children}
    </>
  );
}
