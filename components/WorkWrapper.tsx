import { useState, useEffect } from 'react'
import Link from 'next/link'
import Title from './ContentTitle'

const Work = ({ children }) => {
  const selected = { opacity: 0.3 }
  const [isLog, setIsLog] = useState(false)
  const log = isLog
    ? { ...selected, paddingLeft: '1em' }
    : { paddingLeft: '1em' }
  const work = !isLog ? { ...selected } : null

  useEffect(() => {
    setIsLog(location.pathname.includes('/work/log'))
  }, [])

  return <>
    <Title>Work</Title>
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        padding: '0 1em'
      }}
    >
      <Link href="/work" passHref shallow style={work}>
        work
      </Link>
      <Link href="/work/log" passHref shallow style={log}>
        Log
      </Link>
    </div>
    {children}
  </>;
}

export default Work
