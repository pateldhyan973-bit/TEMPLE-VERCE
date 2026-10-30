import { useState, useEffect } from 'react'
import {
  IconVideo,
  IconClock,
  IconSparkles,
  IconCheck,
  IconTemple,
  IconUsers,
  IconBell,
  IconRadio
} from '../components/Icons'

interface AartiScheduleItem {
  id: string
  name: string
  time: string
  description: string
  status: 'COMPLETED' | 'LIVE' | 'UPCOMING'
  significance: string
}

const AARTI_SCHEDULE: AartiScheduleItem[] = [
  {
    id: '1',
    name: 'Suprabhata Seva',
    time: '05:00 AM - 05:45 AM',
    description: 'Sacred awakening hymns and Vedic chanting honoring the Divine Lord.',
    status: 'COMPLETED',
    significance: 'First auspicious blessing of the dawn'
  },
  {
    id: '2',
    name: 'Thomala & Archana Seva',
    time: '06:30 AM - 07:15 AM',
    description: 'Exquisite garland decoration with sacred Tulasi leaves and lotus petals.',
    status: 'COMPLETED',
    significance: 'Decoration with 108 fragrant holy garlands'
  },
  {
    id: '3',
    name: 'Madhyahnam Maha Nivedana',
    time: '12:30 PM - 01:15 PM',
    description: 'Noon sacred food offering and Sahasranama Archana.',
    status: 'COMPLETED',
    significance: 'Mahaprasad sanctification'
  },
  {
    id: '4',
    name: 'Sandhya Deeparadhana Aarti',
    time: '06:30 PM - 07:15 PM',
    description: 'Magnificent evening lamp worship with 1008 brass deepams and camphor flame.',
    status: 'LIVE',
    significance: 'Grand twilight illumination and conch resonance'
  },
  {
    id: '5',
    name: 'Ekantha Seva & Sayana Aarti',
    time: '10:00 PM - 10:30 PM',
    description: 'Night lullaby (Lali) sung to the golden swing of the Lord before sanctum rests.',
    status: 'UPCOMING',
    significance: 'Solemn bedtime devotional offering'
  }
]

