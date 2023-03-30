import styles from './index.module.css'

export default function Accounts() {
  return (
    <div className={styles.wrap}>
      <a
        className={styles.link}
        href="https://speakerdeck.com/koh110"
        target="_blank"
        rel="noopener noreferrer"
      >
        Speaker Deck
      </a>
      <a
        className={styles.link}
        href="https://www.slideshare.net/kohta110"
        target="_blank"
        rel="noopener noreferrer"
      >
        SlideShare
      </a>
      <a
        className={styles.link}
        href="https://b.hatena.ne.jp/koh110/"
        target="_blank"
        rel="noopener noreferrer"
      >
        hatena
      </a>
      <a
        className={styles.link}
        href="http://koh110.hatenablog.com/"
        target="_blank"
        rel="noopener noreferrer"
      >
        hatena blog
      </a>
      <a
        className={styles.link}
        href="https://qiita.com/koh110"
        target="_blank"
        rel="noopener noreferrer"
      >
        qiita
      </a>
    </div>
  )
}
