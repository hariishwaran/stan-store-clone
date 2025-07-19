'use client'

import { useAuth } from '@/contexts/AuthContext'

export default function AuthDebug() {
  const { user, loading, session } = useAuth()

  if (process.env.NODE_ENV === 'production') {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs max-w-xs z-50">
      <h3 className="font-bold mb-2">Auth Debug</h3>
      <div className="space-y-1">
        <div>Loading: {loading ? 'true' : 'false'}</div>
        <div>User: {user ? user.email : 'null'}</div>
        <div>Session: {session ? 'exists' : 'null'}</div>
        <div>LocalStorage: {typeof window !== 'undefined' ? (localStorage.getItem('mockUser') ? 'exists' : 'null') : 'N/A'}</div>
      </div>
    </div>
  )
} 