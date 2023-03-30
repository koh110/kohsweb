'use client'

import { DarkModeProvider } from './darkMode'
import { HeaderProvider } from './header'

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}){
  return (
    <DarkModeProvider>
      <HeaderProvider>
        {children}
      </HeaderProvider>
    </DarkModeProvider>
  )
}
