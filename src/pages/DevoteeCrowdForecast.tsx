import { useState, useEffect } from 'react'
import {
  IconTrendingUp,
  IconClock,
  IconCheck,
  IconSparkles,
  IconTemple,
  IconUsers,
  IconRoute,
  IconAlert
} from '../components/Icons'

interface HourlyCrowd {
  hour: string
  label: string
  densityPct: number
  waitTimeMins: number
  level: 'LEAN' | 'MODERATE' | 'PEAK'
}

const HOURLY_TIMELINE: HourlyCrowd[] = [
  { hour: '04:00', label: '04:00 AM', densityPct: 35, waitTimeMins: 12, level: 'LEAN' },
  { hour: '06:00', label: '06:00 AM', densityPct: 78, waitTimeMins: 38, level: 'PEAK' },
  { hour: '08:00', label: '08:00 AM', densityPct: 88, waitTimeMins: 45, level: 'PEAK' },
  { hour: '10:00', label: '10:00 AM', densityPct: 72, waitTimeMins: 32, level: 'PEAK' },
  { hour: '12:00', label: '12:00 PM', densityPct: 58, waitTimeMins: 22, level: 'MODERATE' },
  { hour: '14:00', label: '02:00 PM', densityPct: 32, waitTimeMins: 14, level: 'LEAN' },
  { hour: '16:00', label: '04:00 PM', densityPct: 52, waitTimeMins: 20, level: 'MODERATE' },
  { hour: '18:00', label: '06:00 PM', densityPct: 85, waitTimeMins: 42, level: 'PEAK' },
  { hour: '20:00', label: '08:00 PM', densityPct: 65, waitTimeMins: 28, level: 'MODERATE' },
  { hour: '22:00', label: '10:00 PM', densityPct: 30, waitTimeMins: 10, level: 'LEAN' },
]

