import { useState, useEffect } from 'react'
import { useIntersectionObserver } from './useIntersectionObserver'

export const useAnimation = () => {
  const [renderd, setRenderd] = useState(false)
  const [intersectionRef, isIntersecting] = useIntersectionObserver()
  const [addClassnameFlag, setAddClassnameFlag] = useState(false)

  useEffect(() => {
    if (renderd === true) {
      return
    }
    if (isIntersecting && renderd === false) {
      setAddClassnameFlag(true)
      setRenderd(true)
    } else {
      setAddClassnameFlag(false)
    }
  }, [isIntersecting])

  return {
    addClassnameFlag,
    intersectionRef
  } as const
}
