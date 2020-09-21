import { useState, useEffect } from 'react'
import Link from 'next/link'
import Title from './ContentTitle'

const Work = ({ children }) => {
  const selected = { opacity: 0.3 }
  const [isSoft, setIsSoft] = useState(false)
  const soft = isSoft
    ? { ...selected, paddingLeft: '1em' }
    : { paddingLeft: '1em' }
  const log = !isSoft ? { ...selected } : null

  useEffect(() => {
    setIsSoft(location.pathname.includes('/software'))
  }, [])

  return (
    <>
      <Title>Work</Title>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Link href="/work/log" passHref shallow>
          <a style={log}>Log</a>
        </Link>
        <Link href="/work/software" passHref shallow>
          <a style={soft}>Software</a>
        </Link>
      </div>
      {children}
    </>
  )
}

export default Work
