import styles from './AmazonElement.module.css'

export type Props = {
  type: 'amazon'
  title: string
  date: string
  desc: string
  html: string
  dangerouslySetInnerHTML?: string
}

export default function AmazonElement(props: Props) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.link}>
        <div dangerouslySetInnerHTML={{ __html: props.html }}></div>
      </div>
      <div className={styles.body}>
        <div className={styles.title}>{props.title}</div>
        <div className={styles.content}>
          {props.desc.split('\n').map((e, i) => (
            <p key={i}>{e}</p>
          ))}
          { props.dangerouslySetInnerHTML && <p dangerouslySetInnerHTML={{ __html: props.dangerouslySetInnerHTML }} /> }
        </div>
      </div>
    </div>
  )
}
