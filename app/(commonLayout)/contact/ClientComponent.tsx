'use client'
import styles from './styles.module.css'
import TwitterIcon from '@mui/icons-material/Twitter'
import Stack from '@mui/material/Stack'
import MailOutlineIcon from '@mui/icons-material/MailOutline'

export default function ClientComponent() {
  return (
    <Stack className={styles.wrap}>
      <p className={styles.head}>依頼・ご相談等は下記メール、またはtwitterでご連絡ください。</p>
      <Stack direction="row" spacing={1}>
        <a className={styles.link} href="mailto:kohta110@gmail.com">
          <MailOutlineIcon fontSize="small" />
          mail
        </a>
        <a
          className={styles.link}
          href="https://twitter.com/koh110"
          target="_blank"
          rel="noopener noreferrer"
        >
          <TwitterIcon fontSize="small" />
          @koh110
        </a>
      </Stack>
    </Stack>
  )
}
