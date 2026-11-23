import { useState, useEffect, useRef } from 'react'
import PilgrimCanvas from '../components/PilgrimCanvas'
import {
  IconCamera,
  IconBrain,
  IconRoute,
  IconAlert,
  IconShield,
  IconUsers,
  IconSparkles,
  IconActivity,
  IconCheck,
  IconChevronRight,
  IconMap,
  IconTemple
} from '../components/Icons'

interface Props {
  onNavigate: (page: string) => void
}

function AnimatedCounter({ target, suffix = '', prefix = '' }: { target: number; suffix?: string; prefix?: string }) {
  const [val, setVal] = useState(target)
  const ref = useRef(target)

  useEffect(() => {
    const start = performance.now()
    const from = ref.current
    function step(now: number) {
      const p = Math.min((now - start) / 1000, 1)
      const e = 1 - Math.pow(1 - p, 3)
      const v = Math.round(from + (target - from) * e)
      setVal(v)
      if (p < 1) requestAnimationFrame(step)
      else ref.current = target
    }
    requestAnimationFrame(step)
  }, [target])

  return <span className="font-mono">{prefix}{val.toLocaleString()}{suffix}</span>
}

export default function Home({ onNavigate }: Props) {
  const [live, setLive] = useState({
    total: 12458,
    gates: [62, 88, 38, 52],
    aiAccuracy: 99.4,
    dwellTimeMins: 19,
    activeAnomalies: 0,
    forecastSurgePct: 14,
  })

  useEffect(() => {
    async function fetchOverview() {
      try {
        const res = await fetch('/api/overview')
        if (res.ok) {
          const json = await res.json()
          if (json.success && json.data) {
            setLive(prev => ({
              ...prev,
              total: json.data.totalPilgrims || prev.total,
              gates: json.data.gates ? json.data.gates.map((g: { pct: number }) => g.pct) : prev.gates
            }))
          }
        }
      } catch {
        setLive(prev => ({
          ...prev,
          total: prev.total + Math.round((Math.random() - 0.45) * 14),
          gates: prev.gates.map(g => Math.max(10, Math.min(98, g + Math.round((Math.random() - 0.48) * 3))))
        }))
      }
    }

    fetchOverview()
    const t = setInterval(fetchOverview, 2500)
    return () => clearInterval(t)
  }, [])

  function gateStatus(pct: number) {
    if (pct < 50) return { label: 'Optimal Flow', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', bar: 'bg-emerald-500' }
    if (pct < 75) return { label: 'Moderate', bg: 'bg-amber-500/10 text-amber-400 border-amber-500/20', bar: 'bg-amber-500' }
    if (pct < 90) return { label: 'High Density', bg: 'bg-orange-500/10 text-orange-400 border-orange-500/20', bar: 'bg-orange-500' }
    return { label: 'Surge Congestion', bg: 'bg-rose-500/10 text-rose-400 border-rose-500/20', bar: 'bg-rose-500' }
  }

  const gateNames = ['Gate 1 (North Arch)', 'Gate 2 (East Courtyard)', 'Gate 3 (South Express)', 'Gate 4 (West Sanctum)']

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="badge-pill badge-emerald">
              <span className="status-dot status-dot-emerald pulse-live" />
              SYSTEM OPERATIONAL
            </span>
            <span className="text-xs text-slate-400 font-mono">128/128 SENSORS ONLINE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
            Temple Command & Crowd Flow Intelligence
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl mt-1">
            Real-time vision analytics, automated sanctum gate diversion, and AI-predicted crowd surge mitigation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('emergency')}
            className="btn-danger text-xs py-2 px-3.5"
          >
            <IconAlert size={14} />
            <span>Evacuation Protocol</span>
          </button>
          <button
            onClick={() => onNavigate('routes')}
            className="btn-primary text-xs py-2 px-3.5"
          >
            <IconRoute size={14} />
            <span>Route Optimization</span>
          </button>
        </div>
      </div>

      {/* Top Executive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="card-pro p-5">
          <div className="flex items-center justify-between text-[#a89f91] mb-2">
            <span className="text-xs font-semibold tracking-wider uppercase text-[#d6cebf]">Total Devotees in Complex</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center">
              <IconUsers size={16} />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#fbf9f5] font-display tracking-tight">
            <AnimatedCounter target={live.total} />
          </div>
          <div className="flex items-center gap-2 mt-3 text-xs">
            <span className="text-emerald-400 font-semibold flex items-center gap-0.5">
              ↑ +4.2%
            </span>
            <span className="text-[#a89f91]">vs last hour average</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="card-pro p-5">
          <div className="flex items-center justify-between text-[#a89f91] mb-2">
            <span className="text-xs font-semibold tracking-wider uppercase text-[#d6cebf]">Sanctum Wait Time</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center">
              <IconTemple size={16} />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#fbf9f5] font-display tracking-tight">
            <span className="font-mono">{live.dwellTimeMins}</span> <span className="text-lg font-normal text-[#a89f91]">mins</span>
          </div>
          <div className="flex items-center gap-2 mt-3 text-xs">
            <span className="text-emerald-400 font-semibold">↓ -6 mins</span>
            <span className="text-[#a89f91]">due to East diversion</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="card-pro p-5">
          <div className="flex items-center justify-between text-[#a89f91] mb-2">
            <span className="text-xs font-semibold tracking-wider uppercase text-[#d6cebf]">AI Vision Accuracy</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <IconCamera size={16} />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#fbf9f5] font-display tracking-tight">
            <span className="font-mono">{live.aiAccuracy}</span><span className="text-lg font-normal text-[#a89f91]">%</span>
          </div>
          <div className="flex items-center gap-2 mt-3 text-xs">
            <span className="badge-pill bg-emerald-500/10 text-emerald-400 text-[10px] py-0 px-1.5 border border-emerald-500/20">
              YOLOv9 Neural Net
            </span>
            <span className="text-[#a89f91]">±2 error margin</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="card-pro p-5">
          <div className="flex items-center justify-between text-[#a89f91] mb-2">
            <span className="text-xs font-semibold tracking-wider uppercase text-[#d6cebf]">Surge Prediction (30m)</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <IconBrain size={16} />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#fbf9f5] font-display tracking-tight">
            <span className="text-amber-400 font-mono">+{live.forecastSurgePct}%</span>
          </div>
          <div className="flex items-center gap-2 mt-3 text-xs">
            <span className="text-[#d6cebf] font-medium">Risk Level:</span>
            <span className="text-emerald-400 font-semibold">Low (Controlled)</span>
          </div>
        </div>
      </div>

      {/* Main Section: Spatial Canvas & Live Gate Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Spatial Canvas (2 cols) */}
        <div className="lg:col-span-2 card-pro overflow-hidden flex flex-col">
          <div className="p-4 sm:px-6 sm:py-4 border-b border-white/[0.08] flex items-center justify-between flex-wrap gap-2 bg-[#181512]">
            <div className="flex items-center gap-2.5">
              <IconMap size={18} className="text-amber-400" />
              <div>
                <h3 className="text-sm font-bold text-[#fbf9f5] font-display">Live Spatial Pilgrim Density Radar</h3>
                <p className="text-[11px] text-[#a89f91]">Interactive 2D complex tracking & corridor velocity</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="badge-pill badge-amber text-[10px]">REAL-TIME VECTOR STREAM</span>
              <button
                onClick={() => onNavigate('livemap')}
                className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1 pl-2"
              >
                <span>Full Radar</span>
                <IconChevronRight size={13} />
              </button>
            </div>
          </div>

          <div className="relative bg-[#080d19] min-h-[380px] flex items-center justify-center p-2">
            <PilgrimCanvas />

            {/* Clean Floating Legend */}
            <div className="absolute bottom-4 left-4 p-2.5 rounded-xl bg-slate-900/90 border border-white/10 backdrop-blur-md text-[11px] flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                <span className="text-slate-300">Optimal (&lt;45%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                <span className="text-slate-300">Moderate</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-400"></span>
                <span className="text-slate-300">Heavy</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                <span className="text-slate-300">Congested</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Live Gate Congestion Status (1 col) */}
        <div className="card-pro p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] mb-4">
              <div>
                <h3 className="text-sm font-bold text-white font-display">Gate Flow Status</h3>
                <p className="text-[11px] text-slate-400">Live telemetry across 4 entry vectors</p>
              </div>
              <button
                onClick={() => onNavigate('routes')}
                className="text-xs text-amber-400 hover:text-amber-300 font-medium"
              >
                Manage
              </button>
            </div>

            <div className="space-y-4">
              {gateNames.map((name, i) => {
                const pct = live.gates[i] ?? 50
                const st = gateStatus(pct)
                return (
                  <div key={name} className="p-3 rounded-xl bg-slate-900/50 border border-white/[0.05] space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-200">{name}</span>
                      <span className="font-mono font-bold text-white">{pct}%</span>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ease-out ${st.bar}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${st.bg}`}>
                        {st.label}
                      </span>
                      <span className="text-slate-400 font-mono">
                        ~{Math.round(pct * 2.8)} dev/min
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Quick AI Action Card */}
          <div className="mt-5 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-xs">
            <div className="flex items-center gap-2 font-semibold text-amber-300 mb-1">
              <IconSparkles size={14} />
              <span>AI Flow Recommendation</span>
            </div>
            <p className="text-[#d6cebf] text-[11px] leading-relaxed mb-3">
              Gate 2 (East) approaching 88% capacity. Automated diversion to Gate 3 (South Express) can reduce queue time by 7.4 minutes.
            </p>
            <button
              onClick={() => onNavigate('routes')}
              className="btn-primary w-full py-1.5 px-3 text-[11px]"
            >
              Apply Staggered Diversion
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Exploration Grid */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-[#fbf9f5] font-display">Specialized Command Subsystems</h3>
          <span className="text-xs text-[#a89f91]">Direct clearance access</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              id: 'detection',
              title: 'CCTV Neural Vision',
              desc: 'Multi-camera person detection with bounding boxes and trajectory analysis.',
              icon: IconCamera,
              tag: '128 FEEDS',
              color: 'text-amber-400',
              bg: 'bg-amber-500/10 border-amber-500/20'
            },
            {
              id: 'prediction',
              title: 'Surge Prediction AI',
              desc: 'LSTM neural models forecasting crowd surges 15–30 minutes in advance.',
              icon: IconBrain,
              tag: 'LSTM MODEL',
              color: 'text-amber-300',
              bg: 'bg-amber-500/10 border-amber-500/20'
            },
            {
              id: 'routes',
              title: 'Smart Dynamic Routing',
              desc: 'Autonomous gate diversion controllers reducing corridor bottlenecking.',
              icon: IconRoute,
              tag: 'AUTOMATED',
              color: 'text-amber-400',
              bg: 'bg-amber-500/10 border-amber-500/20'
            },
            {
              id: 'emergency',
              title: 'Evacuation Command',
              desc: 'Automated high-speed evacuation sequencing with siren & gate overrides.',
              icon: IconAlert,
              tag: '&lt;90s RESPONSE',
              color: 'text-rose-400',
              bg: 'bg-rose-500/10 border-rose-500/20'
            },
            {
              id: 'incidents',
              title: 'Incident Dispatch Center',
              desc: 'Rapid security & medical team dispatch, situational audit logging.',
              icon: IconShield,
              tag: 'LIVE TICKETING',
              color: 'text-emerald-400',
              bg: 'bg-emerald-500/10 border-emerald-500/20'
            },
            {
              id: 'pilgrim',
              title: 'Devotee Public Portal',
              desc: 'Digital queue pass registration, VIP darshan passes, and live wait times.',
              icon: IconTemple,
              tag: 'CITIZEN FACING',
              color: 'text-amber-300',
              bg: 'bg-amber-500/10 border-amber-500/20'
            },
          ].map(mod => {
            const Icon = mod.icon
            return (
              <button
                key={mod.id}
                onClick={() => onNavigate(mod.id)}
                className="card-pro card-pro-hover p-4 text-left flex items-start justify-between group"
              >
                <div className="space-y-1.5 pr-2">
                  <div className="flex items-center gap-2">
                    <span className={`p-1.5 rounded-lg ${mod.bg}`}>
                      <Icon size={16} className={mod.color} />
                    </span>
                    <h4 className="text-sm font-bold text-[#fbf9f5] group-hover:text-amber-300 transition-colors font-display">
                      {mod.title}
                    </h4>
                  </div>
                  <p className="text-xs text-[#a89f91] leading-relaxed line-clamp-2">
                    {mod.desc}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-3 shrink-0">
                  <span
                    className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#25201b] text-[#d6cebf] border border-white/5 font-semibold"
                    dangerouslySetInnerHTML={{ __html: mod.tag }}
                  />
                  <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-[#a89f91] group-hover:text-[#1a1612] group-hover:bg-amber-500 transition-all">
                    <IconChevronRight size={14} />
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
