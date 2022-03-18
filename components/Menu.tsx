import React, { useContext } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import ToggleOnIcon from '@mui/icons-material/ToggleOn'
import ToggleOffIcon from '@mui/icons-material/ToggleOff'
import { DarkModeContext } from '../context/darkMode'

const Menu = () => {
  const [darkMode, setDarkMode] = useContext(DarkModeContext)
  const router = useRouter()
  const selected = { opacity: 0.3 }
  const about = router.pathname === '/' ? selected : {}
  const work = router.pathname.includes('/work') ? selected : {}
  const contact = router.pathname.includes('/contact') ? selected : {}

  return (
    <div className="wrap">
      <style jsx>{`
        .wrap {
          display: flex;
          justify-content: flex-end;
          font-size: 1rem;
          width: 100%;
        }
        .link-wrap {
          padding-left: 1em;
        }
        .dark-mode-toggle {
          padding-left: 1em;
        }
      `}</style>
      <div className="link-wrap">
        <Link href="/" as="/">
          <a style={about}>About</a>
        </Link>
      </div>
      <div className="link-wrap">
        <a
          href="https://blog.koh.dev"
          target="_blank"
          rel="noopener noreferrer"
        >
          Blog
        </a>
      </div>
      <div className="link-wrap">
        <Link href="/work" as="/work">
          <a style={work}>Work</a>
        </Link>
      </div>
      <div className="link-wrap">
        <Link href="/contact" as="/contact">
          <a style={contact}>Contact</a>
        </Link>
      </div>
      <div className="dark-mode-toggle" onClick={() => setDarkMode(!darkMode)}>
        {darkMode && <ToggleOnIcon />}
        {!darkMode && <ToggleOffIcon />}
      </div>
    </div>
  )
}
export default Menu
