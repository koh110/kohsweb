import { PageComponent } from '../types/Component'
import Layout from '../components/Layout'
import { About } from '../components/About'

const Index: PageComponent = () => {
  return <About />
}

Index.Layout = Layout

export default Index
