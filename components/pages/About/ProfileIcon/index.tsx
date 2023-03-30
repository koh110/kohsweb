'use client'
import { useEffect, useState } from 'react'
import RssFeedIcon from '@mui/icons-material/RssFeed'
import TwitterIcon from '@mui/icons-material/Twitter'
import GitHubIcon from '@mui/icons-material/GitHub'
import FacebookIcon from '@mui/icons-material/Facebook'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import styles from './index.module.css'

export default function ProfileIcon() {
  const [animationClass, setAnimationClass] = useState<string>('')

  useEffect(() => {
    setTimeout(() => {
      setAnimationClass(`${styles.move}`)
    }, 10)
  }, [])

  return (
    <div className={styles.icon_menu}>
      <div className={styles.icon}>
        <img src="/icon.jpg" alt="account image" width={80} height={80} />
      </div>
      <a
        className={`${styles.account_icon} ${animationClass}`}
        href="https://blog.koh.dev/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <RssFeedIcon fontSize="medium" />
      </a>
      <a
        className={`${styles.account_icon} ${animationClass}`}
        href="https://twitter.com/koh110"
        target="_blank"
        rel="noopener noreferrer"
      >
        <TwitterIcon fontSize="medium" />
      </a>
      <a
        className={`${styles.account_icon} ${animationClass}`}
        href="https://github.com/koh110"
        target="_blank"
        rel="noopener noreferrer"
      >
        <GitHubIcon fontSize="medium" />
      </a>
      <a
        className={`${styles.account_icon} ${animationClass}`}
        href="https://www.facebook.com/kohta110"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FacebookIcon fontSize="medium" />
      </a>
      <a
        className={`${styles.account_icon} ${animationClass}`}
        href="https://jp.linkedin.com/in/ito-kohta-24078410b"
        target="_blank"
        rel="noopener noreferrer"
      >
        <LinkedInIcon fontSize="medium" />
      </a>
    </div>
  )
}
