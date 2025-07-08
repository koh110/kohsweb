'use client'
import Menu from './(common)/_components/Menu'
import { MenuInner } from './(common)/_components/MenuInner.client'
import { MenuSegmentProvider } from './(common)/_context'

export default function MenuDefault() {
  return (
    <MenuSegmentProvider current="about">
      <Menu>
        <MenuInner />
      </Menu>
    </MenuSegmentProvider>
  )
}
