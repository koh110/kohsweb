import React, { PropsWithChildren } from 'react'

type Props = {
  date: string
}

export const HistoryElement: React.FC<PropsWithChildren<Props>> = (props) => {
  return (
    <div className="wrap">
      <style jsx>{`
        .wrap {
          font-size: 0.875rem;
          display: grid;
          grid-template-columns: 2em 1fr;
          grid-template-areas: 'left right';
        }
        .wrap :global(p) {
          margin: 0;
        }
        .circle {
          grid-area: left;
          --top-margin: 2em;
          position: relative;
          display: flex;
          justify-content: center;
        }
        .circle:before {
          position: absolute;
          top: var(--top-margin);
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2em;
          height: 2em;
          border: 0.5em solid var(--color-timeline-bar);
          border-radius: 50%;
          content: '';
        }
        .circle .border:before {
          content: '';
          position: absolute;
          top: 0;
          height: var(--top-margin);
          left: 50%;
          transform: translateX(-50%);
          width: 4px;
          background: var(--color-timeline-bar);
        }
        .circle .border:after {
          content: '';
          position: absolute;
          top: calc(var(--top-margin) + 2em);
          height: calc(100% - var(--top-margin));
          left: 50%;
          transform: translateX(-50%);
          width: 4px;
          background: var(--color-timeline-bar);
        }
        .wrap:last-of-type .border:after {
          height: calc(100% - var(--top-margin) * 2);
        }

        .body {
          grid-area: right;
          padding: 1em;
          display: flex;
          flex-direction: column;
        }
        .body:after {
          content: '';
          width: 100%;
          margin-top: 1em;
          border: 1px solid var(--color-timeline-bar);
        }
        .body :global(ul) {
          margin-bottom: 0;
        }
        .date {
          margin-bottom: 0.5em;
        }
      `}</style>
      <div className="circle">
        <div className="border"></div>
      </div>
      <div className="body">
        <div className="date">{props.date}</div>
        {props.children}
      </div>
    </div>
  )
}
