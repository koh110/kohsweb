import React from 'react'

export const Accounts = () => {
  return (
    <div className="wrap">
      <style jsx>{`
        .wrap {
          padding: 2em 1em 0;
          margin-top: 1em;
          padding: 0 1em 0 0;
          display: flex;
          flex-wrap: wrap;
        }
        .link {
          border-radius: 4px;
          font-size: 0.875rem;
          margin: 0 0 1em 1em;
          border: 1px solid var(--color-link);
          padding: 0.5em 1em;
        }
        .link:hover {
          background-color: rgba(144, 202, 249, 0.08);
          border: 1px solid #90caf9;
        }
      `}</style>
      <a
        className="link"
        href="https://speakerdeck.com/koh110"
        target="_blank"
        rel="noopener noreferrer"
      >
        Speaker Deck
      </a>
      <a
        className="link"
        href="https://www.slideshare.net/kohta110"
        target="_blank"
        rel="noopener noreferrer"
      >
        SlideShare
      </a>
      <a
        className="link"
        href="https://b.hatena.ne.jp/koh110/"
        target="_blank"
        rel="noopener noreferrer"
      >
        hatena
      </a>
      <a
        className="link"
        href="http://koh110.hatenablog.com/"
        target="_blank"
        rel="noopener noreferrer"
      >
        hatena blog
      </a>
      <a
        className="link"
        href="https://qiita.com/koh110"
        target="_blank"
        rel="noopener noreferrer"
      >
        qiita
      </a>
    </div>
  )
}
