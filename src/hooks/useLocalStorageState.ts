import { useEffect, useState } from "react"

const readValue = <T,>(key: string, fallbackValue: T): T => {
  const savedValue = localStorage.getItem(key)

  if (savedValue === null) {
    return fallbackValue
  }

  try {
    return JSON.parse(savedValue) as T
  } catch {
    return fallbackValue
  }
}

export function useLocalStorageState<T>(key: string, fallbackValue: T) {
  const [value, setValue] = useState<T>(() => readValue(key, fallbackValue))

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue] as const
}
