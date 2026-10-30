import { useState, useEffect } from 'react'
import {
  IconWallet,
  IconTicket,
  IconCheck,
  IconClock,
  IconQrCode,
  IconTemple,
  IconSparkles,
  IconX,
  IconUsers
} from '../components/Icons'

interface StoredPass {
  id: string
  name: string
  gate: string
  slot: string
  partySize: number
  type?: string
  sevaName?: string
  createdAt?: string
}

const DEFAULT_SAMPLE_PASSES: StoredPass[] = [
  {
    id: 'DARSHAN-7842',
    name: 'Anand Sharma & Family',
    gate: 'Gate 3 - South Express',
    slot: '06:00 AM – 08:00 AM (Early Darshan)',
    partySize: 3,
    type: 'VIP_DARSHAN',
    createdAt: new Date().toISOString()
  },
  {
    id: 'PRASAD-1190',
    name: 'Anand Sharma',
    gate: 'Prasadam Counter Block B',
    slot: 'Pickup: 08:30 AM – 10:00 AM',
    partySize: 1,
    type: 'PRASADAM',
    sevaName: 'Special Pure Ghee Temple Laddoo (Box of 4)',
    createdAt: new Date(Date.now() - 3600000).toISOString()
  }
]

export default function DevoteeWallet() {
  const [passes, setPasses] = useState<StoredPass[]>([])
  const [selectedPass, setSelectedPass] = useState<StoredPass | null>(null)

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('temple_pilgrim_passes') || '[]')
      if (stored.length > 0) {
        setPasses(stored)
      } else {
        setPasses(DEFAULT_SAMPLE_PASSES)
        localStorage.setItem('temple_pilgrim_passes', JSON.stringify(DEFAULT_SAMPLE_PASSES))
      }
    } catch {
      setPasses(DEFAULT_SAMPLE_PASSES)
    }
  }, [])

  function handleDeletePass(id: string) {
    const updated = passes.filter(p => p.id !== id)
    setPasses(updated)
    localStorage.setItem('temple_pilgrim_passes', JSON.stringify(updated))
    if (selectedPass?.id === id) setSelectedPass(null)
  }

  function handlePrintPass(pass: StoredPass) {
    window.print()
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#181512] border border-amber-500/20 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="badge-pill bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 font-semibold">
              <IconWallet size={12} />
              DIGITAL DEVOTEE WALLET
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-white font-display">
              My Active Darshan & Seva Passes
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              All your booked E-Passes, Darshan appointments, Seva tokens, and Prasadam collection vouchers in one secure place. Scan these QR codes at the gate turnstiles.
            </p>
          </div>

          <div className="px-5 py-3.5 rounded-xl bg-slate-900/90 border border-white/[0.08] text-center">
            <div className="text-[10px] font-mono text-slate-400 uppercase">Active Passes</div>
            <div className="text-2xl font-bold text-amber-400 font-mono mt-0.5">
              {passes.length}
            </div>
          </div>
        </div>
      </div>

      {/* Passes Grid */}
      {passes.length === 0 ? (
        <div className="card-pro p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
            <IconTicket size={28} />
          </div>
          <h3 className="text-lg font-bold text-white font-display">
            No Active Passes in Wallet
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            You do not have any active Darshan E-Passes or Seva tokens right now. Book a complimentary Virtual Queue slot to bypass outer lines.
          </p>
          <div className="pt-2">
            <button
              onClick={() => {
                setPasses(DEFAULT_SAMPLE_PASSES)
                localStorage.setItem('temple_pilgrim_passes', JSON.stringify(DEFAULT_SAMPLE_PASSES))
              }}
              className="btn-primary py-2.5 px-5 text-xs"
            >
              Load Sample Devotee Passes
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {passes.map((pass, idx) => (
            <div
              key={`${pass.id || 'pass'}-${idx}`}
              className="card-pro p-6 flex flex-col justify-between border border-amber-500/25 relative overflow-hidden space-y-5 bg-gradient-to-b from-[#1c1815] to-[#141210]"
            >
              {/* Header */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                    {pass.type || 'VIRTUAL DARSHAN PASS'}
                  </span>
                  <button
                    onClick={() => handleDeletePass(pass.id)}
                    title="Remove pass"
                    className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  >
                    <IconX size={15} />
                  </button>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white font-display">
                    {pass.name}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    REF ID: <span className="text-amber-400 font-bold">{pass.id}</span>
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-white/[0.06] space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Assigned Gate:</span>
                    <span className="font-semibold text-white">{pass.gate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Slot Window:</span>
                    <span className="font-mono text-emerald-400 font-medium">{pass.slot}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Party Size:</span>
                    <span className="font-mono text-white">{pass.partySize || 1} Persons</span>
                  </div>
                </div>

                {/* Barcode & Turnstile QR preview */}
                <div className="p-3 rounded-xl bg-white p-3 text-slate-950 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="font-mono text-[9px] font-bold tracking-widest text-slate-600">
                      TURNSTILE BARCODE CLEARANCE
                    </div>
                    {/* SVG Barcode Representation */}
                    <svg width="140" height="28" viewBox="0 0 140 28">
                      <rect x="0" y="0" width="3" height="28" fill="#000" />
                      <rect x="5" y="0" width="1" height="28" fill="#000" />
                      <rect x="8" y="0" width="4" height="28" fill="#000" />
                      <rect x="14" y="0" width="2" height="28" fill="#000" />
                      <rect x="18" y="0" width="1" height="28" fill="#000" />
                      <rect x="22" y="0" width="3" height="28" fill="#000" />
                      <rect x="28" y="0" width="2" height="28" fill="#000" />
                      <rect x="33" y="0" width="4" height="28" fill="#000" />
                      <rect x="40" y="0" width="1" height="28" fill="#000" />
                      <rect x="44" y="0" width="3" height="28" fill="#000" />
                      <rect x="50" y="0" width="2" height="28" fill="#000" />
                      <rect x="55" y="0" width="4" height="28" fill="#000" />
                      <rect x="62" y="0" width="1" height="28" fill="#000" />
                      <rect x="66" y="0" width="3" height="28" fill="#000" />
                      <rect x="72" y="0" width="2" height="28" fill="#000" />
                      <rect x="77" y="0" width="4" height="28" fill="#000" />
                      <rect x="84" y="0" width="2" height="28" fill="#000" />
                      <rect x="89" y="0" width="3" height="28" fill="#000" />
                      <rect x="95" y="0" width="1" height="28" fill="#000" />
                      <rect x="99" y="0" width="4" height="28" fill="#000" />
                      <rect x="106" y="0" width="2" height="28" fill="#000" />
                      <rect x="111" y="0" width="3" height="28" fill="#000" />
                      <rect x="117" y="0" width="1" height="28" fill="#000" />
                      <rect x="121" y="0" width="4" height="28" fill="#000" />
                      <rect x="128" y="0" width="2" height="28" fill="#000" />
                      <rect x="133" y="0" width="3" height="28" fill="#000" />
                    </svg>
                  </div>

                  <div className="w-12 h-12 bg-black text-white p-1 rounded-lg flex items-center justify-center shrink-0">
                    <IconQrCode size={36} color="#ffffff" />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={() => setSelectedPass(pass)}
                  className="flex-1 btn-secondary py-2 text-xs flex items-center justify-center gap-1.5"
                >
                  <IconQrCode size={14} />
                  <span>Expand QR</span>
                </button>
                <button
                  onClick={() => handlePrintPass(pass)}
                  className="flex-1 btn-primary py-2 text-xs flex items-center justify-center gap-1.5"
                >
                  <span>Print Pass</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Expanded QR Modal */}
      {selectedPass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-sm bg-white text-slate-950 rounded-3xl p-6 sm:p-7 shadow-2xl text-center space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <span className="font-mono text-xs font-bold text-slate-600">
                OFFICIAL TEMPLE E-PASS
              </span>
              <button
                onClick={() => setSelectedPass(null)}
                className="p-1 rounded text-slate-400 hover:text-slate-900"
              >
                ✕
              </button>
            </div>

            <div className="w-48 h-48 bg-slate-100 border-2 border-slate-900 rounded-2xl mx-auto flex items-center justify-center p-3 shadow-inner">
              <IconQrCode size={160} color="#000000" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold font-display text-slate-950">
                {selectedPass.name}
              </h3>
              <p className="font-mono text-xs text-slate-500">
                PASS ID: {selectedPass.id}
              </p>
              <p className="font-semibold text-xs text-emerald-700">
                {selectedPass.gate} • {selectedPass.slot}
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setSelectedPass(null)}
                className="w-full py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
              >
                Close Turnstile Code
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
