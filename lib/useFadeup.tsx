import { useState, useEffect } from 'react'
import { useAnimation } from './useAnimation'

export const useFadeup = () => {
  const { addClassnameFlag, intersectionRef } = useAnimation()
  const [classnames, setClassnames] = useState<string[]>([])
  const [prevAddClassnameFlag, setPrevAddClassnameFlag] =
    useState(addClassnameFlag)

  if (prevAddClassnameFlag !== addClassnameFlag) {
    setPrevAddClassnameFlag(addClassnameFlag)
    if (addClassnameFlag) {
      setClassnames(['fadeup'])
    } else {
      setClassnames(['before-fadeup'])
    }
  }

  return {
    classnames,
    intersectionRef
  } as const
}
