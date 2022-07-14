import { FunctionComponent, PropsWithChildren } from 'react'
import { AppProps } from 'next/app'
import { DarkModeProvider } from '../context/darkMode'
import { HeaderProvider } from '../context/header'
import { LayoutComponent } from '../types/Component'
import 'sanitize.css'
import '../styles/globals.css'

const Noop: FunctionComponent<PropsWithChildren> = ({ children }) => <>{children}</>

type MyAppProps<P = {}> = AppProps<P> & {
  Component: Pick<AppProps, 'Component'> & { Layout?: LayoutComponent }
}

const MyApp = ({ Component, pageProps }: MyAppProps) => {
  const Layout = Component.Layout || Noop

  return (
    <DarkModeProvider>
      <HeaderProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </HeaderProvider>
    </DarkModeProvider>
  )
}

export default MyApp
