import React from 'react'
import MzmIcon from '../../public/mzm.svg'

export type Props = {
  url: string
  title: string
  desc: string
  img?: string
}

export const SoftwareElement: React.FC<Props> = (props) => {
  return (
    <div className="wrapper">
      <style jsx>{`
        .wrapper {
          display: flex;
          flex-direction: column;
          background: var(--color-body-card);
          border-radius: 8px;
          max-width: 345px;
          transition: box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
          box-shadow: rgb(0 0 0 / 20%) 0px 2px 1px -1px, rgb(0 0 0 / 14%) 0px 1px 1px 0px, rgb(0 0 0 / 12%) 0px 1px 3px 0px;
        }
        .title {
          padding: 0.5rem 1rem;
          font-weight: 400;
          font-size: 0.875rem;
        }
        .img-wrap {
          display: flex;
          justify-content: center;
          background: rgb(255, 255, 255);
        }
        .img-wrap a, .img-wrap img {
          max-width: 100%;
        }
        .content {
          flex: 1;
        }
        .content p {
          padding: 0.5rem 1rem;
          color: var(--color-on-card);
          font-size: 0.875rem;
        }
      `}</style>
      <div className="title">
        <a href={props.url} target="_blank" rel="noopener noreferrer">
          {props.title}
        </a>
      </div>
      {props.img && (
        <div className="img-wrap">
          <a href={props.url} target="_blank" rel="noopener noreferrer">
            <img src={props.img} />
          </a>
        </div>
      )}
      <div className="content"><p>{props.desc}</p></div>
    </div>
  )
}
