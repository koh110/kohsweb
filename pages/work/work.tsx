import { PageComponent } from '../../types/Component'
import Layout from '../../components/Layout'
import WorkInner from '../../components/Work'

const Work: PageComponent = () => {
  return <WorkInner />
}

Work.Layout = Layout

export default Work
