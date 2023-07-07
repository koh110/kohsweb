type CookieConsentType = {
  consent: 'granted' | 'denied'
}

export const CookieConsentValue = {
  consent: {
    granted: 'granted',
    denied: 'denied'
  }
} as const satisfies {
  consent: { [P in CookieConsentType['consent']]: P }
}

export const StorageKey = {
  consent: 'kohswev:cookie:consent'
} as const

export const isCookieConsentGranted = () => {
  return localStorage.getItem(StorageKey.consent) === CookieConsentValue['consent']['granted']
}

export const getConsentValue = (): CookieConsentType['consent'] => {
  const consent = localStorage.getItem(StorageKey.consent)
  if (consent === CookieConsentValue.consent.granted) {
    return CookieConsentValue.consent.granted
  }
  return CookieConsentValue.consent.denied
}

export const saveGrantedConsentValue = () => {
  const { granted } = CookieConsentValue.consent
  localStorage.setItem(StorageKey.consent, granted)
  return granted
}
