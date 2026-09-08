import { createContext, useCallback, useContext, useRef, useState } from 'react'

import ToastViewport from '../components/ui/ToastViewport'

const ToastContext = createContext(null)
let nextId = 1

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const timers = useRef(new Map())

  const dismissToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
    const timer = timers.current.get(id)
    if (timer) {
      clearTimeout(timer)
      timers.current.delete(id)
    }
  }, [])

  const showToast = useCallback(
    ({ type = 'info', message, duration = 5000 }) => {
      const id = nextId++
      setToasts((current) => [...current, { id, type, message }])
      if (duration > 0) {
        timers.current.set(
          id,
          setTimeout(() => dismissToast(id), duration)
        )
      }
      return id
    },
    [dismissToast]
  )

  return (
    <ToastContext.Provider value={{ showToast, dismissToast }}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used within a ToastProvider')
  return context
}
