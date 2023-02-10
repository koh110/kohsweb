import React from 'react'

export type Props = {
  type: 'amazon'
  title: string
  date: string
  desc: string
  html: string
  dangerouslySetInnerHTML?: string
}

export const AmazonElement: React.FC<Props> = (props) => {
  return (
    <div className="wrapper">
      <style jsx>{`
        .wrapper {
          padding: 1rem;
          display: flex;
          max-width: 500px;
          background: var(--color-body-card);
          border-radius: 8px;
        }
        .title {
          padding: 0 1rem;
          font-weight: 400;
          font-size: 0.875rem;
        }
        .link {
          max-widht: 120px;
          place-self: center;
        }
        .body {
          display: flex;
          flex-direction: column;
          max-width: calc(500px - 120px - 1rem);
        }
        .content {
          margin-top: 0.5em;
          flex: 1;
        }
        .content p {
          margin: 0;
          padding: 0 1rem;
          color: var(--color-on-card);
          font-size: 0.875rem;
        }
        .content p:nth-last-child(1) {
          margin: 1rem 0 0 0;
        }
        .footer {
          padding: 0.5rem 1rem;
        }
        .footer time {
          color: var(--color-on-card);
          font-size: 0.875rem;
        }
        @media only screen and (max-width: 500px) {
          .wrapper {
            flex-direction: column;
          }
          .body {
            margin: 1rem 0 0 0;
          }
        }
      `}</style>
      <div className="link">
        <div dangerouslySetInnerHTML={{ __html: props.html }}></div>
      </div>
      <div className="body">
        <div className="title">{props.title}</div>
        <div className="content">
          {props.desc.split('\n').map((e, i) => (
            <p key={i}>{e}</p>
          ))}
          <p dangerouslySetInnerHTML={{ __html: props.dangerouslySetInnerHTML }} />
        </div>
      </div>
    </div>
  )
}