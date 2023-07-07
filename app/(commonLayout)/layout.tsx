import 'sanitize.css'
import styles from './styles.module.css'
import Providers from '../../context/Providers'
import Header from '../../components/Header'
import Menu from '../../components/Menu/index'
import CookieConsent from '../../components/CookieConsent'

export default function CommonLayout({ children }) {
  return (
    <Providers>
      <div className={styles.layout}>
        <Header />
        <Menu />
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