export default function DevoteeLiveDarshan() {
  const [activeCam, setActiveCam] = useState<'garbhagriha' | 'dwajasthambam' | 'queue' | 'gopuram'>('garbhagriha')
  const [diyaCount, setDiyaCount] = useState(1428)
  const [bellRung, setBellRung] = useState(false)
  const [diyaLit, setDiyaLit] = useState(false)
  const [viewerCount, setViewerCount] = useState(3842)

  useEffect(() => {
    const t = setInterval(() => {
      setViewerCount(c => c + Math.floor(Math.random() * 7) - 3)
    }, 4000)
    return () => clearInterval(t)
  }, [])

  function handleRingBell() {
    setBellRung(true)
    setTimeout(() => setBellRung(false), 2000)
  }

  function handleLightDiya() {
    if (!diyaLit) {
      setDiyaLit(true)
      setDiyaCount(c => c + 1)
    }
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#11192e] via-[#0d162a] to-[#121c33] border border-amber-500/20 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="badge-pill bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 font-semibold">
                <IconTemple size={12} className="text-amber-400" />
                SACRED SANCTUM WEBCAST
              </span>
              <span className="badge-pill bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 font-semibold">
                <span className="status-dot status-dot-emerald pulse-live" />
                LIVE STREAM ACTIVE
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white font-display">
              Sanctum Live Darshan & Daily Aarti Webcast
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Experience the divine presence of the sacred Garbhagriha in high definition from anywhere in the world. Receive holy darshan and participate in daily rituals.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-3 rounded-xl bg-slate-900/80 border border-white/[0.08] text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 mb-0.5">
                <IconUsers size={13} className="text-amber-400" />
                <span>Devotees Watching</span>
              </div>
              <div className="text-lg font-bold font-mono text-white">
                {viewerCount.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Video & Interactive Offering Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Live Video Feed Player */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative rounded-2xl overflow-hidden bg-black border border-white/[0.1] shadow-2xl aspect-video flex flex-col justify-between">
            {/* Ambient Background Simulation */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-slate-950/80 to-transparent z-10 pointer-events-none" />

            {/* Authentic Sanctum Aarti Stream Video Feed */}
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
              <img
                src={activeCam === 'gopuram' ? '/assets/temple_gopuram.jpg' : activeCam === 'queue' ? '/assets/queue_complex.jpg' : '/assets/sanctum_aarti.jpg'}
                alt="Sanctum Darshan Live"
                className="w-full h-full object-cover object-center filter brightness-[0.8] contrast-105 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/40" />

              {/* Lower Overlay Banner Info */}
              <div className="absolute bottom-16 left-5 right-5 z-20 flex items-end justify-between pointer-events-none">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-widest bg-black/60 px-2 py-0.5 rounded border border-amber-500/30">
                    SANCTUM SANCTORUM (GARBHAGRIHA)
                  </span>
                  <h3 className="text-lg font-bold text-white font-display drop-shadow-md">
                    {activeCam === 'garbhagriha' && 'Maha Deeparadhana Harathi Ritual'}
                    {activeCam === 'dwajasthambam' && 'Golden Dwajasthambam & Flagstaff'}
                    {activeCam === 'queue' && 'Vaikuntham Devotee Holding Hall'}
                    {activeCam === 'gopuram' && 'Seven-Tiered Rajagopuram Spire'}
                  </h3>
                  <p className="text-xs text-amber-200/90 font-mono drop-shadow">
                    Vedic Recitation by Temple Archakas • Sacred Harathi Flame Active
                  </p>
                </div>
              </div>
            </div>

            {/* Top Overlay Bar */}
            <div className="relative z-20 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-rose-600/90 text-white font-mono text-[10px] font-bold tracking-wider flex items-center gap-1.5 shadow">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  LIVE HD 1080P
                </span>
                <span className="px-2 py-1 rounded-md bg-black/60 text-slate-300 font-mono text-[11px] backdrop-blur-sm border border-white/10">
                  AUDIO: Vedic Chant & Shloka Recitation
                </span>
              </div>
              <div className="px-2.5 py-1 rounded-md bg-black/60 text-amber-400 font-mono text-xs backdrop-blur-sm border border-white/10 flex items-center gap-1.5">
                <IconSparkles size={13} />
                <span>Sandhya Deepam</span>
              </div>
            </div>

            {/* Bottom Overlay Controls Bar */}
            <div className="relative z-20 p-4 flex flex-wrap items-center justify-between gap-3">
              {/* Camera Switcher Pills */}
              <div className="flex items-center gap-1.5 bg-black/70 p-1 rounded-xl backdrop-blur-md border border-white/10 text-xs">
                <button
                  onClick={() => setActiveCam('garbhagriha')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    activeCam === 'garbhagriha'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Sanctum Core
                </button>
                <button
                  onClick={() => setActiveCam('dwajasthambam')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    activeCam === 'dwajasthambam'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Dwajasthambam
                </button>
                <button
                  onClick={() => setActiveCam('queue')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    activeCam === 'queue'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Darshan Corridor
                </button>
                <button
                  onClick={() => setActiveCam('gopuram')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    activeCam === 'gopuram'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Rajagopuram
                </button>
              </div>

              {/* Status info */}
              <div className="text-[11px] font-mono text-slate-400">
                Lat: 22ms • Stream Server: India-South-01
              </div>
            </div>
          </div>

          {/* Interactive Prayer & Offerings Bar */}
          <div className="card-pro p-5 flex flex-col sm:flex-row items-center justify-between gap-4 border border-amber-500/20">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <IconSparkles size={16} className="text-amber-400" />
                Interactive Devotional Offerings
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Participate virtually in the divine Aarti rituals alongside thousands of devotees.
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* Ring Temple Bell Button */}
              <button
                onClick={handleRingBell}
                disabled={bellRung}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                  bellRung
                    ? 'bg-amber-500 text-slate-950 border-amber-400 scale-95 shadow-lg shadow-amber-500/30'
                    : 'bg-white/[0.05] hover:bg-white/[0.1] text-amber-300 border-amber-500/30'
                }`}
              >
                <IconBell size={16} className={bellRung ? 'animate-bounce text-slate-950' : 'text-amber-400'} />
                <span>{bellRung ? '🔔 Sacred Bell Chimes...' : 'Ring Temple Bell'}</span>
              </button>

              {/* Light Virtual Diya Button */}
              <button
                onClick={handleLightDiya}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                  diyaLit
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                    : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                }`}
              >
                <IconSparkles size={16} />
                <span>{diyaLit ? '🪔 Diya Lighted' : `Light Diya (${diyaCount})`}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Col: Today's Aarti Schedule & Sacred Panchangam */}
        <div className="space-y-6">
          {/* Daily Aarti Timeline */}
          <div className="card-pro p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <IconClock size={16} className="text-amber-400" />
                <h3 className="text-sm font-bold text-white font-display">Daily Aarti Timings</h3>
              </div>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                IST TIMEZONE
              </span>
            </div>

            <div className="space-y-3">
              {AARTI_SCHEDULE.map((item) => (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    item.status === 'LIVE'
                      ? 'bg-amber-500/10 border-amber-500/40 shadow-sm'
                      : item.status === 'COMPLETED'
                      ? 'bg-slate-900/30 border-white/[0.04] opacity-75'
                      : 'bg-slate-900/60 border-white/[0.06]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white font-display">{item.name}</span>
                    <span
                      className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                        item.status === 'LIVE'
                          ? 'bg-rose-500 text-white animate-pulse'
                          : item.status === 'COMPLETED'
                          ? 'bg-slate-800 text-slate-400'
                          : 'bg-amber-500/15 text-amber-300'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-amber-400/90 font-medium mb-1.5">
                    {item.time}
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Today's Sacred Panchangam Card */}
          <div className="card-pro p-5 space-y-3 bg-[#0d162a] border-amber-500/20">
            <div className="flex items-center gap-2 text-amber-400 font-display text-xs font-bold uppercase tracking-wider">
              <IconSparkles size={14} />
              <span>Today&apos;s Sacred Panchangam</span>
            </div>
            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div className="p-2.5 rounded-lg bg-black/20 border border-white/[0.05]">
                <div className="text-[10px] text-slate-400 font-mono">Tithi</div>
                <div className="font-semibold text-white mt-0.5">Shukla Paksha Dashami</div>
              </div>
              <div className="p-2.5 rounded-lg bg-black/20 border border-white/[0.05]">
                <div className="text-[10px] text-slate-400 font-mono">Nakshatram</div>
                <div className="font-semibold text-white mt-0.5">Uttara Ashadha</div>
              </div>
              <div className="p-2.5 rounded-lg bg-black/20 border border-white/[0.05]">
                <div className="text-[10px] text-slate-400 font-mono">Yogam</div>
                <div className="font-semibold text-white mt-0.5">Shubha Yogam</div>
              </div>
              <div className="p-2.5 rounded-lg bg-black/20 border border-white/[0.05]">
                <div className="text-[10px] text-slate-400 font-mono">Rahukalam</div>
                <div className="font-semibold text-amber-400 mt-0.5">01:30 PM - 03:00 PM</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
