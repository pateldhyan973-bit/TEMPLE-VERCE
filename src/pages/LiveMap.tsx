import { useState, useEffect } from 'react'
import {
  IconMap,
  IconCheck,
  IconAlert,
  IconSparkles,
  IconChevronRight
} from '../components/Icons'

const AREAS = [
  { id: 'temple',    x: 340, y: 185, w: 220, h: 140, label: 'Main Temple Sanctum', color: '#f59e0b', fixed: true  },
  { id: 'court_n',   x: 210, y: 125, w: 480, h: 70,  label: 'North Courtyard',     color: '#34d399', fixed: false },
  { id: 'court_s',   x: 210, y: 315, w: 480, h: 70,  label: 'South Courtyard',     color: '#34d399', fixed: false },
  { id: 'court_e',   x: 550, y: 185, w: 140, h: 140, label: 'East Courtyard',      color: '#fbbf24', fixed: false },
  { id: 'court_w',   x: 210, y: 185, w: 140, h: 140, label: 'West Courtyard',      color: '#fbbf24', fixed: false },
  { id: 'park_w',    x: 30,  y: 100, w: 140, h: 200, label: 'West Transit Hub',    color: '#94a3b8', fixed: false },
  { id: 'park_e',    x: 730, y: 100, w: 140, h: 200, label: 'East Transit Hub',    color: '#94a3b8', fixed: false },
  { id: 'food',      x: 30,  y: 340, w: 100, h: 80,  label: 'Annadanam Hall',      color: '#c084fc', fixed: false },
  { id: 'medical',   x: 770, y: 340, w: 100, h: 80,  label: 'Medical Post East',   color: '#fb923c', fixed: false },
  { id: 'wait_n',    x: 340, y: 30,  w: 220, h: 65,  label: 'North Waiting Bay',   color: '#10b981', fixed: false },
  { id: 'wait_s',    x: 340, y: 455, w: 220, h: 65,  label: 'South Waiting Bay',   color: '#fbbf24', fixed: false },
]

const GATES = [
  { id: 'g1', x: 174, y: 255, label: 'Gate 1 (West)' },
  { id: 'g2', x: 730, y: 255, label: 'Gate 2 (East)' },
  { id: 'g3', x: 450, y: 455, label: 'Gate 3 (South)' },
  { id: 'g4', x: 450, y: 125, label: 'Gate 4 (North)' },
]

const INIT_DENSITIES: Record<string, number> = {
  court_n: 0.55, court_s: 0.38, court_e: 0.82, court_w: 0.44,
  wait_n: 0.3, wait_s: 0.65, food: 0.42, medical: 0.15,
}

function densityToColor(d: number) {
  if (d === undefined || d < 0.35) return '#10b981'
  if (d < 0.6) return '#f59e0b'
  if (d < 0.82) return '#f97316'
  return '#f43f5e'
}

function densityLabel(d: number) {
  if (d === undefined || d < 0.35) return 'OPTIMAL'
  if (d < 0.6) return 'MODERATE'
  if (d < 0.82) return 'HIGH'
  return 'SURGE'
}

