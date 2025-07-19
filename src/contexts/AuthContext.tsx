'use client'

import { createContext, useContext, useEffect, useState } from 'react'

// Simple mock user type
interface MockUser {
  id: string
  email: string
  username?: string
}

interface AuthContextType {
  user: MockUser | null
  session: any | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, username: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(null)
  const [session, setSession] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate initial auth check
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }, [])

  const signIn = async (email: string, password: string) => {
    // Mock sign in - always succeeds
    const mockUser: MockUser = {
      id: 'mock-user-1',
      email: email,
      username: email.split('@')[0]
    }
    
    setUser(mockUser)
    setSession({ user: mockUser })
    
    // Simulate redirect to dashboard
    setTimeout(() => {
      window.location.href = '/dashboard'
    }, 1000)
  }

  const signUp = async (email: string, password: string, username: string) => {
    // Mock sign up - always succeeds
    const mockUser: MockUser = {
      id: 'mock-user-1',
      email: email,
      username: username
    }
    
    setUser(mockUser)
    setSession({ user: mockUser })
    
    // Simulate redirect to dashboard
    setTimeout(() => {
      window.location.href = '/dashboard'
    }, 1000)
  }

  const signOut = async () => {
    // Mock sign out
    setUser(null)
    setSession(null)
    
    // Simulate redirect to home
    setTimeout(() => {
      window.location.href = '/'
    }, 500)
  }

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 