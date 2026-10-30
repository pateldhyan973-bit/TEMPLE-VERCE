import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { UserProfile, logoutUser } from '../services/firebase'

interface AuthContextType {
  user: UserProfile | null
  role: 'PILGRIM' | 'ADMIN'
  isAuthModalOpen: boolean
  openAuthModal: () => void
  closeAuthModal: () => void
  setUserSession: (u: UserProfile | null) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  // Default session starts as Pilgrim for safety unless logged in
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('temple_user_session')
    return saved ? JSON.parse(saved) : null
  })

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  const role: 'PILGRIM' | 'ADMIN' = user ? user.role : 'PILGRIM'

  useEffect(() => {
    if (user) {
      localStorage.setItem('temple_user_session', JSON.stringify(user))
    } else {
      localStorage.removeItem('temple_user_session')
    }
  }, [user])

  function setUserSession(u: UserProfile | null) {
    setUser(u)
  }

  function logout() {
    logoutUser()
    setUser(null)
    localStorage.removeItem('temple_user_session')
  }

  return (
    <AuthContext.Provider value={{
      user,
      role,
      isAuthModalOpen,
      openAuthModal: () => setIsAuthModalOpen(true),
      closeAuthModal: () => setIsAuthModalOpen(false),
      setUserSession,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
