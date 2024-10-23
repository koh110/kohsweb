'use client'
import styles from './styles.module.css'
import Icon from '../../../components/Icon'

export default function ClientComponent() {
  return (
    <div className={styles.content}>
      <p className={styles.head}>依頼・ご相談等は下記メール、またはtwitterでご連絡ください。</p>
      <div className={styles.account}>
        <a className={styles.link} href="mailto:kohta110@gmail.com">
          <Icon iconName="ri-mail-line" />
          mail
        </a>
        <a
          className={styles.link}
          href="https://twitter.com/koh110"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Icon iconName="ri-twitter-x-line" />
          @koh110
        </a>
      </div>
    </div>
  )
}
