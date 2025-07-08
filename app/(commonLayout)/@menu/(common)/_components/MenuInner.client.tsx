'use client'
import Link from 'next/link'
import { useMenuSegment } from '../_context'
import styles from './MenuInner.module.css'
import { type Segment } from '../_constants'

export type MenuItem = {
  label: string
  href: string
}


const menuItems = [
  {
    label: 'About',
    href: '/',
    segment: 'about'
  },
  {
    label: 'Blog',
    href: 'https://blog.koh.dev',
    segment: null
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
] as const satisfies (MenuItem & { segment: Segment | null })[]


export function MenuInner() {
  // for css animation
  const { segment } = useMenuSegment()
  const _index = menuItems.findIndex((e) => e.segment === segment)
  const index = _index >= 0 ? _index : 2
  const transform = index ? `translateX(calc(100% * ${index}))` : undefined

  return (
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
