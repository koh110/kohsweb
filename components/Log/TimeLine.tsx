import React, { useMemo, useState, useEffect } from 'react'
import { LogElement, Props as Log } from './LogElement'
import { AmazonElement, Props as AmazonLog } from './AmazonElement'
import { useFadeup } from '../../lib/useFadeup'

export type Props = {
  index: number
  log: Log | AmazonLog
}

export const TimeLine: React.FC<Props> = (props) => {
  const { intersectionRef, classnames } = useFadeup()
  const [contentClassName, setContentClassName] = useState('content')

  const isEven = useMemo(() => props.index % 2 === 0, [props.index])
  const wrapClassName = isEven ? 'wrapper' : 'wrapper reverse'

  useEffect(() => {
    setContentClassName(['content', ...classnames].join(' '))
  }, [classnames])

  return (
    <div className={wrapClassName}>
      <style jsx>{`
        .wrapper {
          margin-bottom: 1em;
          display: grid;
          grid-template-columns: 1fr 2em 1fr;
          grid-template-areas: 'left center right';
        }
        .circle {
          --top-margin: 2em;
          position: relative;
          grid-area: center;
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
          background: transport;
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
        .reverse .content {
          grid-area: right;
          flex-direction: row-reverse;
        }
        .content {
          display: flex;
          grid-area: left;
          justify-content: flex-end;
        }
        .reverse .line {
          transform: translateY(3.5em) skew(1deg, 25deg);
        }
        .line {
          flex: 1;
          min-width: 1em;
          height: 4px;
          background: var(--color-timeline-bar);
          transform: translateY(3.5em) skew(1deg, 335deg);
        }
        .card {
          border: 1px solid var(--color-timeline-bar);
          border-radius: 8px;
          padding: 1em;
        }
        .card time {
          display: none;
          font-size: 0.875rem;
        }
        .reverse .date {
          grid-area: left;
          justify-content: flex-end;
        }
        .date {
          display: flex;
          justify-content: flex-start;
          padding: 2.3em 0.875rem;
        }
        .date time {
          color: var(--color-on-card);
          font-size: 0.875rem;
        }
        @media only screen and (max-width: 700px) {
          .wrapper {
            grid-template-columns: 1fr 2em 3fr;
            grid-template-areas: 'date border content';
          }
          .circle {
            grid-area: border;
          }
          .reverse .date {
            grid-area: date;
          }
          .date {
            justify-content: flex-end;
            grid-area: date;
          }
          .reverse .content {
            grid-area: content;
          }
          .content {
            grid-area: content;
            flex-direction: row-reverse;
          }
          .line {
            flex: none;
            transform: translateY(3em) skew(0, 25deg);
          }
        }
        @media only screen and (max-width: 460px) {
          .wrapper {
            grid-template-columns: 1em 2em 1fr;
            grid-template-areas: 'date border content';
          }
          .content {
            padding: 0 1em 0 0;
          }
          .card {
            padding: 0.5em;
          }
          .date {
            display: none;
          }
          .card time {
            display: block;
            margin-bottom: 0.5em;
          }
        }
      `}</style>
      <div className="circle">
        <div className="border"></div>
      </div>
      <div className={contentClassName} ref={intersectionRef}>
        <div className="card">
          <time>{props.log.date}</time>
          {props.log.type === 'amazon' ? (
            <AmazonElement {...props.log} />
          ) : (
            <LogElement {...props.log} />
          )}
        </div>
        <div className="line" />
      </div>
      <div className="date">
        <time>{props.log.date}</time>
      </div>
    </div>
  )
}
