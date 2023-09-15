'use client'
import React from 'react'
import { useSelectedLayoutSegment } from 'next/navigation'
import Link from 'next/link'
import ToggleSwitch from './ToggleSwitch'
import styles from './index.module.css'

type MenuItem = {
  label: string
  href: string
}

const menuItems: readonly (MenuItem & { segment?: string | null })[] = [
  {
    label: 'About',
    href: '/',
    segment: null
  },
  {
    label: 'Blog',
    href: 'https://blog.koh.dev'
  },
  {
    label: 'Work',
    href: '/work',
    segment: 'work'
  },
  {
    label: 'Log',
    href: '/log',
    segment: 'log'
  },
  {
    label: 'Contact',
    href: '/contact',
    segment: 'contact'
  }
] as const

export default function Menu() {
  const segment = useSelectedLayoutSegment()
  const index = menuItems.findIndex((e) => e?.segment === segment)
  const transform = index ? `translateX(calc(100% * ${index}))` : undefined

  return (
    <div className={styles.wrap}>
      <div className={styles.inner}>
        <div className={styles.menu}>
          <div className={styles.selector} style={{ transform }}>
            <div className={styles.selector_inner}>
              <span></span>
            </div>
          </div>
          {menuItems.map((item) => {
            return (
              <MenuItem key={item.label} {...item} selected={item.segment === segment} />
            )
          })}
        </div>
      </div>
      <div className={styles.toggele}>
        <ToggleSwitch />
      </div>
    </div>
  )
}

function MenuItem(props: MenuItem & { selected: boolean }) {
  return (
    <div className={styles.menu_item}>
      {props.href.startsWith('http') ? (
        <a href={props.href} target="_blank" rel="noopener noreferrer">
          {props.label}
        </a>
      ) : (
        <Link href={props.href} as={props.href}>
          {props.label}
        </Link>
      )}
    </div>
  )
}
