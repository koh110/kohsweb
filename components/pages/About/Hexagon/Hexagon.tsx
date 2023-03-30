'use client'
import { useEffect, useState, type PropsWithChildren } from 'react'
import { useAnimation } from '../../../../lib/useAnimation'
import styles from './Hexagon.module.css'

export default function Hexagon(props: PropsWithChildren) {
  const { intersectionRef, addClassnameFlag } = useAnimation()
  const [wrapClassname, setWrapClassname] = useState<string>('hexagon blur-before')

  useEffect(() => {
    if (addClassnameFlag) {
      setTimeout(() => {
        setWrapClassname(`${styles.hexagon} ${styles.blur_zoom}`)
      }, window.crypto.getRandomValues(new Uint8Array(1))[0])
    } else {
      setWrapClassname(`${styles.hexagon} ${styles.blur_before}`)
    }
  }, [addClassnameFlag])

  return (
    <div className={wrapClassname} ref={intersectionRef}>
      <div className={styles.inner}>{props.children}</div>
    </div>
  )
}
