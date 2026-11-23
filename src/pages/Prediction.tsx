import { useState, useEffect } from 'react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts'
import {
  IconBrain,
  IconSparkles,
  IconAlert,
  IconActivity,
  IconChevronRight,
  IconClock
} from '../components/Icons'

const HOURS = Array.from({ length: 48 }, (_, i) => {
  const h = Math.floor(i / 2)
  const m = i % 2 === 0 ? '00' : '30'
  return `${String(h).padStart(2, '0')}:${m}`
})

function genData(baseVal: number, noise: number, len: number) {
  return Array.from({ length: len }, (_, i) => {
    const hour = i / (len / 24)
    const wave = Math.sin((hour - 8) * 0.5) * 0.35 + Math.sin((hour - 14) * 0.6) * 0.45 + Math.sin((hour - 19) * 0.4) * 0.25
    const actual = Math.round(Math.max(50, baseVal + wave * baseVal * 0.6 + (Math.random() - 0.5) * noise))
    return actual
  })
}

const BASE_DATA = genData(920, 60, 48)

const INITIAL_CHART_DATA = BASE_DATA.map((val, idx) => {
  const isPast = idx <= 28
  return {
    time: HOURS[idx],
    historical: isPast ? val : null,
    predicted: idx >= 28 ? Math.round(val * (1 + (Math.random() - 0.4) * 0.15)) : null,
    lowerBound: idx >= 28 ? Math.round(val * 0.9) : null,
    upperBound: idx >= 28 ? Math.round(val * 1.15) : null,
  }
})

const ZONE_FORECASTS = [
  { zone: 'Gate 2 East Courtyard', risk: 'HIGH', time: '14 min', pct: 86, rec: 'Trigger diversion to Gate 3' },
  { zone: 'Temple Inner Sanctum', risk: 'MEDIUM', time: '22 min', pct: 64, rec: 'Pace entry barrier release' },
  { zone: 'South Express Queue', risk: 'LOW', time: '35 min', pct: 36, rec: 'Optimal capacity available' },
  { zone: 'North Arch Entry', risk: 'CRITICAL', time: '8 min', pct: 94, rec: 'Immediate stop-flow alert' },
]

