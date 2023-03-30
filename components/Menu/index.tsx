'use client'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import ToggleSwitch from './ToggleSwitch'
import styles from './index.module.css'

export default function Menu () {
  const pathname = usePathname()
  const selected = { opacity: 0.3 } as const
  const about = pathname === '/' ? selected : {}
  const work = pathname?.includes('/work') ? selected : {}
  const contact = pathname?.includes('/contact') ? selected : {}

  return (
    <div className={styles.wrap}>
      <div className={styles.link_wrap}>
        <Link href="/" as="/" style={about}>
          About
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
      <div className={styles.link_wrap} style={work}>
        <Link href="/work" as="/work">
          Work
        </Link>
      </div>
      <div className={styles.link_wrap} style={contact}>
        <Link href="/contact" as="/contact">
          Contact
        </Link>
      </div>
      <ToggleSwitch />
    </div>
  );
}
