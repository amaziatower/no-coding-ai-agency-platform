// src/hooks/useToast.ts
import { useState, useCallback } from 'react'

interface ToastMessage {
  id: string
  message: string
  type: 'success' | 'error'
}

export function useToast() {
  const [toasts, setToasts] = useState<Array<ToastMessage>>([])

  const addToast = useCallback(
    (message: string, type: 'success' | 'error' = 'success') => {
      const toast = {
        id: Math.random().toString(36).substring(2, 9),
        message,
        type,
      }
      setToasts((prevToasts) => [...prevToasts, toast])

      setTimeout(() => {
        setToasts((prevToasts) => prevToasts.filter((t) => t.id !== toast.id))
      }, 3000)
    },
    [],
  )

  return { addToast, toasts }
}
