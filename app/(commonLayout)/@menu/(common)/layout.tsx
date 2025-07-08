'use client'
import Menu from './_components/Menu'
import { MenuInner } from './_components/MenuInner.client'
import { MenuSegmentProvider } from './_context'
import { type Segment } from './_constants'
import { useSelectedLayoutSegment } from 'next/navigation'

export default function MenuLayout({ children }: React.PropsWithChildren) {
  const segment = useSelectedLayoutSegment()

  const getCurrentSegment = (): Segment => {
    if (segment === 'work') return 'work'
    if (segment === 'log') return 'log'
    if (segment === 'contact') return 'contact'
    return 'about'
  }
  
  return (
    <MenuSegmentProvider current={getCurrentSegment()}>
      <Menu>
        <MenuInner />
        {children}
      </Menu>
    </MenuSegmentProvider>
  )
}
