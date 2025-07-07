'use client'

import { useState, type FormEventHandler } from 'react'
import styles from './index.module.css'
import Icon from '../Icon'

import {
  getConsentValue,
  saveGrantedConsentValue,
  CookieConsentValue
} from '../../lib/cookieConsent'

export default function CookieConsent() {
  const [consent, setConsent] = useState(getConsentValue())
  const [tmpHiddenFlag, setTmpHiddenFlag] = useState<boolean>(false)

  const onClose = () => {
    setTmpHiddenFlag(true)
  }

  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    const granted = saveGrantedConsentValue()
    setConsent(granted)
    try {
      ;(window as any).consentGranted()
    } catch (e) {
      console.error(e)
    }
  }

  const showFlag = (() => {
    if (tmpHiddenFlag === true) {
      return false
    }
    return consent !== CookieConsentValue.consent.granted
  })()

  return (
    <div className={styles.wrap} data-show-flag={showFlag}>
      <div className={styles.close}>
        <button
          className={styles['icon-button']}
          aria-label="close button"
          onClick={onClose}
        >
          <Icon
            iconName="ri-close-line"
            style={{ color: 'var(--color-body)' }}
          />
        </button>
      </div>
      <section className={styles.section}>
        <p>当サイトでは分析のためにCookieを使用しています。</p>
        <p>サイト維持のため、Cookie使用の同意にご協力をお願い致します。</p>
      </section>
      <form onSubmit={onSubmit}>
        <div className={styles['button-field']}>
          <button className={styles.button} type="submit">
            同意して閉じる
          </button>
        </div>
      </form>
    </div>
  )
}
