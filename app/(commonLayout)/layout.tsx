import 'sanitize.css'
import { type PropsWithChildren, type ReactNode } from 'react'
import styles from './styles.module.css'
import Providers from '../../context/Providers'
import Header from '../../components/Header'
import Menu from '../../components/Menu'
import CookieConsent from '../../components/CookieConsent'

export default function CommonLayout(props: PropsWithChildren<{ menu: ReactNode }>) {
  return (
    <Providers>
      <div className={styles.layout}>
        <Header />
        <Menu />
        <div className={styles.contents}>
          <div className={styles.contents_wrapper}>
            {props.children}
          </div>
        </div>
      </div>
      <CookieConsent />
    </Providers>
  )
}
