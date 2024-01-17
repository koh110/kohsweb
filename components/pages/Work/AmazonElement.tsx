import styles from './AmazonElement.module.css'

export type Props = {
  type: 'amazon'
  title: string
  date: string
  desc: string
  img: string
  url: string
  dangerouslySetInnerHTML?: string
}

export default function AmazonElement(props: Props) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.link}>
        <a href={props.url} target="_blank">
          <img src={props.img} />
        </a>
      </div>
      <div className={styles.body}>
        <div className={styles.title}>{props.title}</div>
        <div className={styles.content}>
          {props.desc.split('\n').map((e, i) => (
            <p key={i}>{e}</p>
          ))}
          { props.dangerouslySetInnerHTML && <p dangerouslySetInnerHTML={{ __html: props.dangerouslySetInnerHTML }} /> }
          <p><a href={props.url} target="_blank">Amazon</a></p>
        </div>
      </div>
    </div>
  )
}
