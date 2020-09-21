import { MailOutline, ChatBubbleOutline } from '@material-ui/icons'
import { PageComponent } from '../types/Component'
import Layout from '../components/Layout'
import Title from '../components/ContentTitle'

const fontSize = 18

const Contact: PageComponent = () => {
  return (
    <>
      <Title>Contact</Title>
      <p style={{ marginTop: '1em' }}>
        依頼・ご相談等は下記メール、もしくはtwitter等でご連絡ください。
      </p>
      <div style={{ marginTop: '2em' }}>
        <a href="mailto:kohta110@gmail.com">
          <MailOutline style={{ fontSize: `${fontSize * 1.2}pt` }} />
          <span
            style={{
              paddingLeft: '5px',
              fontSize: `${fontSize}pt`,
              verticalAlign: 'middle'
            }}
          >
            mail
          </span>
        </a>
      </div>
      <div style={{ marginTop: '1em', padding: '0.5em 0 0 0' }}>
        <a
          href="https://twitter.com/koh110"
          target="_blank"
          rel="noopener noreferrer"
        >
          <ChatBubbleOutline style={{ fontSize: `${fontSize * 1.2}pt` }} />
          <span style={{ paddingLeft: '5px', fontSize: `${fontSize * 0.8}pt` }}>
            @koh110
          </span>
        </a>
      </div>
    </>
  )
}

Contact.Layout = Layout

export default Contact
