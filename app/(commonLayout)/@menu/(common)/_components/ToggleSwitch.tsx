'use client'
import { useContext } from 'react'
import { DarkModeContext } from '../../../../../context/darkMode'
import styles from './ToggleSwitch.module.css'

export default function ToggleSwitch() {
  const [darkMode, setDarkMode] = useContext(DarkModeContext)

  return (
    <div className={styles.toggle_switch}>
      <input
        type="checkbox"
        id="darkmode-toggle"
        onChange={() => setDarkMode(!darkMode)}
      />
      <label htmlFor="darkmode-toggle">
        <span className={styles.slider} />
      </label>
    </div>
  )
}
