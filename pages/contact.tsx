import css from 'styled-jsx/css'
import TwitterIcon from '@mui/icons-material/Twitter'
import Stack from '@mui/material/Stack'
import MailOutlineIcon from '@mui/icons-material/MailOutline'
import { PageComponent } from '../types/Component'
import Layout from '../components/Layout'
import Title from '../components/ContentTitle'

const styles = css`
  p {
    font-size: 0.875rem;
  }
  .link {
    border: 1px solid rgba(25, 118, 210, 0.5);
    padding: 5px 15px;
    border-radius: 4px;
  }
  .link :global(svg) {
    margin-right: 8px;
  }
`

const Contact: PageComponent = () => {
  return (
    <>
      <Title>Contact</Title>
      <style jsx>{styles}</style>
      <Stack>
        <p>依頼・ご相談等は下記メール、またはtwitterでご連絡ください。</p>
        <Stack direction="row" spacing={1}>
          <a className="link" href="mailto:kohta110@gmail.com">
            <MailOutlineIcon fontSize="small" />
            mail
          </a>
          <a
            className="link"
            href="https://twitter.com/koh110"
            target="_blank"
            rel="noopener noreferrer"
          >
            <TwitterIcon fontSize="small" />
            @koh110
          </a>
        </Stack>
      </Stack>
    </>
  )
}

Contact.Layout = Layout

export default Contact
