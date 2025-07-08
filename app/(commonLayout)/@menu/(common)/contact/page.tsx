'use client'
import { useMenuSegment } from '../_context'

export default function MenuPage() {
  const { setSegment } = useMenuSegment()
  setSegment('contact')
  return (
    <></>
  )
}
