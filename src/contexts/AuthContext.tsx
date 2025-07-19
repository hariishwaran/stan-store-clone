'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

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
  const router = useRouter()

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('mockUser')
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser)
      setUser(parsedUser)
      setSession({ user: parsedUser })
    }
    setLoading(false)
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
    
    // Store user in localStorage for persistence
    localStorage.setItem('mockUser', JSON.stringify(mockUser))
    
    // Use Next.js router for navigation
    router.push('/dashboard')
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
    
    // Store user in localStorage for persistence
    localStorage.setItem('mockUser', JSON.stringify(mockUser))
    
    // Use Next.js router for navigation
    router.push('/dashboard')
  }

  const signOut = async () => {
    // Mock sign out
    setUser(null)
    setSession(null)
    
    // Clear localStorage
    localStorage.removeItem('mockUser')
    
    // Use Next.js router for navigation
    router.push('/')
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