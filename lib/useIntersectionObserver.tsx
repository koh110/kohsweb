import { useState, useRef, useEffect } from 'react'

export const useIntersectionObserver = () => {
  const [node, setNode] = useState<Element>(null)
  const [isIntersecting, setIsIntersecting] = useState<boolean>(false)

  const observerRef = useRef(null)

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting)
      },
      {
        rootMargin: '0px',
        threshold: 0.5
      }
    )

    if (node) {
      observerRef.current.observe(node)
    }

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      observerRef.current?.disconnect()
    }
  }, [node])

  return [setNode, isIntersecting] as const
}