export default function DevoteeCrowdForecast() {
  const [selectedDay, setSelectedDay] = useState<'TODAY' | 'TOMORROW' | 'WEEKEND'>('TODAY')
  const [selectedHour, setSelectedHour] = useState<HourlyCrowd>(HOURLY_TIMELINE[5]) // 02:00 PM lean

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#0e1628] border border-white/[0.08] shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="badge-pill bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 font-semibold">
              <IconTrendingUp size={12} />
              AI CROWD INTELLIGENCE
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-white font-display">
              When to Visit: Hourly Crowd & Wait Time Forecast
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Plan your holy pilgrimage during peaceful lean hours. Our machine learning models predict queue waiting times and recommend the fastest gates to enter.
            </p>
          </div>

          {/* Current Live Pulse Card */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-amber-500/30 shadow-lg text-center min-w-[200px]">
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-center gap-1.5">
              <span className="status-dot status-dot-emerald pulse-live" />
              RIGHT NOW STATUS
            </div>
            <div className="text-xl font-bold text-emerald-400 font-display">
              MODERATE QUEUE
            </div>
            <div className="text-xs text-slate-300 font-mono mt-0.5">
              Avg Wait: ~18 mins
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Time Slot Banner */}
      <div className="card-pro p-5 border border-emerald-500/30 bg-gradient-to-r from-emerald-950/30 via-slate-900/60 to-slate-900/40 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shrink-0">
            <IconSparkles size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white font-display">
              Today&apos;s Best Recommended Darshan Window
            </h3>
            <p className="text-xs text-slate-300">
              Visit between <strong className="text-emerald-400 font-mono">01:30 PM and 03:45 PM</strong> for shortest queue duration (~12-15 mins).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-emerald-300 px-3 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 font-semibold">
            FASTEST GATE: G3 (SOUTH EXPRESS)
          </span>
        </div>
      </div>

      {/* Hourly Crowd Density Forecast Chart */}
      <div className="card-pro p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
          <div>
            <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
              <IconClock size={16} className="text-amber-400" />
              Hourly Crowd Timeline & Wait Estimation
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Click any hour bar below to inspect queue details and recommended arrival actions.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-white/[0.08] text-xs">
            <button
              onClick={() => setSelectedDay('TODAY')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                selectedDay === 'TODAY' ? 'bg-amber-500 text-[#1a1612] font-bold shadow-md shadow-amber-500/20' : 'text-slate-400 hover:text-white'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setSelectedDay('TOMORROW')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                selectedDay === 'TOMORROW' ? 'bg-amber-500 text-[#1a1612] font-bold shadow-md shadow-amber-500/20' : 'text-slate-400 hover:text-white'
              }`}
            >
              Tomorrow
            </button>
            <button
              onClick={() => setSelectedDay('WEEKEND')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                selectedDay === 'WEEKEND' ? 'bg-amber-500 text-[#1a1612] font-bold shadow-md shadow-amber-500/20' : 'text-slate-400 hover:text-white'
              }`}
            >
              Weekend
            </button>
          </div>
        </div>

        {/* Visual Bar Graph */}
        <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-3 pt-2">
          {HOURLY_TIMELINE.map(h => {
            const isSelected = selectedHour.hour === h.hour
            const isPeak = h.level === 'PEAK'
            const isLean = h.level === 'LEAN'
            const barColor = isPeak ? 'bg-rose-500' : isLean ? 'bg-emerald-500' : 'bg-amber-500'
            const textColor = isPeak ? 'text-rose-400' : isLean ? 'text-emerald-400' : 'text-amber-400'

            return (
              <button
                key={h.hour}
                onClick={() => setSelectedHour(h)}
                className={`flex flex-col items-center p-3 rounded-xl border text-center transition-all ${
                  isSelected
                    ? 'bg-[#24201c] border-amber-400 ring-2 ring-amber-400/30 scale-105'
                    : 'bg-slate-900/60 border-white/[0.06] hover:bg-slate-800/60'
                }`}
              >
                <span className="text-[10px] font-mono text-slate-400 mb-2">
                  {h.label}
                </span>

                {/* Vertical Bar Visual */}
                <div className="w-full bg-slate-950 rounded-full h-24 p-1 flex flex-col justify-end">
                  <div
                    style={{ height: `${h.densityPct}%` }}
                    className={`w-full rounded-full transition-all duration-500 ${barColor}`}
                  />
                </div>

                <span className={`text-xs font-mono font-bold mt-2 ${textColor}`}>
                  {h.waitTimeMins}m
                </span>
                <span className="text-[9px] font-mono text-slate-400 uppercase mt-0.5">
                  {h.level}
                </span>
              </button>
            )
          })}
        </div>

        {/* Detail for Selected Hour */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="text-center sm:text-left">
              <span className="text-xs font-mono text-slate-400 uppercase">Selected Window</span>
              <div className="text-base font-bold text-white font-mono">
                {selectedHour.label} - Density {selectedHour.densityPct}%
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5 text-slate-300">
              <IconClock size={14} className="text-amber-400" />
              <span>Est. Wait: <strong>{selectedHour.waitTimeMins} mins</strong></span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <IconRoute size={14} className="text-emerald-400" />
              <span>Recommended Gate: <strong>Gate 3 (South)</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Helpful Pilgrimage Travel Guidelines */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card-pro p-5 space-y-2 border border-white/[0.08]">
          <h4 className="text-xs font-bold text-amber-400 uppercase font-mono tracking-wider">
            Early Morning Suprabhatam
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            Arrive by 04:30 AM at Gate 1 West to join the first auspicious Suprabhata Darshan before major tour buses arrive.
          </p>
        </div>
        <div className="card-pro p-5 space-y-2 border border-white/[0.08]">
          <h4 className="text-xs font-bold text-amber-400 uppercase font-mono tracking-wider">
            Afternoon Mahaprasad Window
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            01:30 PM to 03:30 PM is consistently the quietest hour of the day. Sanctum queues move twice as fast with direct darshan.
          </p>
        </div>
        <div className="card-pro p-5 space-y-2 border border-white/[0.08]">
          <h4 className="text-xs font-bold text-emerald-400 uppercase font-mono tracking-wider">
            Senior Citizen Fast Track
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            Special designated priority queue for pilgrims above 65 years and mothers with infants operates continuously at Gate 3.
          </p>
        </div>
      </div>
    </div>
  )
}
