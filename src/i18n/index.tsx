/**
 * i18n — Lightweight internationalization for TempleVerse
 * Supports: English (en), Hindi (hi), Tamil (ta), Telugu (te)
 * No external library needed — uses React Context + JSON locale files.
 */

import { createContext, useContext, useState, ReactNode } from 'react'
import en from './locales/en.json'
import hi from './locales/hi.json'
import ta from './locales/ta.json'
import te from './locales/te.json'

export type Locale = 'en' | 'hi' | 'ta' | 'te'

const LOCALES: Record<Locale, typeof en> = { en, hi, ta, te }

export const LOCALE_LABELS: Record<Locale, { label: string; flag: string }> = {
  en: { label: 'English',  flag: '🇬🇧' },
  hi: { label: 'हिंदी',    flag: '🇮🇳' },
  ta: { label: 'தமிழ்',   flag: '🇮🇳' },
  te: { label: 'తెలుగు',   flag: '🇮🇳' },
}

// ──────────────────────────────────────────────────────────────────────────────
// Deep get helper: t('common.save') → LOCALES[locale].common.save
// ──────────────────────────────────────────────────────────────────────────────
function deepGet(obj: Record<string, unknown>, path: string): string {
  const keys = path.split('.')
  let cur: unknown = obj
  for (const k of keys) {
    if (cur && typeof cur === 'object' && k in (cur as Record<string, unknown>)) {
      cur = (cur as Record<string, unknown>)[k]
    } else {
      return path // fallback: return the key itself
    }
  }
  return typeof cur === 'string' ? cur : path
}

// ──────────────────────────────────────────────────────────────────────────────
// Context
// ──────────────────────────────────────────────────────────────────────────────
interface I18nContext {
  locale: Locale
  setLocale: (l: Locale) => void
  t: (key: string) => string
}

const Ctx = createContext<I18nContext | undefined>(undefined)

export function I18nProvider({ children }: { children: ReactNode }) {
  const stored = (localStorage.getItem('tv_locale') as Locale) || 'en'
  const [locale, setLocaleState] = useState<Locale>(stored)

  function setLocale(l: Locale) {
    setLocaleState(l)
    localStorage.setItem('tv_locale', l)
  }

  function t(key: string): string {
    const dict = LOCALES[locale] as Record<string, unknown>
    const result = deepGet(dict, key)
    // fallback to English if missing in current locale
    if (result === key && locale !== 'en') {
      return deepGet(LOCALES.en as Record<string, unknown>, key)
    }
    return result
  }

  return <Ctx.Provider value={{ locale, setLocale, t }}>{children}</Ctx.Provider>
}

export function useI18n() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useI18n must be inside I18nProvider')
  return ctx
}
