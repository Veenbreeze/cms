import { createContext, useCallback, useContext, useEffect, useState } from 'react'

import axiosClient, { setAccessToken } from '../services/api/axiosClient'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function bootstrap() {
      try {
        const refreshResponse = await axiosClient.post('/auth/refresh/')
        setAccessToken(refreshResponse.data.access)
        const meResponse = await axiosClient.get('/auth/me/')
        if (!cancelled) setUser(meResponse.data)
      } catch {
        setAccessToken(null)
        if (!cancelled) setUser(null)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    bootstrap()
    const handleSessionExpired = () => setUser(null)
    window.addEventListener('cmsa:session-expired', handleSessionExpired)
    return () => {
      cancelled = true
      window.removeEventListener('cmsa:session-expired', handleSessionExpired)
    }
  }, [])

  const login = useCallback(async (email, password, rememberMe = false) => {
    const response = await axiosClient.post('/auth/login/', { email, password, remember_me: rememberMe })
    setAccessToken(response.data.access)
    setUser(response.data.user)
    return response.data.user
  }, [])

  const logout = useCallback(async () => {
    try {
      await axiosClient.post('/auth/logout/')
    } finally {
      setAccessToken(null)
      setUser(null)
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}
