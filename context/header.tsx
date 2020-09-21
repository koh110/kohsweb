import {
  createContext,
  useState,
  Dispatch,
  SetStateAction,
  useEffect
} from 'react'

export const HeaderContext = createContext<
  [
    string,
    Dispatch<SetStateAction<string>>,
    boolean,
    Dispatch<SetStateAction<boolean>>
  ]
>(['', () => {}, false, () => {}])

const TITLE = 'kohsweb'

export const HeaderProvider = ({ children }) => {
  const [title, setTitle] = useState('')
  const [end, setEnd] = useState(false)

  let timer = null
  const typing = () => {
    timer = setTimeout(() => {
      const renew = TITLE.slice(0, title.length + 1)
      setTitle(renew)
      if (renew.length !== TITLE.length) {
        typing()
      } else {
        setEnd(true)
      }
    }, 200)
  }

  useEffect(() => {
    typing()

    return () => {
      clearTimeout(timer)
    }
  }, [title])

  return (
    <HeaderContext.Provider value={[title, setTitle, end, setEnd]}>
      {children}
    </HeaderContext.Provider>
  )
}
