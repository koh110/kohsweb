import { LayoutComponent } from '../types/Component'
import Header from './Header'
import Menu from './Menu'

const Layout: LayoutComponent = ({ children }) => {
  return (
    <div className="layout">
      <style jsx>{`
        .layout {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          max-width: 980px;
          margin: 0 auto;
        }
        .contents {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 100%;
        }
        .contents:before {
          content: '';
          width: 100%;
          margin-top: 1em;
          border-top: 1px solid var(--color-border);
        }
        .contents-wrapper {
          width: 100%;
          margin: 1em 0px 0px;
          max-width: 820px;
        }
      `}</style>
      <Header />
      <Menu />
      <div className="contents">
        <div className="contents-wrapper">{children}</div>
      </div>
    </div>
  )
}

export default Layout
