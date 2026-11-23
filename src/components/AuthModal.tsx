import { useState, useEffect } from 'react'
import { UserProfile, loginPilgrim, loginAdmin, registerPilgrim, loginWithGoogle } from '../services/firebase'
import { IconShield, IconTicket, IconX } from './Icons'

interface AuthModalProps {
  isOpen: boolean
  initialMode?: 'LOGIN_PILGRIM' | 'REGISTER_PILGRIM' | 'LOGIN_ADMIN'
  onClose: () => void
  onSuccess: (user: UserProfile) => void
}

export default function AuthModal({ isOpen, initialMode = 'LOGIN_PILGRIM', onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<'LOGIN_PILGRIM' | 'REGISTER_PILGRIM' | 'LOGIN_ADMIN'>(initialMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [adminSecretKey, setAdminSecretKey] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  useEffect(() => {
    if (isOpen && initialMode) {
      setMode(initialMode)
      if (initialMode === 'LOGIN_ADMIN') {
        setEmail('operations@pilgrimflow.gov')
        setPassword('admin123')
        setAdminSecretKey('ADMIN2026')
      }
    }
  }, [isOpen, initialMode])

  if (!isOpen) return null

  function resetForm() {
    setEmail('')
    setPassword('')
    setName('')
    setPhone('')
    setAdminSecretKey('')
    setError(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (mode === 'LOGIN_PILGRIM') {
        const user = await loginPilgrim(email, password)
        onSuccess(user)
        onClose()
        resetForm()
      } else if (mode === 'REGISTER_PILGRIM') {
        if (!name.trim()) throw new Error('Full name is required')
        if (password.length < 6) throw new Error('Password must be at least 6 characters')
        const user = await registerPilgrim(name, email, password, phone)
        onSuccess(user)
        onClose()
        resetForm()
      } else if (mode === 'LOGIN_ADMIN') {
        if (!adminSecretKey.trim()) throw new Error('Admin authorization key is required')
        const user = await loginAdmin(email, password, adminSecretKey)
        onSuccess(user)
        onClose()
        resetForm()
      }
    } catch (err: any) {
      const code = err?.code || ''
      if (code === 'auth/user-not-found') setError('No account found with this email. Please register first.')
      else if (code === 'auth/wrong-password') setError('Incorrect password. Please try again.')
      else if (code === 'auth/invalid-email') setError('Invalid email address format.')
      else if (code === 'auth/email-already-in-use') setError('This email is already registered. Please sign in.')
      else if (code === 'auth/too-many-requests') setError('Too many attempts. Please wait a moment and try again.')
      else setError(err.message || 'Authentication failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogleLogin() {
    setError(null)
    setGoogleLoading(true)
    try {
      const role = mode === 'LOGIN_ADMIN' ? 'ADMIN' : 'PILGRIM'
      const user = await loginWithGoogle(role)
      onSuccess(user)
      onClose()
      resetForm()
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed. Please try again.')
    } finally {
      setGoogleLoading(false)
    }
  }

  const isAdminMode = mode === 'LOGIN_ADMIN'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md bg-[#181512] border border-white/[0.08] rounded-2xl p-6 sm:p-7 shadow-2xl relative space-y-5">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[#b8ae9f] hover:text-white hover:bg-white/5 transition-colors"
        >
          <IconX size={18} />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500/20 to-amber-400/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
            {isAdminMode ? <IconShield size={22} /> : <IconTicket size={22} />}
          </div>
          <h2 className="text-lg font-bold text-[#fbf9f5] font-display">
            {isAdminMode ? 'Security & Command Clearance' : mode === 'REGISTER_PILGRIM' ? 'Create Devotee Account' : 'Devotee Sign In'}
          </h2>
          <p className="text-xs text-[#a89f91]">
            {isAdminMode
              ? 'Authorized Temple Officers & Security Clearance'
              : 'Access your virtual queue passes, darshan slots, and alerts'}
          </p>
        </div>

        {/* Segmented Mode Selector */}
        <div className="flex bg-[#12100e] p-1 rounded-xl border border-white/[0.06] text-xs">
          <button
            type="button"
            onClick={() => { setMode('LOGIN_PILGRIM'); setError(null) }}
            className={`flex-1 py-1.5 rounded-lg font-semibold transition-all ${
              mode === 'LOGIN_PILGRIM' ? 'bg-amber-500 text-[#1a1612] shadow font-bold' : 'text-[#a89f91] hover:text-[#fbf9f5]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('REGISTER_PILGRIM'); setError(null) }}
            className={`flex-1 py-1.5 rounded-lg font-semibold transition-all ${
              mode === 'REGISTER_PILGRIM' ? 'bg-amber-500 text-[#1a1612] shadow font-bold' : 'text-[#a89f91] hover:text-[#fbf9f5]'
            }`}
          >
            Register
          </button>
          <button
            type="button"
            onClick={() => { setMode('LOGIN_ADMIN'); setError(null) }}
            className={`flex-1 py-1.5 rounded-lg font-semibold transition-all ${
              mode === 'LOGIN_ADMIN' ? 'bg-amber-500 text-[#1a1612] shadow font-bold' : 'text-[#a89f91] hover:text-[#fbf9f5]'
            }`}
          >
            Admin Clearance
          </button>
        </div>

        {/* Google Sign-in */}
        {!isAdminMode && (
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading || loading}
            className="w-full py-2.5 px-4 rounded-xl border border-white/[0.1] bg-white/[0.04] hover:bg-white/[0.08] text-white text-xs font-semibold flex items-center justify-center gap-2.5 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Continue with Google</span>
          </button>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'REGISTER_PILGRIM' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Ramesh Patel"
                className="input-pro text-xs"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {isAdminMode ? 'Official Admin Email' : 'Email Address'}
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder={isAdminMode ? 'admin@temple.org' : 'devotee@example.com'}
              className="input-pro text-xs"
            />
          </div>

          {mode === 'REGISTER_PILGRIM' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number (For SMS Alerts)</label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="input-pro text-xs"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="input-pro text-xs"
            />
          </div>

          {isAdminMode && (
            <div>
              <label className="block text-xs font-semibold text-amber-300 mb-1">Admin Security Authorization Key *</label>
              <input
                type="password"
                required
                value={adminSecretKey}
                onChange={e => setAdminSecretKey(e.target.value)}
                placeholder="Enter temple security secret key"
                className="input-pro text-xs border-amber-500/40 focus:border-amber-400"
              />
            </div>
          )}

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all shadow-md ${
              isAdminMode
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                : 'btn-primary'
            }`}
          >
            {loading ? 'Authenticating...' : isAdminMode ? 'Authorize Admin Clearance' : mode === 'REGISTER_PILGRIM' ? 'Create Free Account' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
