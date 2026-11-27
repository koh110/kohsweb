import React, { PropsWithChildren } from 'react'

type Props = {
  title: string
}

export default function HistoryDetail({
  title,
  children
}: PropsWithChildren<Props>) {
  return (
    <>
      <p>
        <strong>{title}</strong>
      </p>
      <div style={{ marginTop: '0.5em' }}>{children}</div>
    </>
  )
}
