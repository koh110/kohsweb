'use client'

export default function GA() {
  return (
    <>
      <script async src="https://www.googletagmanager.com/gtag/js?id=G-TB4PRTCVBC"></script>
      <script
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
        
      gtag('config', 'G-TB4PRTCVBC');`
        }}
      ></script>
    </>
  )
}