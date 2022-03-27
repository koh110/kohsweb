import React from 'react'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import { Card } from '../Card'

export type Props = {
  type: 'log'
  url: string
  title: string
  date: string
  desc: string
  img: string
  doc?: string
}

const Doc: React.FC<{ doc: string }> = (props) => {
  return (
    <a
      className="doc"
      href={props.doc}
      target="_blank"
      rel="noopener noreferrer"
      style={{ fontSize: '0.875rem' }}
    >
      <AttachFileIcon />
      資料
    </a>
  )
}

export const LogElement: React.FC<Props> = (props) => {
  return (
    <Card>
      <style jsx>{`
        .title {
          padding: 0.5rem 1rem;
          font-weight: 400;
          font-size: 0.875rem;
        }
        .img-wrap {
          width: 100%;
        }
        .img-wrap img {
          width: 100%;
        }
        .content {
          flex: 1;
        }
        .content p {
          padding: 0.5rem 1rem;
          color: var(--color-on-card);
          font-size: 0.875rem;
        }
        .footer {
          padding: 0.5rem 1rem;
        }
      `}</style>
      <div className="title">
        <a href={props.url} target="_blank" rel="noopener noreferrer">
          {props.title}
        </a>
      </div>
      <div className="img-wrap">
        <a href={props.url} target="_blank" rel="noopener noreferrer">
          <img src={props.img} />
        </a>
      </div>
      <div className="content">
        <p>{props.desc}</p>
      </div>
      {props.doc && (
        <div className="footer">
          <Doc doc={props.doc} />
        </div>
      )}
    </Card>
  )
}
