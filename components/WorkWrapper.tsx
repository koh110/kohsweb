import { useState, useEffect } from 'react'
import Link from 'next/link'
import Title from './ContentTitle'

const Work = ({ children }) => {
  const selected = { opacity: 0.3 }
  const [isSoft, setIsSoft] = useState(false)
  const soft = isSoft
    ? { ...selected, paddingRight: '1em' }
    : { paddingRight: '1em' }
  const log = !isSoft ? { ...selected } : null

  useEffect(() => {
    setIsSoft(location.pathname.includes('/software'))
  }, [])

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
        <Link href="/work/work" passHref shallow>
          <a style={soft}>work</a>
        </Link>
        <Link href="/work/log" passHref shallow>
          <a style={log}>Log</a>
        </Link>
      </div>
      {children}
    </>
  )
}

export default Work
