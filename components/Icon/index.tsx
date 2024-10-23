import type { CSSProperties } from 'react'
import styles from './index.module.css'

// https://remixicon.com/

type Props = {
  iconName: string
  size?: 'small' | 'medium'
  style?: CSSProperties
}

export default function Icon({ iconName, style, size }: Props) {
  const classNames = [styles.icon, iconName]
  if (size && size !== 'small') {
    classNames.unshift(styles[size])
  }

  return (
    <i
      className={classNames.join(' ')}
      style={style}
    ></i>
  )
}
