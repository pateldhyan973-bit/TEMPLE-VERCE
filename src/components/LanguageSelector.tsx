import { useState, useRef, useEffect } from 'react'
import { useI18n, LOCALE_LABELS, Locale } from '../i18n'
import { IconChevronRight } from './Icons'

export default function LanguageSelector() {
  const { locale, setLocale } = useI18n()
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[#1a1715] hover:bg-[#24201c] border border-white/[0.08] text-xs text-[#d6cebf] transition-colors"
        title="Select Language"
      >
        <span>{LOCALE_LABELS[locale].flag}</span>
        <span className="font-semibold">{LOCALE_LABELS[locale].label}</span>
        <span className="text-[10px] text-[#a3998b]">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="absolute top-full mt-1.5 right-0 z-50 min-w-[150px] bg-[#1a1715] border border-amber-500/25 rounded-xl shadow-2xl py-1 backdrop-blur-xl animate-fade-in overflow-hidden">
          {(Object.entries(LOCALE_LABELS) as [Locale, { label: string; flag: string }][]).map(([code, meta]) => (
            <button
              key={code}
              onClick={() => {
                setLocale(code)
                setOpen(false)
              }}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs transition-colors ${
                locale === code
                  ? 'bg-amber-500/15 text-amber-300 font-bold'
                  : 'text-[#d6cebf] hover:bg-white/[0.04]'
              }`}
            >
              <div className="flex items-center gap-2">
                <span>{meta.flag}</span>
                <span>{meta.label}</span>
              </div>
              {locale === code && <span className="text-amber-400 font-bold">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
