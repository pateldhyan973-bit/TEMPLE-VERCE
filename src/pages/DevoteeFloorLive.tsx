import { useState, useEffect } from 'react'
import {
  IconBuilding,
  IconClock,
  IconCheck,
  IconSparkles,
  IconUsers,
  IconTemple,
  IconSearch,
  IconAlert,
  IconRoute
} from '../components/Icons'

interface Compartment {
  id: string
  number: number
  floor: 1 | 2 | 3
  status: 'RELEASING' | 'NEXT' | 'WAITING' | 'CLEANING'
  pilgrimsInside: number
  capacity: number
  estReleaseTime: string
  amenitiesServed: string
}

const INITIAL_COMPARTMENTS: Compartment[] = [
  // Floor 1
  { id: 'c11', number: 11, floor: 1, status: 'RELEASING', pilgrimsInside: 420, capacity: 450, estReleaseTime: 'Releasing Now', amenitiesServed: 'Hot Annaprasadam & Milk' },
  { id: 'c12', number: 12, floor: 1, status: 'NEXT', pilgrimsInside: 440, capacity: 450, estReleaseTime: 'Est. in 12 mins', amenitiesServed: 'Tea & Infant Care' },
  { id: 'c13', number: 13, floor: 1, status: 'WAITING', pilgrimsInside: 435, capacity: 450, estReleaseTime: 'Est. in 28 mins', amenitiesServed: 'Chilled RO Water' },
  { id: 'c14', number: 14, floor: 1, status: 'WAITING', pilgrimsInside: 410, capacity: 450, estReleaseTime: 'Est. in 44 mins', amenitiesServed: 'Fresh Pongal Distributed' },
  { id: 'c15', number: 15, floor: 1, status: 'WAITING', pilgrimsInside: 450, capacity: 450, estReleaseTime: 'Est. in 58 mins', amenitiesServed: 'Coffee & Snacks' },
  { id: 'c16', number: 16, floor: 1, status: 'CLEANING', pilgrimsInside: 0, capacity: 450, estReleaseTime: 'Next Batch 11:30 AM', amenitiesServed: 'Sanitization in progress' },

  // Floor 2
  { id: 'c21', number: 21, floor: 2, status: 'WAITING', pilgrimsInside: 445, capacity: 450, estReleaseTime: 'Est. in 75 mins', amenitiesServed: 'Devotional SVBC TV Active' },
  { id: 'c22', number: 22, floor: 2, status: 'WAITING', pilgrimsInside: 430, capacity: 450, estReleaseTime: 'Est. in 90 mins', amenitiesServed: 'Hot Milk for Children' },
  { id: 'c23', number: 23, floor: 2, status: 'WAITING', pilgrimsInside: 415, capacity: 450, estReleaseTime: 'Est. in 105 mins', amenitiesServed: 'RO Water' },
  { id: 'c24', number: 24, floor: 2, status: 'WAITING', pilgrimsInside: 450, capacity: 450, estReleaseTime: 'Est. in 120 mins', amenitiesServed: 'Medical Team on Floor' },
  { id: 'c25', number: 25, floor: 2, status: 'WAITING', pilgrimsInside: 390, capacity: 450, estReleaseTime: 'Est. in 135 mins', amenitiesServed: 'Tea & Biscuits' },
  { id: 'c26', number: 26, floor: 2, status: 'CLEANING', pilgrimsInside: 0, capacity: 450, estReleaseTime: 'Cleaning & Wash down', amenitiesServed: 'Floor mopping' },

  // Floor 3
  { id: 'c31', number: 31, floor: 3, status: 'WAITING', pilgrimsInside: 450, capacity: 450, estReleaseTime: 'Est. in 150 mins', amenitiesServed: 'Holding general crowd' },
  { id: 'c32', number: 32, floor: 3, status: 'WAITING', pilgrimsInside: 440, capacity: 450, estReleaseTime: 'Est. in 165 mins', amenitiesServed: 'SVBC Telecast' },
  { id: 'c33', number: 33, floor: 3, status: 'WAITING', pilgrimsInside: 420, capacity: 450, estReleaseTime: 'Est. in 180 mins', amenitiesServed: 'Water Station Active' },
  { id: 'c34', number: 34, floor: 3, status: 'CLEANING', pilgrimsInside: 0, capacity: 450, estReleaseTime: 'Cleaning', amenitiesServed: 'Ready for Next Inflow' },
]

