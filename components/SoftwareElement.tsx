type Props = {
  url: string
  title: string
  desc: string
  img?: string
}

const Software = ({ url, title, desc, img }: Props) => {
  return (
    <div className="wrap">
      <style jsx>{`
        .wrap {
          padding: 1em 0 2em 0;
          display: grid;
          grid-template-columns: 100px 1fr;
          grid-template-areas:
            'img title'
            'img desc';
        }
        h3 {
          margin-bottom: 0;
        }
        .img {
          grid-area: img;
          place-self: center;
        }
        .img img {
          max-width: 50px;
        }
        .title {
          grid-area: title;
        }
        .desc {
          grid-area: desc;
        }
      `}</style>
      <div className="img">
        {img && (
          <a href={url} target="_blank" rel="noopener noreferrer">
            <img src={img} />
          </a>
        )}
      </div>
      <a className="title" href={url} target="_blank" rel="noopener noreferrer">
        <h3>{title}</h3>
      </a>
      <p className="desc">{desc}</p>
    </div>
  )
}

export default Software
