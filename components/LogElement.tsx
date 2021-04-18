import { AttachFile } from '@material-ui/icons'

type Props = {
  url: string
  title: string
  date: string
  desc: string
  img: string
  doc?: string
}

const Log = ({ url, title, date, desc, img, doc }: Props) => {
  return (
    <div className="wrapper">
      <style jsx>{`
        .wrapper {
          padding: 1em 0 2em 0;
          display: grid;
          grid-template-columns: 160px 1fr;
          grid-template-areas:
            'title title'
            'img time'
            'img desc'
            'img doc';
        }
        .img {
          grid-area: img;
          place-self: center;
        }
        .img img {
          min-width: 50px;
          max-width: 100px;
        }
        .title {
          grid-area: title;
        }
        .time {
          font-size: 13px;
          grid-area: time;
        }
        .desc {
          grid-area: desc;
        }
        .doc {
          grid-area: doc;
        }
      `}</style>
      <div className="img">
        <a href={url} target="_blank" rel="noopener noreferrer">
          <img src={img} />
        </a>
      </div>
      <a className="title" href={url} target="_blank" rel="noopener noreferrer">
        <h3>{title}</h3>
      </a>
      <time className="time">{date}</time>
      <p className="desc">{desc}</p>
      {(() => {
        if (doc) {
          return (
            <a
              className="doc"
              href={doc}
              target="_blank"
              rel="noopener noreferrer"
              style={{ marginLeft: '1.5em', fontSize: '10pt' }}
            >
              <AttachFile />
              資料
            </a>
          )
        }
      })()}
    </div>
  )
}
export default Log