export default function LiveMap() {
  const [densities, setDensities] = useState(INIT_DENSITIES)
  const [selected, setSelected] = useState<string | null>('court_e')
  const [layer, setLayer] = useState<'density' | 'flow' | 'facilities'>('density')
  const [tick, setTick] = useState(0)

  useEffect(() => {
    async function fetchCrowdZones() {
      try {
        const res = await fetch('/api/crowd/zones')
        if (res.ok) {
          const json = await res.json()
          if (json.success && json.data?.zones) {
            const zonesMap: Record<string, number> = { ...INIT_DENSITIES }
            json.data.zones.forEach((z: { id: string; density: number }) => {
              const dFrac = parseFloat((z.density / 100).toFixed(2))
              if (z.id === 'Z1') zonesMap['court_e'] = dFrac
              if (z.id === 'Z2') zonesMap['court_n'] = dFrac
              if (z.id === 'Z3') zonesMap['court_s'] = dFrac
              if (z.id === 'Z4') zonesMap['food'] = dFrac
              if (z.id === 'Z5') zonesMap['park_w'] = dFrac
            })
            setDensities(zonesMap)
          }
        }
      } catch {
        setDensities(prev => {
          const next = { ...prev }
          for (const k of Object.keys(next)) {
            next[k] = Math.max(0.08, Math.min(0.96, next[k] + (Math.random() - 0.48) * 0.03))
          }
          return next
        })
      }
      setTick(t => t + 1)
    }

    fetchCrowdZones()
    const t = setInterval(fetchCrowdZones, 2500)
    return () => clearInterval(t)
  }, [])

  const selectedArea = AREAS.find(a => a.id === selected)
  const selectedDensity = selected ? (densities[selected] ?? 0.35) : null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="badge-pill badge-amber">
              <IconMap size={13} />
              SPATIAL CROWD RADAR
            </span>
            <span className="text-xs text-slate-400 font-mono">10×10 H3 GEO-GRID</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
            Interactive Temple Complex Radar
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl mt-1">
            Real-time thermal density maps, corridor velocity vectors, and facility occupancy tracking. Click any zone to inspect live statistics.
          </p>
        </div>

        {/* Layer Toggle */}
        <div className="flex items-center bg-[#181512] p-1 rounded-xl border border-white/10 text-xs">
          {(['density', 'flow', 'facilities'] as const).map(l => (
            <button
              key={l}
              onClick={() => setLayer(l)}
              className={`px-3 py-1.5 rounded-lg font-semibold uppercase tracking-wider text-[11px] transition-all ${
                layer === l
                  ? 'bg-amber-500 text-[#1a1612] font-bold shadow'
                  : 'text-[#a89f91] hover:text-[#fbf9f5]'
              }`}
            >
              {l} Layer
            </button>
          ))}
        </div>
      </div>

      {/* Main Map Viewport & Zone Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SVG Spatial Radar (8 cols) */}
        <div className="lg:col-span-8 card-pro overflow-hidden flex flex-col justify-between">
          <div className="p-4 bg-[#181512] border-b border-white/[0.08] flex items-center justify-between">
            <span className="text-xs font-semibold text-[#fbf9f5] font-display">
              Sanctum Layout & Corridor Heatmap
            </span>
            <span className="text-xs font-mono text-emerald-400">Live Simulation Vector</span>
          </div>

          <div className="relative bg-[#100e0c] flex items-center justify-center p-2">
            <svg viewBox="0 0 900 550" className="w-full h-auto block">
              <rect width="900" height="550" fill="#100e0c" />

              {/* Grid Lines */}
              {Array.from({ length: 22 }, (_, i) => (
                <line key={`gx${i}`} x1={i * 40} y1={0} x2={i * 40} y2={550} stroke="rgba(255,255,255,0.025)" strokeWidth="1" />
              ))}
              {Array.from({ length: 14 }, (_, i) => (
                <line key={`gy${i}`} x1={0} y1={i * 40} x2={900} y2={i * 40} stroke="rgba(255,255,255,0.025)" strokeWidth="1" />
              ))}

              {/* Outer boundary */}
              <rect x="130" y="60" width="640" height="440" rx="16" fill="rgba(24,21,18,0.7)" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />

              {/* Interactive Zone Polygons */}
              {AREAS.map(area => {
                const d = densities[area.id] ?? 0.25
                const col = area.fixed ? area.color : densityToColor(d)
                const isSelected = selected === area.id
                return (
                  <g
                    key={area.id}
                    onClick={() => setSelected(area.id)}
                    className="cursor-pointer transition-opacity hover:opacity-90"
                  >
                    <rect
                      x={area.x}
                      y={area.y}
                      width={area.w}
                      height={area.h}
                      rx="10"
                      fill={isSelected ? `${col}33` : `${col}15`}
                      stroke={isSelected ? '#ffffff' : `${col}66`}
                      strokeWidth={isSelected ? 2 : 1}
                    />
                    <text
                      x={area.x + area.w / 2}
                      y={area.y + area.h / 2}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill={isSelected ? '#ffffff' : col}
                      fontSize={area.w > 120 ? 11 : 9}
                      fontFamily="Plus Jakarta Sans, sans-serif"
                      fontWeight="700"
                    >
                      {area.label}
                    </text>
                  </g>
                )
              })}

              {/* Gate Markers */}
              {GATES.map(g => (
                <g key={g.id}>
                  <circle cx={g.x} cy={g.y} r={16} fill="#181512" stroke="#f59e0b" strokeWidth="2" />
                  <circle cx={g.x} cy={g.y} r={5} fill="#f59e0b" />
                  <text x={g.x} y={g.y - 24} textAnchor="middle" fill="#fbf9f5" fontSize="10" fontFamily="Plus Jakarta Sans" fontWeight="700">
                    {g.label}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Zone Inspector & Live Density Feed (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Selected Zone Detail */}
          {selectedArea && (
            <div className="card-pro p-5 border-amber-500/30">
              <span className="text-[10px] font-mono tracking-wider font-bold text-amber-400 uppercase block mb-1">
                Selected Zone Telemetry
              </span>
              <h3 className="text-base font-bold text-[#fbf9f5] font-display mb-3">
                {selectedArea.label}
              </h3>

              {selectedDensity !== null && (
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1 font-mono">
                      <span className="text-slate-400">Current Occupancy</span>
                      <span className="font-bold text-white">{Math.round(selectedDensity * 100)}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${selectedDensity * 100}%`,
                          backgroundColor: densityToColor(selectedDensity),
                        }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-2.5 rounded-lg bg-slate-900/60 border border-white/[0.05]">
                      <span className="text-slate-400 block text-[11px]">Est. Headcount</span>
                      <span className="font-mono font-bold text-white text-sm">
                        {Math.round(selectedDensity * 850)}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900/60 border border-white/[0.05]">
                      <span className="text-slate-400 block text-[11px]">Safety Status</span>
                      <span className={`font-mono font-bold text-xs uppercase ${
                        selectedDensity > 0.8 ? 'text-rose-400' : selectedDensity > 0.6 ? 'text-amber-400' : 'text-emerald-400'
                      }`}>
                        {densityLabel(selectedDensity)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* All Zones Density List */}
          <div className="card-pro p-5">
            <h3 className="text-sm font-bold text-white font-display mb-3 pb-2 border-b border-white/[0.08]">
              Zone Densities Overview
            </h3>
            <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
              {Object.entries(densities).map(([id, d]) => {
                const area = AREAS.find(a => a.id === id)
                if (!area) return null
                const color = densityToColor(d)
                return (
                  <div
                    key={id}
                    onClick={() => setSelected(id)}
                    className="p-2.5 rounded-xl bg-slate-900/50 border border-white/[0.05] cursor-pointer hover:border-white/20 transition-all"
                  >
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-semibold text-slate-200">{area.label}</span>
                      <span className="font-mono font-bold" style={{ color }}>{Math.round(d * 100)}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${d * 100}%`, backgroundColor: color }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
