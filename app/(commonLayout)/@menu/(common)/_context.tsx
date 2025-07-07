'use client'
import { createContext, useContext, useState, type ReactNode, type Dispatch, type SetStateAction } from 'react'
import { type Segment } from './_constants'


type MenuSegmentContextType = {
  segment: Segment
  setSegment: Dispatch<SetStateAction<Segment>>
}

const MenuSegmentContext = createContext<MenuSegmentContextType>({
  segment: 'about',
  setSegment: () => {}
})

export const useMenuSegment = () => useContext(MenuSegmentContext)

export function MenuSegmentProvider({ 
  children, 
  current 
}: { 
  children: ReactNode
  current: Segment
}) {
  const [segment, setSegment] = useState<Segment>(current)

  return (
    <MenuSegmentContext.Provider value={{ segment, setSegment }}>
      {children}
    </MenuSegmentContext.Provider>
  )
}
