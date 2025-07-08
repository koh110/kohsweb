import {
  createContext,
  useState,
  Dispatch,
  SetStateAction,
  useEffect
} from 'react'

export const DarkModeContext = createContext<
  [boolean, Dispatch<SetStateAction<boolean>>]
>([false, () => {}])

export const DarkModeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(
    typeof window !== "undefined"
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
      : false
  )

  useEffect(() => {
    if (darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark')
    } else {
      document.documentElement.setAttribute('data-theme', 'light')
    }
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (e.matches) {
        setDarkMode(true)
      } else {
        setDarkMode(false)
      }
    })
  })

  return (
    <DarkModeContext.Provider value={[darkMode, setDarkMode]}>
      {children}
    </DarkModeContext.Provider>
  )
}