export default function DevoteeFloorLive() {
  const [activeFloor, setActiveFloor] = useState<1 | 2 | 3>(1)
  const [searchComp, setSearchComp] = useState('')
  const [searchedResult, setSearchedResult] = useState<Compartment | null>(null)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setTick(s => s + 1), 5000)
    return () => clearInterval(t)
  }, [])

  const floorCompartments = INITIAL_COMPARTMENTS.filter(c => c.floor === activeFloor)

  function handleSearchCompartment(e: React.FormEvent) {
    e.preventDefault()
    const num = parseInt(searchComp.replace(/[^0-9]/g, ''))
    if (!num) return
    const found = INITIAL_COMPARTMENTS.find(c => c.number === num)
    if (found) {
      setSearchedResult(found)
      setActiveFloor(found.floor)
    } else {
      alert(`Compartment C-${num} not found. Please enter a compartment between 11 and 34.`)
    }
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Real Queue Complex Architectural Photo Hero */}
      <div className="relative rounded-3xl overflow-hidden border border-white/[0.1] shadow-2xl min-h-[340px] flex flex-col justify-end p-6 sm:p-10">
        <img
          src="/assets/queue_complex.jpg"
          alt="Pilgrim Queue Complex Holding Hall"
          className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.45] contrast-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#090e1a] via-[#090e1a]/70 to-transparent" />

        <div className="relative z-10 space-y-3 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="badge-pill bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono text-xs flex items-center gap-1.5 font-bold backdrop-blur-md">
              <IconBuilding size={14} className="text-amber-400" />
              VAIKUNTHAM QUEUE COMPLEX 1 & 2
            </span>
            <span className="badge-pill bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono text-xs flex items-center gap-1.5 font-bold backdrop-blur-md">
              <span className="status-dot status-dot-emerald pulse-live" />
              LIVE FLOOR DISPATCH ACTIVE
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold text-white font-display leading-tight">
            Floor & Compartment Live Queue Tracker
          </h1>

          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-2xl">
            Inside the modern Vaikuntham Holding Halls, pilgrims wait seated comfortably in numbered compartments. Track exactly when your floor and compartment gate opens into the Sanctum corridor.
          </p>
        </div>
      </div>

      {/* Live Floor Dispatch Pulse Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Current Release */}
        <div className="card-pro p-5 bg-gradient-to-br from-emerald-950/40 to-slate-900/60 border border-emerald-500/30 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shrink-0 animate-pulse">
            <IconCheck size={24} />
          </div>
          <div>
            <div className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-bold">
              CURRENTLY RELEASING TO SANCTUM
            </div>
            <div className="text-xl font-bold text-white font-display">
              Floor 1 • Compartment 11
            </div>
            <div className="text-xs text-slate-300 font-mono">
              Walking to Golden Sanctum Ramp
            </div>
          </div>
        </div>

        {/* Next in Line */}
        <div className="card-pro p-5 bg-gradient-to-br from-amber-950/30 to-slate-900/60 border border-amber-500/30 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center shrink-0">
            <IconClock size={24} />
          </div>
          <div>
            <div className="text-[10px] font-mono text-amber-400 uppercase tracking-widest font-bold">
              NEXT COMPARTMENT IN LINE
            </div>
            <div className="text-xl font-bold text-white font-display">
              Floor 1 • Compartment 12
            </div>
            <div className="text-xs text-slate-300 font-mono">
              Turnstiles Open in ~12 mins
            </div>
          </div>
        </div>

        {/* Free Refreshments Status */}
        <div className="card-pro p-5 bg-gradient-to-br from-amber-950/30 to-[#181512] border border-amber-500/30 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center shrink-0">
            <IconSparkles size={24} />
          </div>
          <div>
            <div className="text-[10px] font-mono text-amber-400 uppercase tracking-widest font-bold">
              COMPLIMENTARY FOOD & MILK
            </div>
            <div className="text-base font-bold text-white font-display">
              Free Annaprasadam Active
            </div>
            <div className="text-xs text-slate-300 font-mono">
              Hot Milk & Coffee at All Floor Gates
            </div>
          </div>
        </div>
      </div>

      {/* Compartment Search Checker */}
      <div className="card-pro p-6 border border-white/[0.08]">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-white font-display flex items-center gap-2">
              <IconSearch size={16} className="text-amber-400" />
              Check Your Seated Compartment Status
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Enter your Compartment Number printed on your queue slip or room gate.
            </p>
          </div>

          <form onSubmit={handleSearchCompartment} className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              placeholder="e.g. C-15 or 15"
              value={searchComp}
              onChange={e => setSearchComp(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-400 w-full sm:w-48"
            />
            <button
              type="submit"
              className="btn-primary py-2.5 px-4 text-xs font-semibold shrink-0"
            >
              Track Compartment
            </button>
          </form>
        </div>

        {searchedResult && (
          <div className="mt-5 p-4 rounded-xl bg-slate-900/90 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in text-xs font-mono">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 font-bold text-sm flex items-center justify-center">
                C-{searchedResult.number}
              </span>
              <div>
                <div className="text-white font-bold text-sm font-display">
                  Floor {searchedResult.floor} • Compartment {searchedResult.number}
                </div>
                <div className="text-slate-400 text-xs">
                  Pilgrims Seated: {searchedResult.pilgrimsInside} / {searchedResult.capacity}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div>
                <span className="text-slate-400 text-[10px] block">ESTIMATED GATE OPEN</span>
                <span className="text-emerald-400 font-bold text-sm">{searchedResult.estReleaseTime}</span>
              </div>
              <span className="px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase">
                {searchedResult.status}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Floor Tab Selector */}
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
        <div className="flex items-center gap-2">
          {[
            { floor: 1, label: 'Floor 1 (Compartments 11–16)' },
            { floor: 2, label: 'Floor 2 (Compartments 21–26)' },
            { floor: 3, label: 'Floor 3 (Compartments 31–34)' }
          ].map(f => (
            <button
              key={f.floor}
              onClick={() => setActiveFloor(f.floor as any)}
              className={`px-4 py-2.5 rounded-xl font-medium text-xs transition-all ${
                activeFloor === f.floor
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white border border-white/[0.06]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="hidden sm:flex items-center gap-3 text-xs font-mono text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Releasing
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Next
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" /> Seated Waiting
          </span>
        </div>
      </div>

      {/* Compartment Cards Grid for Active Floor */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {floorCompartments.map(comp => {
          const isReleasing = comp.status === 'RELEASING'
          const isNext = comp.status === 'NEXT'
          const isWaiting = comp.status === 'WAITING'

          const borderCol = isReleasing ? 'border-emerald-500/40 bg-emerald-950/20' : isNext ? 'border-amber-500/40 bg-amber-950/20' : 'border-white/[0.08] bg-slate-900/60'
          const badgeCol = isReleasing ? 'bg-emerald-500 text-slate-950 font-bold animate-pulse' : isNext ? 'bg-amber-500 text-slate-950 font-bold' : isWaiting ? 'bg-amber-500/15 text-amber-300' : 'bg-slate-800 text-slate-400'

          return (
            <div
              key={comp.id}
              className={`card-pro p-5 border flex flex-col justify-between space-y-4 transition-all hover:translate-y-[-2px] ${borderCol}`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-black/40 border border-white/10 font-bold text-sm text-white flex items-center justify-center font-mono">
                      C{comp.number}
                    </span>
                    <span className="text-xs font-mono text-slate-400">Floor {comp.floor}</span>
                  </div>

                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase ${badgeCol}`}>
                    {comp.status}
                  </span>
                </div>

                <div>
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Release Countdown</div>
                  <div className={`text-base font-bold font-mono mt-0.5 ${isReleasing ? 'text-emerald-400' : isNext ? 'text-amber-400' : 'text-white'}`}>
                    {comp.estReleaseTime}
                  </div>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-white/[0.06] text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-400 font-mono text-[11px]">Devotees Seated:</span>
                    <span className="font-mono font-bold">{comp.pilgrimsInside} / {comp.capacity}</span>
                  </div>
                  {/* Capacity Bar */}
                  <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden">
                    <div
                      style={{ width: `${(comp.pilgrimsInside / comp.capacity) * 100}%` }}
                      className={`h-full rounded-full ${isReleasing ? 'bg-emerald-400' : 'bg-amber-400'}`}
                    />
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-black/30 border border-white/[0.04] text-[11px] text-slate-300 flex items-center gap-2">
                  <IconSparkles size={13} className="text-amber-400 shrink-0" />
                  <span>{comp.amenitiesServed}</span>
                </div>
              </div>

              {isReleasing && (
                <div className="p-2.5 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold text-center animate-pulse">
                  Proceed through corridor gate now
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Floor Comfort Amenities Guide */}
      <div className="card-pro p-6 bg-[#0c1322] border-white/[0.08] space-y-4">
        <h3 className="text-sm font-bold text-white font-display flex items-center gap-2">
          <IconSparkles size={16} className="text-amber-400" />
          Vaikuntham Complex Devotee Care Standards
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/[0.05] space-y-1">
            <span className="text-amber-400 font-bold block">Free Infant Milk</span>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              Warm boiled cow milk provided to parents with babies at all compartment gate intervals.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/[0.05] space-y-1">
            <span className="text-emerald-400 font-bold block">Nitya Annaprasadam</span>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              Freshly prepared hot Pongal, Upma, and Sambar rice distributed by temple Sevaks every 45 minutes.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/[0.05] space-y-1">
            <span className="text-amber-400 font-bold block">SVBC Devotional Telecast</span>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              High-definition screens in each compartment play sacred Harikatha, Pravachanam, and live Aarti hymns.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/[0.05] space-y-1">
            <span className="text-rose-400 font-bold block">First Aid & Doctors</span>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              Duty medical officers with oxygen supplies and cardiac first-aid patrol each floor continuously.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
