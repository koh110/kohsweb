'use client'
import styles from './styles.module.css'
import { useEffect, useState, useContext } from 'react'
import { HeaderContext } from '../../context/header'

export default function Header() {
  const [title, , end] = useContext(HeaderContext)
  const [fixed, setFixed] = useState(false)

  useEffect(() => {
    const fixed = (e) => {
      setFixed((e.target as Element).scrollTop > 250)
    }

    window.addEventListener('scroll', fixed, true)
    return () => {
      window.removeEventListener('scroll', fixed)
    }
  }, [])

  const titleStyle = !fixed ? { opacity: 1 } : undefined
  const fixedStyle = fixed ? { opacity: 1 } : undefined

  return (
    <>
      <header style={titleStyle}>
        <h1 className={end ? `${styles.title} ${styles.end}` : styles.title}>
          {title}
        </h1>
      </header>
      <div className={styles.fixedHeader} style={fixedStyle}>
        <h1>{title}</h1>
      </div>
    </>
  )
}
