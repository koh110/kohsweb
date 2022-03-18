import React, { useEffect, useState, useContext } from 'react'
import { HeaderContext } from '../context/header'

const Header = () => {
  const [title, , end] = useContext(HeaderContext)
  const [fixed, setFixed] = useState(false)

  useEffect(() => {
    const fixed = (e) => {
      setFixed((e.target as Element).scrollTop > 250)
    }

    window.addEventListener('scroll', fixed, true)
    return () => {
      window.removeEventListener('scroll', fixed)
    }
  }, [])

  const titleStyle = !fixed ? { opacity: 1 } : null
  const fixedStyle = fixed ? { opacity: 1 } : null

  return (
    <div className="header">
      <style jsx>{`
        .header {
          width: 100%;
          height: 270px;
          margin: 0 auto;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
        }

        .title {
          position: relative;
          letter-spacing: 0.1em;
        }

        .title:after {
          position: absolute;
          margin: 0 0 0 0.2em;
          content: '';
          background: #545454;
          width: 23px;
          height: 1.2em;
        }

        .end:after {
          opacity: 0;
          animation: ${'blink'} 1s 5;
        }

        .fixedHeader {
          background-color: var(--color-background-body);
          opacity: 0;
          height: 2em;
          display: flex;
          justify-content: center;
          align-items: center;
          position: fixed;
          top: 0;
          width: 100%;
          transition: opacity 0.3s ease;
          z-index: 100;
        }
      `}</style>
      <header style={titleStyle}>
        <h1 className={end ? 'title end' : 'title'}>{title}</h1>
      </header>
      <div className="fixedHeader" style={fixedStyle}>
        <h3>{title}</h3>
      </div>
    </div>
  )
}

export default Header
