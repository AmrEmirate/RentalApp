'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { apiPost } from '@/lib/api-client'

export type UserRole = 'RT' | 'WARGA'

export interface User {
  id: number
  name: string
  noTelepon: string
  role: UserRole
}

/**
 * Hook untuk manage authentication state
 */
export function useAuth() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check auth status on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')

    if (storedToken && storedUser) {
      try {
        setToken(storedToken)
        setUser(JSON.parse(storedUser))
        setIsAuthenticated(true)
      } catch (error) {
        console.error('Failed to parse stored user:', error)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }

    setIsLoading(false)
  }, [])

  const login = useCallback(
    async (noTelepon: string, password: string) => {
      try {
        console.log('[v0] Calling login API')
        const data = await apiPost<{token: string, user: User}>('/auth/login', { noTelepon, password })

        console.log('[v0] Login response received:', { userId: data.user?.id })
        const { token: newToken, user: newUser } = data

        localStorage.setItem('token', newToken)
        localStorage.setItem('user', JSON.stringify(newUser))

        // Set cookies for Next.js Middleware with 7 days expiration
        const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString()
        document.cookie = `token=${newToken}; path=/; expires=${expires}; SameSite=Lax`
        document.cookie = `user=${encodeURIComponent(JSON.stringify(newUser))}; path=/; expires=${expires}; SameSite=Lax`

        setToken(newToken)
        setUser(newUser)
        setIsAuthenticated(true)

        // Navigate based on role
        const dashboard = newUser.role === 'WARGA' ? '/dashboard' : '/dashboard/rt'
        console.log('[v0] Navigating to:', dashboard)
        
        // Use window.location for more reliable redirect
        setTimeout(() => {
          window.location.href = dashboard
        }, 100)
      } catch (error: any) {
        console.error('[v0] Login error:', error)
        throw error
      }
    },
    [router]
  )

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    
    // Clear cookies
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    
    setToken(null)
    setUser(null)
    setIsAuthenticated(false)
    router.push('/login')
  }, [router])

  const updateUser = useCallback((updatedUser: Partial<User>) => {
    const newUser = { ...user, ...updatedUser } as User
    setUser(newUser)
    localStorage.setItem('user', JSON.stringify(newUser))
  }, [user])

  return {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    logout,
    updateUser,
  }
}
