import Script from 'next/script'

// https://developers.google.com/tag-platform/devguides/consent?hl=ja#implementation_example

import { StorageKey, CookieConsentValue } from '../../lib/cookieConsent'

const { granted } = CookieConsentValue.consent

export default function GA() {
  return (
    <>
      <Script id="google-analytics-init">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
const consent = localStorage.getItem('${StorageKey.consent}') === '${granted}';
gtag('consent', 'default', {
  'ad_storage': consent ? 'granted' : 'denied',
  'analytics_storage': consent ? 'granted' : 'denied'
});
        `}
      </Script>
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-TB4PRTCVBC" />
      <Script id="google-analytics">{`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

gtag('config', 'G-TB4PRTCVBC');

window.consentGranted = function consentGranted() {
  gtag('consent', 'update', {
    'ad_storage': 'granted'
  });
}`}</Script>
    </>
  )
}
