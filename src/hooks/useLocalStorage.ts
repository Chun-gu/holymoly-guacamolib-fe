import { useCallback, useState } from 'react'

export default function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T) => void] {
  const getStoredValue = useCallback(() => {
    const item = localStorage.getItem(key)

    return item === null ? initialValue : (parseJSON(item) as T)
  }, [initialValue, key])

  const [storedValue, setStoredValue] = useState(() => getStoredValue())

  const setValue = useCallback((value: T) => {
    localStorage.setItem(key, JSON.stringify(value))
    setStoredValue(value)
  }, [key])

  return [storedValue, setValue]
}

function parseJSON<T>(value: string | null): T | undefined {
  return value === 'undefined' ? undefined : JSON.parse(value ?? '')
}
