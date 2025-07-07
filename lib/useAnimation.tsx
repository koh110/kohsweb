import { useState } from 'react'
import { useIntersectionObserver } from './useIntersectionObserver'

export const useAnimation = () => {
  const [renderd, setRenderd] = useState(false)
  const [intersectionRef, isIntersecting] = useIntersectionObserver()
  const [addClassnameFlag, setAddClassnameFlag] = useState(false)
  const [previousIntersecting, setPreviousIntersecting] = useState(false)

  if (previousIntersecting !== isIntersecting) {
    setPreviousIntersecting(isIntersecting)
    ;(() => {
      if (renderd === true) {
        return
      }
      if (isIntersecting && renderd === false) {
        setAddClassnameFlag(true)
        setRenderd(true)
      } else {
        setAddClassnameFlag(false)
      }
    })()
  }

  return {
    addClassnameFlag,
    intersectionRef
  } as const
}
