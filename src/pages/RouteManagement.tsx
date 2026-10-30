import { useState, useEffect } from 'react'
import {
  IconRoute,
  IconCheck,
  IconAlert,
  IconSparkles,
  IconActivity,
  IconChevronRight
} from '../components/Icons'

const GATES = [
  { id: 'g1', label: 'Gate 1 (West Arch)', x: 70, y: 240, normal: 'west', color: '#f59e0b' },
  { id: 'g2', label: 'Gate 2 (East Courtyard)', x: 750, y: 240, normal: 'east', color: '#fbbf24' },
  { id: 'g3', label: 'Gate 3 (South Express)', x: 410, y: 460, normal: 'south', color: '#34d399' },
  { id: 'g4', label: 'Gate 4 (North Sanctum)', x: 410, y: 50, normal: 'north', color: '#c084fc' },
]

const ROUTES = {
  west: [{ x: 70, y: 240 }, { x: 210, y: 240 }, { x: 310, y: 240 }, { x: 380, y: 250 }],
  east: [{ x: 750, y: 240 }, { x: 610, y: 240 }, { x: 510, y: 240 }, { x: 440, y: 250 }],
  east_div: [{ x: 750, y: 240 }, { x: 750, y: 120 }, { x: 610, y: 65 }, { x: 440, y: 65 }, { x: 440, y: 140 }],
  south: [{ x: 410, y: 460 }, { x: 410, y: 370 }, { x: 410, y: 310 }, { x: 410, y: 260 }],
  north: [{ x: 410, y: 50 }, { x: 410, y: 130 }, { x: 410, y: 190 }, { x: 410, y: 240 }],
}

function polylinePoints(pts: { x: number; y: number }[]) {
  return pts.map(p => `${p.x},${p.y}`).join(' ')
}

