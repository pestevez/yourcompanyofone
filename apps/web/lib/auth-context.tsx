'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { authAPI } from './api'

interface User {
  id: string
  email: string
  name: string
  organizations: Array<{
    organization: {
      id: string
      name: string
    }
    role: string
  }>
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => void
  currentOrganization: User['organizations'][0] | null
  setCurrentOrganization: (org: User['organizations'][0]) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentOrganization, setCurrentOrganization] = useState<User['organizations'][0] | null>(null)

  useEffect(() => {
    // Check if user is logged in on mount
    const token = localStorage.getItem('access_token')
    if (token) {
      // TODO: Validate token with backend
      // For now, we'll just check if token exists
      setLoading(false)
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login(email, password)
      localStorage.setItem('access_token', response.access_token)
      
      // Fetch user data from backend
      const userData = await authAPI.getProfile()
      setUser(userData)
      setCurrentOrganization(userData.organizations[0])
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  const register = async (email: string, password: string, name: string) => {
    try {
      const response = await authAPI.register(email, password, name)
      localStorage.setItem('access_token', response.access_token)
      
      // The register endpoint already returns user data
      setUser(response)
      setCurrentOrganization(response.organizations[0])
    } catch (error) {
      console.error('Register error:', error)
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('access_token')
    setUser(null)
    setCurrentOrganization(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        currentOrganization,
        setCurrentOrganization,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 