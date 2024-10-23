import Card from '../../Card/index'
import Icon from '../../Icon/index'
import styles from './LogElement.module.css'

export type Props = {
  type: 'log'
  url: string
  title: string
  date: string
  desc: string | React.ReactNode
  img: string
  doc?: string
}

export default function LogElement(props: Props) {
  return (
    <Card>
      <div className={styles.inner}>
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
          <Desc desc={props.desc} />
        </div>
        {props.doc && (
          <div className={styles.footer}>
            <Doc doc={props.doc} />
          </div>
        )}
      </div>
    </Card>
  )
}

function Doc(props: { doc: string }) {
  return (
    <a
      className="doc"
      href={props.doc}
      target="_blank"
      rel="noopener noreferrer"
    >
      <Icon iconName="ri-attachment-2" />
      <span>資料</span>
    </a>
  )
}

function Desc(props: { desc: Props['desc'] }) {
  if (typeof props.desc === 'string') {
    return <p>{props.desc}</p>
  }
  return <>{props.desc}</>
}
