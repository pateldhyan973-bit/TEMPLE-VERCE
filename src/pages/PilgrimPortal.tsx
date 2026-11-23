import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useSystemState } from '../context/SystemStateContext'
import { saveEPassToFirestore, getUserEPasses, EPass } from '../services/firebase'
import NotificationPreferences from '../components/NotificationPreferences'
import {
  IconTicket,
  IconClock,
  IconCheck,
  IconAlert,
  IconTemple,
  IconSparkles,
  IconDownload,
  IconQrCode,
  IconShield,
  IconUsers
} from '../components/Icons'

interface GateInfo {
  id: string
  name: string
  pct: number
  status: string
  open: boolean
}

export default function PilgrimPortal() {
  const { user } = useAuth()
  const { state: sysState } = useSystemState()

  const gates: GateInfo[] = sysState.gates.map(g => ({
    id: g.id, name: g.name, pct: g.pct, status: g.status, open: g.open,
  }))

  const [name, setName] = useState(user?.displayName || '')
  const [timeSlot, setTimeSlot] = useState('09:00 AM - 10:00 AM')
  const [selectedGate, setSelectedGate] = useState('Gate 3 - South Express')
  const [bookedPass, setBookedPass] = useState<EPass | null>(null)
  const [loading, setLoading] = useState(false)
  const [myPasses, setMyPasses] = useState<EPass[]>([])
  const [passesLoading, setPassesLoading] = useState(false)

  useEffect(() => {
    if (user?.displayName) setName(user.displayName)
  }, [user?.displayName])

  useEffect(() => {
    if (!user?.uid) {
      const local = JSON.parse(localStorage.getItem('temple_pilgrim_passes') || '[]')
      setMyPasses(local)
      return
    }
    setPassesLoading(true)
    getUserEPasses(user.uid)
      .then(setMyPasses)
      .finally(() => setPassesLoading(false))
  }, [user?.uid])

  async function handleBookPass(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)

    const passCode = `DARSHAN-${Math.floor(1000 + Math.random() * 9000)}`
    const newPass: EPass = {
      passId: passCode,
      pilgrimName: name,
      pilgrimUid: user?.uid || 'guest',
      pilgrimEmail: user?.email || 'devotee@temple.org',
      timeSlot,
      gate: selectedGate,
      status: 'CONFIRMED',
      createdAt: new Date().toISOString(),
    }

    await saveEPassToFirestore({
      passId: newPass.passId,
      pilgrimName: newPass.pilgrimName,
      pilgrimUid: newPass.pilgrimUid,
      pilgrimEmail: newPass.pilgrimEmail,
      timeSlot: newPass.timeSlot,
      gate: newPass.gate,
      status: newPass.status,
    })

    setBookedPass(newPass)
    setMyPasses(prev => [newPass, ...prev])
    setLoading(false)
  }

  function handlePrintPass(pass: EPass) {
    const printWin = window.open('', '_blank')
    if (!printWin) return
    printWin.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>TEMPLE OFFICIAL DARSHAN E-PASS - ${pass.passId}</title>
          <style>
            body { font-family: 'Helvetica Neue', Arial, sans-serif; background: #fdfbf7; color: #1c1815; padding: 40px; }
            .card { background: #fff; border: 2px solid #e7dfd5; padding: 32px; border-radius: 16px; max-width: 480px; margin: 0 auto; box-shadow: 0 10px 25px rgba(0,0,0,0.08); }
            .header { text-align: center; border-bottom: 2px dashed #e7dfd5; padding-bottom: 16px; margin-bottom: 20px; }
            .title { font-size: 18px; font-weight: 800; color: #b45309; letter-spacing: 1px; }
            .badge { display: inline-block; font-weight: 700; background: #fef3c7; color: #92400e; padding: 4px 12px; border-radius: 20px; font-size: 11px; margin-top: 6px; }
            .id { font-size: 26px; font-weight: 800; margin: 16px 0; font-family: monospace; letter-spacing: 2px; text-align: center; color: #d97706; }
            .field-row { display: flex; justify-content: space-between; font-size: 13px; margin: 10px 0; border-bottom: 1px solid #f6f3ee; padding-bottom: 6px; }
            .field-label { color: #8c7e6c; font-weight: 600; }
            .field-value { font-weight: 700; color: #1c1815; }
            .qr-box { text-align: center; margin: 24px 0 16px; }
            .notice { font-size: 11px; color: #64748b; text-align: center; line-height: 1.5; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="header">
              <div class="title">SHRINE SANCTUM DARSHAN E-PASS</div>
              <span class="badge">OFFICIAL VERIFIED ENTRY</span>
            </div>
            <div class="id">${pass.passId}</div>
            <div class="field-row">
              <span class="field-label">Devotee Name</span>
              <span class="field-value">${pass.pilgrimName}</span>
            </div>
            <div class="field-row">
              <span class="field-label">Allocated Entry Gate</span>
              <span class="field-value">${pass.gate}</span>
            </div>
            <div class="field-row">
              <span class="field-label">Darshan Slot</span>
              <span class="field-value">${pass.timeSlot}</span>
            </div>
            <div class="field-row">
              <span class="field-label">Pass Status</span>
              <span class="field-value" style="color:#059669;">${pass.status}</span>
            </div>
            <div class="qr-box">
              <svg width="120" height="120" viewBox="0 0 100 100" style="margin: 0 auto; display: block;">
                <rect width="100" height="100" fill="#ffffff" />
                <rect x="10" y="10" width="30" height="30" fill="#000000" />
                <rect x="15" y="15" width="20" height="20" fill="#ffffff" />
                <rect x="20" y="20" width="10" height="10" fill="#000000" />
                <rect x="60" y="10" width="30" height="30" fill="#000000" />
                <rect x="65" y="15" width="20" height="20" fill="#ffffff" />
                <rect x="70" y="20" width="10" height="10" fill="#000000" />
                <rect x="10" y="60" width="30" height="30" fill="#000000" />
                <rect x="15" y="65" width="20" height="20" fill="#ffffff" />
                <rect x="20" y="70" width="10" height="10" fill="#000000" />
                <rect x="50" y="50" width="15" height="15" fill="#000000" />
                <rect x="70" y="70" width="20" height="20" fill="#000000" />
                <rect x="45" y="75" width="15" height="15" fill="#000000" />
              </svg>
            </div>
            <p class="notice">
              Please arrive 15 minutes before your slot. Present this digital pass or physical printout at the designated electronic scanner gate for fast-track entry.
            </p>
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `)
    printWin.document.close()
  }

  return (
    <div className="space-y-6">
      {/* Devotee Emergency Notice if active */}
      {sysState.emergencyActive && (
        <div className="p-4 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 flex items-start gap-3 shadow-lg shadow-rose-950/30">
          <IconAlert size={20} className="text-rose-400 mt-0.5 shrink-0" />
          <div>
            <h4 className="text-sm font-bold text-rose-200">Temple Security Protocol Active</h4>
            <p className="text-xs text-rose-300/90 mt-0.5 leading-relaxed">
              Darshan is temporarily held for crowd dispersal. Please follow security stewards and exit signs through designated corridors E1–E4.
            </p>
          </div>
        </div>
      )}

      {/* Hero Welcome Banner */}
      <div className="card-pro p-6 sm:p-10 bg-[#0c1424] border border-white/[0.08] relative overflow-hidden min-h-[220px] flex flex-col justify-center">
        {/* Authentic Gopuram Photography Backdrop */}
        <img
          src="/assets/temple_gopuram.jpg"
          alt="Temple Gopuram"
          className="absolute inset-0 w-full h-full object-cover object-right filter brightness-[0.35] contrast-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#090e1a] via-[#090e1a]/85 to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="badge-pill bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[11px]">
                <IconTemple size={13} className="text-amber-400" />
                HOLY SHRINE SANCTUM
              </span>
              <span className="badge-pill badge-emerald text-[11px]">
                <span className="status-dot status-dot-emerald pulse-live" />
                SARVA DARSHAN OPEN
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
              Devotee Smart Darshan & Virtual Queue
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Book complimentary priority entry slots, check live gate queue wait times, and navigate sanctum amenities with real-time AI crowd optimization.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
            <div className="px-4 py-3 rounded-xl bg-slate-800/60 border border-white/[0.08] text-xs">
              <span className="text-slate-400 block text-[11px]">Morning Aarti & Darshan</span>
              <span className="font-semibold text-white font-mono text-sm">05:30 AM – 10:30 PM</span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Gate Status & Wait Times for Pilgrims */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#fbf9f5] font-display">Live Gate Wait Times & Recommendations</h3>
            <p className="text-xs text-[#a89f91]">Select fastest gates to minimize queue dwelling</p>
          </div>
          <span className="text-xs text-amber-400 font-mono">Updated 10s ago</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {gates.map(gate => {
            const isFastest = gate.pct < 45
            const waitMin = Math.max(5, Math.round(gate.pct * 0.35))
            const isCongested = gate.pct > 80

            return (
              <div
                key={gate.id}
                className={`card-pro p-4 relative transition-all ${
                  isFastest ? 'border-emerald-500/35 bg-[#181512] shadow-md shadow-emerald-950/20' : 'bg-[#141210]'
                }`}
              >
                {isFastest && (
                  <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-emerald-500 text-[#1a1612] font-bold text-[9px] font-mono tracking-wider shadow">
                    RECOMMENDED FAST TRACK
                  </span>
                )}
                <div className="text-xs font-bold text-slate-200 mb-2 truncate font-display">
                  {gate.name}
                </div>
                <div className="flex items-baseline justify-between mb-3">
                  <span className="text-xs text-slate-400">Est. Wait</span>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-2xl font-extrabold font-mono ${
                      isCongested ? 'text-rose-400' : isFastest ? 'text-emerald-400' : 'text-amber-400'
                    }`}>
                      {waitMin}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">mins</span>
                  </div>
                </div>

                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden mb-2">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isCongested ? 'bg-rose-500' : isFastest ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                    style={{ width: `${gate.pct}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Capacity: {gate.pct}%</span>
                  <span className="text-slate-300 font-medium">{gate.open ? 'Entry Open' : 'Restricted'}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Main Form & Passes Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Pass Booking Form (7 cols) */}
        <div className="lg:col-span-7 card-pro p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2 pb-3 border-b border-white/[0.08]">
              <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center">
                <IconTicket size={18} />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#fbf9f5] font-display">Generate Virtual Darshan E-Pass</h3>
                <p className="text-xs text-[#a89f91]">Complimentary reservation to bypass outer queue holding pens</p>
              </div>
            </div>

            <form onSubmit={handleBookPass} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Pilgrim / Devotee Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Anand Sharma"
                  className="input-pro"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Preferred Time Slot
                  </label>
                  <select
                    value={timeSlot}
                    onChange={e => setTimeSlot(e.target.value)}
                    className="input-pro cursor-pointer"
                  >
                    <option>06:00 AM - 08:00 AM (Early Darshan)</option>
                    <option>09:00 AM - 10:00 AM (Morning Slot)</option>
                    <option>10:00 AM - 11:00 AM</option>
                    <option>11:00 AM - 12:00 PM</option>
                    <option>04:00 PM - 05:00 PM (Afternoon)</option>
                    <option>06:00 PM - 07:00 PM (Sandhya Aarti)</option>
                    <option>08:00 PM - 09:30 PM (Night Special)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Preferred Entry Gate
                  </label>
                  <select
                    value={selectedGate}
                    onChange={e => setSelectedGate(e.target.value)}
                    className="input-pro cursor-pointer"
                  >
                    <option>Gate 3 - South Express (Fastest)</option>
                    <option>Gate 1 - North Arch</option>
                    <option>Gate 2 - East Courtyard</option>
                    <option>Gate 4 - West VIP & Elders Entry</option>
                  </select>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/[0.05] text-xs text-slate-400 flex items-center gap-2">
                <IconCheck size={16} className="text-emerald-400 shrink-0" />
                <span>Instant QR pass generation with barcode verification at entry turnstiles.</span>
              </div>

              <button
                type="submit"
                disabled={loading || sysState.emergencyActive}
                className="w-full btn-primary py-3 text-sm font-bold tracking-wide"
              >
                {loading ? (
                  <span>Generating Official Pass...</span>
                ) : (
                  <span className="flex items-center gap-2">
                    <IconTicket size={16} />
                    <span>Issue Verified Virtual E-Pass</span>
                  </span>
                )}
              </button>
            </form>
          </div>

          {/* Newly Generated Pass Confirmation Stub */}
          {bookedPass && (
            <div className="mt-6 p-4 rounded-xl bg-gradient-to-tr from-emerald-950/40 to-slate-900 border border-emerald-500/30">
              <div className="flex items-center justify-between pb-3 border-b border-emerald-500/20 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <IconCheck size={14} />
                  </div>
                  <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider font-mono">
                    Pass Confirmed & Issued
                  </span>
                </div>
                <span className="font-mono font-bold text-white text-sm">{bookedPass.passId}</span>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-left w-full sm:w-auto">
                  <p className="text-sm font-bold text-white">{bookedPass.pilgrimName}</p>
                  <p className="text-xs text-[#d6cebf]">{bookedPass.gate}</p>
                  <p className="text-xs text-amber-400 font-mono">{bookedPass.timeSlot}</p>
                </div>

                <button
                  onClick={() => handlePrintPass(bookedPass)}
                  className="btn-secondary py-2 px-4 text-xs font-semibold flex items-center gap-2 w-full sm:w-auto justify-center"
                >
                  <IconDownload size={14} />
                  <span>Download / Print E-Pass</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Issued Passes Wallet & Temple Facilities (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Active Passes Wallet */}
          <div className="card-pro p-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] mb-3">
              <div className="flex items-center gap-2">
                <IconTicket size={16} className="text-amber-400" />
                <h3 className="text-sm font-bold text-[#fbf9f5] font-display">My Issued Passes ({myPasses.length})</h3>
              </div>
              <span className="text-xs text-[#a89f91]">Digital Wallet</span>
            </div>

            {myPasses.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#a89f91] space-y-2">
                <p>No active passes booked yet.</p>
                <p className="text-[#d6cebf]">Generate your pass on the left to receive fast-track barcode clearance.</p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                {myPasses.map((p, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-[#141210] border border-white/[0.06] flex items-center justify-between hover:border-amber-500/30 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-amber-400">{p.passId}</span>
                        <span className="text-[10px] font-semibold text-emerald-400 px-1.5 py-0.2 rounded bg-emerald-500/10 border border-emerald-500/20">
                          VALID
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-[#fbf9f5] mt-1">{p.pilgrimName}</p>
                      <p className="text-[11px] text-[#a89f91] font-mono">{p.gate} • {p.timeSlot}</p>
                    </div>

                    <button
                      onClick={() => handlePrintPass(p)}
                      title="Print or save PDF"
                      className="p-2 rounded-lg bg-white/5 hover:bg-amber-500/20 text-[#d6cebf] hover:text-amber-300 transition-colors border border-white/5"
                    >
                      <IconDownload size={15} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Devotee Amenities Directory */}
          <div className="card-pro p-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] mb-3">
              <h3 className="text-sm font-bold text-white font-display">Devotee Amenities & Services</h3>
              <span className="badge-pill badge-emerald text-[10px]">ALL ACTIVE</span>
            </div>

            <div className="space-y-3">
              {[
                { title: 'Annadanam (Sacred Free Prasadam Meals)', status: 'Serving Continuously (07:00 – 22:00)', loc: 'Building B - North Courtyard' },
                { title: 'Shoe Deposit & Cloakrooms', status: 'Available • Token Free', loc: 'Adjacent to Gates 1, 2, 3' },
                { title: 'Medical Rapid Response & First Aid', status: 'Doctors On Duty 24/7', loc: 'East Medical Station (Near Gate 2)' },
                { title: 'Drinking Water & Wheelchair Assistance', status: 'Free Clean RO Stations', loc: 'Corridor Pillars 4, 9, 14' },
              ].map((item, i) => (
                <div key={i} className="p-2.5 rounded-lg bg-slate-900/40 border border-white/[0.04]">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">{item.title}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1 text-[11px]">
                    <span className="text-emerald-400 font-medium">{item.status}</span>
                    <span className="text-slate-400">{item.loc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Devotee Notification & Alert Preferences */}
      <NotificationPreferences />
    </div>
  )
}
