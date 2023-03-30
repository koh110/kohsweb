'use client'
import React, { useContext } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import ToggleOnIcon from '@mui/icons-material/ToggleOn'
import ToggleOffIcon from '@mui/icons-material/ToggleOff'
import { DarkModeContext } from '../../context/darkMode'
import styles from './styles.module.css'

const Menu = () => {
  const [darkMode, setDarkMode] = useContext(DarkModeContext)
  const pathname = usePathname()
  const selected = { opacity: 0.3 }
  const about = pathname === '/' ? selected : {}
  const work = pathname?.includes('/work') ? selected : {}
  const contact = pathname?.includes('/contact') ? selected : {}

  return (
    <div className={styles.wrap}>
      <div className={styles.link_wrap}>
        <Link href="/" as="/" legacyBehavior>
          <a style={about}>About</a>
        </Link>
      </div>
      <div className={styles.link_wrap}>
        <a
          href="https://blog.koh.dev"
          target="_blank"
          rel="noopener noreferrer"
        >
          Blog
        </a>
      </div>
      <div className={styles.link_wrap}>
        <Link href="/work" as="/work" legacyBehavior>
          <a style={work}>Work</a>
        </Link>
      </div>
      <div className={styles.link_wrap}>
        <Link href="/contact" as="/contact" legacyBehavior>
          <a style={contact}>Contact</a>
        </Link>
      </div>
      <div className={styles.dark_mode_toggle} onClick={() => setDarkMode(!darkMode)}>
        {darkMode && <ToggleOnIcon />}
        {!darkMode && <ToggleOffIcon />}
      </div>
    </div>
  );
}
export default Menu
