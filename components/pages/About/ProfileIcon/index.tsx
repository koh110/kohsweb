'use client'
import { useEffect, useState } from 'react'
import styles from './index.module.css'
import Icon from '../../../Icon'

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
        aria-label="blog"
        href="https://blog.koh.dev/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Icon iconName="ri-rss-line" size="medium" />
      </a>
      <a
        className={`${styles.account_icon} ${animationClass}`}
        aria-label="X"
        href="https://twitter.com/koh110"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Icon iconName="ri-twitter-x-line" size="medium" />
      </a>
      <a
        className={`${styles.account_icon} ${animationClass}`}
        aria-label="github"
        href="https://github.com/koh110"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Icon iconName="ri-github-fill" size="medium" />
      </a>
      <a
        className={`${styles.account_icon} ${animationClass}`}
        aria-label="facebook"
        href="https://www.facebook.com/kohta110"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Icon iconName="ri-facebook-circle-fill" size="medium" />
      </a>
      <a
        className={`${styles.account_icon} ${animationClass}`}
        aria-label="linkedin"
        href="https://jp.linkedin.com/in/ito-kohta-24078410b"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Icon iconName="ri-linkedin-box-fill" size="medium" />
      </a>
    </div>
  )
}
