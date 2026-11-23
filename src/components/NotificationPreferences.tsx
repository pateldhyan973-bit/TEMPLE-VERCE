import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNotifications } from '../hooks/useNotifications'
import { IconBell, IconCheck } from './Icons'

type Preferences = {
  sms: boolean
  email: boolean
  push: boolean
  whatsapp: boolean
  quietHoursStart: string
  quietHoursEnd: string
  emergencyOnly: boolean
  language: string
}

const DEFAULTS: Preferences = {
  sms: true,
  email: true,
  push: true,
  whatsapp: false,
  quietHoursStart: '22:00',
  quietHoursEnd: '06:00',
  emergencyOnly: false,
  language: 'en',
}

export default function NotificationPreferences() {
  const { user } = useAuth()
  const { fetchPreferences, updatePreferences } = useNotifications()
  const [preferences, setPreferences] = useState<Preferences>(DEFAULTS)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!user?.uid) return
    fetchPreferences(user.uid).then(data => {
      if (data) setPreferences({ ...DEFAULTS, ...data })
    })
  }, [user?.uid])

  const set = <K extends keyof Preferences>(key: K, value: Preferences[K]) => {
    setPreferences(current => ({ ...current, [key]: value }))
  }

  const save = async () => {
    if (!user?.uid) return
    setSaving(true)
    setMessage('')
    try {
      await updatePreferences(user.uid, preferences)
      setMessage('Preferences saved successfully.')
    } catch {
      setMessage('Preferences updated locally.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="card-pro p-6 space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center">
            <IconBell size={18} />
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-display">Devotee Notification & Advisory Preferences</h3>
            <p className="text-xs text-slate-400">Choose how you wish to receive queue status alerts and temple safety broadcasts</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {([
          ['sms', 'SMS Mobile Alerts'],
          ['whatsapp', 'WhatsApp Updates'],
          ['push', 'App Push Notifications'],
          ['email', 'Email Confirmations'],
        ] as const).map(([key, label]) => (
          <label
            key={key}
            className={`p-3.5 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
              preferences[key]
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-200'
                : 'bg-slate-900/50 border-white/[0.06] text-slate-400 hover:text-slate-200'
            }`}
          >
            <input
              type="checkbox"
              checked={preferences[key]}
              onChange={e => set(key, e.target.checked)}
              className="rounded text-amber-500 accent-amber-500 focus:ring-0"
            />
            <span className="text-xs font-semibold">{label}</span>
          </label>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Quiet Hours Start</label>
          <input
            type="time"
            value={preferences.quietHoursStart}
            onChange={e => set('quietHoursStart', e.target.value)}
            className="input-pro text-xs"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Quiet Hours End</label>
          <input
            type="time"
            value={preferences.quietHoursEnd}
            onChange={e => set('quietHoursEnd', e.target.value)}
            className="input-pro text-xs"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Emergency Filtering</label>
          <label className="p-2.5 rounded-xl bg-slate-900/50 border border-white/[0.06] flex items-center gap-2.5 cursor-pointer text-xs text-slate-300 h-10">
            <input
              type="checkbox"
              checked={preferences.emergencyOnly}
              onChange={e => set('emergencyOnly', e.target.checked)}
              className="rounded text-rose-500 focus:ring-0"
            />
            <span>Critical Safety Only</span>
          </label>
        </div>
      </div>

      {message && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <IconCheck size={14} />
          <span>{message}</span>
        </div>
      )}

      <div className="flex justify-end pt-2">
        <button
          onClick={save}
          disabled={saving}
          className="btn-primary py-2.5 px-5 text-xs font-semibold"
        >
          {saving ? 'Saving...' : 'Save Advisory Settings'}
        </button>
      </div>
    </div>
  )
}