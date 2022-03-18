import { PageComponent } from '../../types/Component'
import Layout from '../../components/Layout'
import { Software as SoftInnter } from '../../components/Software'

const Software: PageComponent = () => {
  return <SoftInnter />
}

Software.Layout = Layout

export default Software
