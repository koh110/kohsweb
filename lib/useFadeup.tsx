import { useState, useEffect } from 'react'
import { useAnimation } from './useAnimation'

export const useFadeup = () => {
  const { addClassnameFlag, intersectionRef } = useAnimation()
  const [classnames, setClassnames] = useState<string[]>([])

  useEffect(() => {
    if (addClassnameFlag) {
      setClassnames(['fadeup'])
    } else {
      setClassnames(['before-fadeup'])
    }
  }, [addClassnameFlag])

  return {
    classnames,
    intersectionRef
  } as const
}