export default function RouteManagement() {
  const [mode, setMode] = useState<'normal' | 'congested' | 'emergency'>('normal')
  const [tick, setTick] = useState(0)
  const [flowPcts, setFlowPcts] = useState({ g1: 58, g2: 62, g3: 44, g4: 30 })
  const [log, setLog] = useState<string[]>([
    'System operational. All 4 sanctum corridors nominal.',
    'Automated flow balancer monitoring Gate 2 threshold.'
  ])

  useEffect(() => {
    const t = setInterval(() => setTick(i => i + 1), 80)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    async function fetchRoutes() {
      try {
        const res = await fetch('/api/routes/gates')
        if (res.ok) {
          const json = await res.json()
          if (json.success && json.data?.gates) {
            const gatesArr: any[] = json.data.gates
            const g1 = gatesArr.find(g => g.id === 'G1')?.pct ?? 58
            const g2 = gatesArr.find(g => g.id === 'G2')?.pct ?? 62
            const g3 = gatesArr.find(g => g.id === 'G3')?.pct ?? 44
            const g4 = gatesArr.find(g => g.id === 'G4')?.pct ?? 30
            setFlowPcts({ g1, g2, g3, g4 })
          }
        }
      } catch {
        setFlowPcts(prev => ({
          g1: Math.max(10, Math.min(95, prev.g1 + (Math.random() - 0.45) * 3)),
          g2: mode === 'congested' ? Math.min(98, prev.g2 + 1.2) : Math.max(10, Math.min(95, prev.g2 + (Math.random() - 0.4) * 3)),
          g3: Math.max(10, Math.min(95, prev.g3 + (Math.random() - 0.5) * 2)),
          g4: mode === 'emergency' ? 8 : Math.max(10, Math.min(95, prev.g4 + (Math.random() - 0.5) * 2)),
        }))
      }
    }

    fetchRoutes()
    const t = setInterval(fetchRoutes, 2500)
    return () => clearInterval(t)
  }, [mode])

  function triggerMode(newMode: typeof mode) {
    setMode(newMode)
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    const msgs = {
      congested: `[${timeStr}] ALERT: Gate 2 East approaching saturation. Autonomous diversion activated via North Bypass.`,
      emergency: `[${timeStr}] CRISIS PROTOCOL ALPHA: All incoming gates locked. Immediate outbound evacuation corridors active.`,
      normal:    `[${timeStr}] STABILIZED: Flow returned to equilibrium. Standard bidirectional routing resumed.`,
    }
    setLog(prev => [msgs[newMode], ...prev.slice(0, 7)])
  }

  const dashOffset = -(tick * 0.5) % 16

  const routeForGate = (gid: string) => {
    if (mode === 'emergency') return gid === 'g2' ? 'east_div' : (ROUTES as any)[GATES.find(g => g.id === gid)!.normal]
    if (mode === 'congested' && gid === 'g2') return ROUTES.east_div
    return (ROUTES as any)[GATES.find(g => g.id === gid)!.normal]
  }

  const routeColor = (gid: string) => {
    if (mode === 'emergency') return '#f43f5e'
    if (mode === 'congested' && gid === 'g2') return '#10b981'
    const pct = (flowPcts as any)[gid]
    if (pct > 80) return '#f43f5e'
    if (pct > 60) return '#f59e0b'
    return '#22c55e'
  }

  const RECOMMENDATIONS = {
    normal: [
      { action: 'MONITOR FLOW', detail: 'Corridors operating smoothly within optimal capacity (avg 48%).', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
      { action: 'FLOW REBALANCE', detail: 'Gate 3 velocity can absorb additional +18% before bottlenecking.', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
    ],
    congested: [
      { action: 'AUTO-DIVERT ACTIVE', detail: 'East Gate diverted to North Corridor bypass — reducing dwell time by 6.4m.', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
      { action: 'DEPLOY STEWARDS', detail: 'Dispatch 2 security stewards to East junction to pace arrivals.', color: 'text-orange-400 bg-orange-500/10 border-orange-500/20' },
    ],
    emergency: [
      { action: 'LOCKDOWN ENTRY', detail: 'All incoming gates sealed. Priority given to emergency exit doors.', color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
      { action: 'BROADCAST EVACUATION', detail: 'Dynamic wayfinding screens showing nearest exit path.', color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
    ],
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="badge-pill badge-amber">
              <IconRoute size={13} />
              DYNAMIC FLOW ROUTING
            </span>
            <span className="text-xs text-[#a89f91] font-mono">AUTONOMOUS GATE CONTROL</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#fbf9f5] tracking-tight font-display">
            Corridor Flow Routing & Gate Actuation
          </h1>
          <p className="text-sm text-[#a89f91] max-w-2xl mt-1">
            Simulate and trigger automated crowd diversions to eliminate bottlenecking at sanctum entries.
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center bg-[#181512] p-1 rounded-xl border border-white/10 text-xs">
          <button
            onClick={() => triggerMode('normal')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              mode === 'normal'
                ? 'bg-emerald-500 text-[#1a1612] shadow font-bold'
                : 'text-[#a89f91] hover:text-[#fbf9f5]'
            }`}
          >
            Normal Flow
          </button>
          <button
            onClick={() => triggerMode('congested')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              mode === 'congested'
                ? 'bg-amber-500 text-[#1a1612] shadow font-bold'
                : 'text-[#a89f91] hover:text-[#fbf9f5]'
            }`}
          >
            Simulate Surge
          </button>
          <button
            onClick={() => triggerMode('emergency')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              mode === 'emergency'
                ? 'bg-rose-500 text-white shadow font-bold'
                : 'text-[#a89f91] hover:text-[#fbf9f5]'
            }`}
          >
            Emergency Mode
          </button>
        </div>
      </div>

      {/* Main Vector Diagram & Right Status Rail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SVG Route Diagram (8 cols) */}
        <div className="lg:col-span-8 card-pro overflow-hidden flex flex-col justify-between">
          <div className="p-4 bg-[#181512] border-b border-white/[0.08] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="badge-pill badge-amber text-[10px]">CORRIDOR MAP</span>
              <span className="text-xs font-semibold text-[#fbf9f5] font-display">Active Flow Vectors</span>
            </div>
            <span className="text-xs text-[#a89f91] font-mono">
              Status: <strong className="text-white uppercase">{mode}</strong>
            </span>
          </div>

          <div className="relative bg-[#070c17] flex items-center justify-center p-2">
            <svg viewBox="0 0 840 520" className="w-full h-auto max-h-[460px] block">
              <rect width="840" height="520" fill="#070c17" />

              {/* Architectural Grid */}
              {Array.from({ length: 21 }, (_, i) => (
                <line key={`x${i}`} x1={i * 40} y1={0} x2={i * 40} y2={520} stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              ))}
              {Array.from({ length: 13 }, (_, i) => (
                <line key={`y${i}`} x1={0} y1={i * 40} x2={840} y2={i * 40} stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              ))}

              {/* Temple Perimeter */}
              <rect x="120" y="80" width="600" height="360" rx="16" fill="rgba(24, 21, 18, 0.7)" stroke="rgba(245, 158, 11, 0.15)" strokeWidth="1.5" />
              <rect x="210" y="140" width="420" height="240" rx="12" fill="rgba(36, 32, 28, 0.5)" stroke="rgba(245, 158, 11, 0.1)" strokeWidth="1" />

              {/* Inner Sanctum */}
              <rect x="330" y="190" width="180" height="120" rx="10" fill="#181512" stroke="#f59e0b" strokeWidth="2" />
              <text x="420" y="246" textAnchor="middle" fill="#fbf9f5" fontSize="13" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="800">
                TEMPLE SANCTUM
              </text>
              <text x="420" y="266" textAnchor="middle" fill="#fbbf24" fontSize="10" fontFamily="JetBrains Mono" fontWeight="600">
                HOLY SHRINE
              </text>

              {/* Flow Polylines */}
              {GATES.map(g => {
                const routePts = routeForGate(g.id)
                const col = routeColor(g.id)
                return (
                  <g key={g.id}>
                    <polyline
                      points={polylinePoints(routePts)}
                      fill="none"
                      stroke={col}
                      strokeWidth="3.5"
                      strokeDasharray="8 6"
                      strokeDashoffset={dashOffset}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                )
              })}

              {/* Gate Hub Nodes */}
              {GATES.map(g => {
                const pct = (flowPcts as any)[g.id]
                const col = routeColor(g.id)
                return (
                  <g key={g.id}>
                    <circle cx={g.x} cy={g.y} r={22} fill="#181512" stroke={col} strokeWidth="2" />
                    <circle cx={g.x} cy={g.y} r={8} fill={col} />
                    <text x={g.x} y={g.y + 36} textAnchor="middle" fill="#fbf9f5" fontSize="11" fontFamily="Plus Jakarta Sans" fontWeight="700">
                      {g.label.split(' (')[0]}
                    </text>
                    <text x={g.x} y={g.y - 28} textAnchor="middle" fill={col} fontSize="11" fontFamily="JetBrains Mono" fontWeight="700">
                      {pct}%
                    </text>
                  </g>
                )
              })}
            </svg>
          </div>
        </div>

        {/* Right Status & Intelligence Rail (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Gate Telemetry Status */}
          <div className="card-pro p-5">
            <h3 className="text-sm font-bold text-[#fbf9f5] font-display mb-3 pb-2 border-b border-white/[0.08]">
              Corridor Gate Saturation
            </h3>
            <div className="space-y-3">
              {GATES.map(g => {
                const pct = (flowPcts as any)[g.id]
                const isDiverted = mode === 'congested' && g.id === 'g2'
                const status = mode === 'emergency' ? 'EVAC EXIT' : isDiverted ? 'DIVERTED' : pct > 80 ? 'CRITICAL' : 'OPTIMAL'
                return (
                  <div key={g.id} className="p-3 rounded-xl bg-[#141210] border border-white/[0.05]">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-semibold text-[#fbf9f5]">{g.label}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        status === 'DIVERTED'
                          ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                          : pct > 80
                          ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                          : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {status}
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[#25201b] overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          pct > 80 ? 'bg-rose-500' : pct > 60 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* AI Recommended Directives */}
          <div className="card-pro p-5">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/[0.08]">
              <IconSparkles size={16} className="text-amber-400" />
              <h3 className="text-sm font-bold text-[#fbf9f5] font-display">AI Directives</h3>
            </div>
            <div className="space-y-2.5">
              {RECOMMENDATIONS[mode].map((rec, i) => (
                <div key={i} className={`p-3 rounded-xl border text-xs ${rec.color}`}>
                  <p className="font-bold uppercase tracking-wider text-[10px] mb-0.5">{rec.action}</p>
                  <p className="text-[#d6cebf] leading-relaxed text-[11px]">{rec.detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Live Action Log */}
          <div className="card-pro p-4">
            <h4 className="text-xs font-mono font-bold text-[#a89f91] tracking-wider mb-2 uppercase">
              Operational Action Log
            </h4>
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1 text-[11px] font-mono text-[#a89f91]">
              {log.map((entry, idx) => (
                <p key={idx} className={idx === 0 ? 'text-amber-300 font-semibold' : 'text-[#d6cebf]'}>
                  {entry}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
