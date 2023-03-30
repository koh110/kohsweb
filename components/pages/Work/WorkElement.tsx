import styles from './WorkElement.module.css'

export type Props = {
  url: string
  title: string
  desc: string
  img?: string
}

export default function WorkElement(props: Props) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>
        <a href={props.url} target="_blank" rel="noopener noreferrer">
          {props.title}
        </a>
      </div>
      {props.img && (
        <div className={styles.img_wrap}>
          <a href={props.url} target="_blank" rel="noopener noreferrer">
            <img src={props.img} />
          </a>
        </div>
      )}
      <div className={styles.content}>
        <p>{props.desc}</p>
      </div>
    </div>
  )
}
