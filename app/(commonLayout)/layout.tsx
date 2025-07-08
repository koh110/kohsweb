import 'sanitize.css'
import 'remixicon/fonts/remixicon.css'
import React, { type PropsWithChildren } from 'react'
import styles from './styles.module.css'
import Providers from '../../context/Providers'
import Header from '../../components/Header'
import CookieConsent from '../../components/CookieConsent/index.client'

export default function CommonLayout({ children, menu }: PropsWithChildren & { menu: React.ReactNode }) {
  return (
    <Providers>
      <div className={styles.layout}>
        <Header />
        {menu}
        <div className={styles.contents}>
          <div className={styles.contents_wrapper}>
            {children}
          </div>
        </div>
      </div>
      <CookieConsent />
    </Providers>
  )
}