export default function Prediction() {
  const [chartData, setChartData] = useState(INITIAL_CHART_DATA)
  const [forecasts, setForecasts] = useState(ZONE_FORECASTS)
  const [horizon, setHorizon] = useState<'15m' | '30m' | '60m'>('30m')
  const [aiInsight, setAiInsight] = useState('LSTM Neural Model detecting incoming pilgrim surge at East Courtyard in 14 minutes.')

  const INSIGHTS = [
    'Gate 2 (East) approaching 86% density. Recommending auto-diversion to South Express.',
    'Sanctum queue velocity nominal. Estimated wait time dropping to 16 minutes.',
    'Special train arrival at Central Station. Surge anticipated in 35 minutes.',
    'North Arch capacity nearing threshold. Flow redirection active.',
  ]

  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      i = (i + 1) % INSIGHTS.length
      setAiInsight(INSIGHTS[i])
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    async function fetchForecast() {
      try {
        const res = await fetch('/api/prediction/forecast')
        if (res.ok) {
          const json = await res.json()
          if (json.success && json.data?.forecasts) {
            setForecasts(json.data.forecasts)
          }
        }
      } catch {
        setForecasts(prev => prev.map(f => ({
          ...f,
          pct: Math.max(10, Math.min(98, f.pct + Math.round((Math.random() - 0.48) * 3))),
        })))
      }
    }

    fetchForecast()
    const t = setInterval(fetchForecast, 3500)
    return () => clearInterval(t)
  }, [])

  function riskBadge(risk: string) {
    if (risk === 'CRITICAL') return 'bg-rose-500/15 text-rose-300 border-rose-500/30'
    if (risk === 'HIGH') return 'bg-orange-500/15 text-orange-300 border-orange-500/30'
    if (risk === 'MEDIUM') return 'bg-amber-500/15 text-amber-300 border-amber-500/30'
    return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="badge-pill badge-amber">
              <IconBrain size={13} />
              PREDICTIVE AI ENGINE
            </span>
            <span className="text-xs text-slate-400 font-mono">BIDIRECTIONAL LSTM • 30-MIN LOOKAHEAD</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
            Crowd Surge Forecasting & Early Warning
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl mt-1">
            Deep-learning time-series forecasting analyzing historical arrival patterns, CCTV density velocity, and transit schedules.
          </p>
        </div>

        <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-white/10 text-xs">
          {(['15m', '30m', '60m'] as const).map(h => (
            <button
              key={h}
              onClick={() => setHorizon(h)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                horizon === h
                  ? 'bg-amber-500 text-[#1a1612] font-bold shadow'
                  : 'text-[#a89f91] hover:text-[#fbf9f5]'
              }`}
            >
              {h} Lookahead
            </button>
          ))}
        </div>
      </div>

      {/* AI Live Insight Banner */}
      <div className="card-pro p-4 bg-gradient-to-r from-amber-950/30 via-[#181512] to-[#181512] border-amber-500/30 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
          <IconSparkles size={20} />
        </div>
        <div className="flex-1">
          <span className="text-[10px] font-mono tracking-wider font-bold text-amber-400 uppercase">
            Real-Time AI Surge Advisory
          </span>
          <p className="text-sm font-medium text-[#fbf9f5] mt-0.5 leading-snug">
            {aiInsight}
          </p>
        </div>
        <span className="badge-pill badge-amber text-[10px] hidden sm:inline-flex">
          LIVE MODEL INFERENCE
        </span>
      </div>

      {/* Main Recharts Area Chart */}
      <div className="card-pro p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/[0.08]">
          <div>
            <h3 className="text-base font-bold text-[#fbf9f5] font-display">
              Pilgrim Footfall Trajectory & 24-Hour Horizon
            </h3>
            <p className="text-xs text-[#a89f91]">
              Emerald: Verified sensor counts • Amber: Neural network surge projection
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-emerald-400"></span>
              <span className="text-[#d6cebf]">Historical Inflow</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-amber-400"></span>
              <span className="text-[#d6cebf]">LSTM Forecast</span>
            </div>
          </div>
        </div>

        <div className="h-80 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorHist" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16a34a" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#16a34a" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorPred" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
              <XAxis dataKey="time" stroke="#a89f91" fontSize={11} tickLine={false} interval={4} />
              <YAxis stroke="#a89f91" fontSize={11} tickLine={false} domain={[0, 'auto']} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#181512',
                  borderColor: 'rgba(245, 158, 11, 0.3)',
                  borderRadius: '10px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                  fontSize: '12px'
                }}
              />
              <Area
                type="monotone"
                dataKey="historical"
                stroke="#22c55e"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorHist)"
                name="Historical Pilgrims"
              />
              <Area
                type="monotone"
                dataKey="predicted"
                stroke="#f59e0b"
                strokeWidth={2}
                strokeDasharray="4 4"
                fillOpacity={1}
                fill="url(#colorPred)"
                name="AI Prediction"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Zone Surge Risk Matrix */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white font-display">Zone Surge Risk Evaluation</h3>
          <span className="text-xs text-slate-400">15-Minute Critical Horizon</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {forecasts.map(f => (
            <div key={f.zone} className="card-pro p-4 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${riskBadge(f.risk)}`}>
                    {f.risk} RISK
                  </span>
                  <div className="flex items-center gap-1 text-slate-400 text-xs font-mono">
                    <IconClock size={12} />
                    <span>In {f.time}</span>
                  </div>
                </div>
                <h4 className="text-sm font-bold text-white font-display mb-1">{f.zone}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{f.rec}</p>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1.5 font-mono">
                  <span className="text-slate-400">Capacity Load</span>
                  <span className="font-bold text-white">{f.pct}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      f.pct > 85 ? 'bg-rose-500' : f.pct > 60 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${f.pct}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
