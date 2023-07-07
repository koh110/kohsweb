'use client'

import { useState, type FormEventHandler } from 'react'
import styles from './index.module.css'

import { getConsentValue, saveGrantedConsentValue, CookieConsentValue } from '../../lib/cookieConsent'

export default function CookieConsent() {
  const [consent, setConsent] = useState(getConsentValue())
  const [tmpHiddenFlag, setTmpHiddenFlag] = useState<boolean>(false)

  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    const granted = saveGrantedConsentValue()
    setConsent(granted)
    try {
      (window as any).consentGranted()
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
      <span>当サイトでは分析のためにCookieを使用しています。</span>
      <span>サイト維持のため、Cookie使用の同意にご協力をお願い致します。</span>
      <form onSubmit={onSubmit}>
        <div className={styles["button-field"]}>
          <button className={styles.button} type="submit">同意して閉じる</button>
        </div>
      </form>
    </div>
  )
}
