import React, { PropsWithChildren } from 'react'

export const Card: React.FC<PropsWithChildren> = (props) => {
  return (
    <div className="card">
      <style jsx>{`
        .card {
          display: flex;
          flex-direction: column;
          background: var(--color-body-card);
          border-radius: 8px;
          max-width: 345px;
          min-width: 200px;
          transition: box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
          font-size: 0.875rem;
        }
      `}</style>
      {props.children}
    </div>
  )
}
