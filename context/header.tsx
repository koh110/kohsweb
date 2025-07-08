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

  useEffect(() => {
    let timer: number | null = null
    const typing = () => {
      timer = window.setTimeout(() => {
        const renew = TITLE.slice(0, title.length + 1)
        setTitle(renew)
        if (renew.length !== TITLE.length) {
          typing()
        } else {
          setEnd(true)
        }
      }, 200)
    }
    typing()

    return () => {
      if (timer) {
        clearTimeout(timer)
      }
    }
  }, [title])

  return (
    <HeaderContext.Provider value={[title, setTitle, end, setEnd]}>
      {children}
    </HeaderContext.Provider>
  )
}
