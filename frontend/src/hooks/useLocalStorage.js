import { useEffect, useState } from 'react'

// useState that also saves to localStorage, so it survives a refresh.
// If storage is blocked (private mode etc) it just acts like normal state.
export default function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key)
      return saved === null ? initialValue : JSON.parse(saved)
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // storage full or blocked, nothing we can do
    }
  }, [key, value])

  return [value, setValue]
}
