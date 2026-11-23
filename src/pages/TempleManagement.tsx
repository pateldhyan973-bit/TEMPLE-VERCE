import { useState, useEffect } from 'react'
import {
  IconTemple,
  IconCheck,
  IconAlert,
  IconRefresh,
  IconSparkles,
  IconUsers,
  IconActivity,
  IconClock
} from '../components/Icons'

interface TempleData {
  sanctum: {
    name: string
    capacity: number
    currentOccupancy: number
    densityPct: number
    status: string
    darshanRatePerHour: number
    avgDarshanTimeMin: number
    queueLineLength: number
  }
  crossSystemLinks: {
    aiPredictionLinked: boolean
    crowdManagementLinked: boolean
    virtualPassThrottling: boolean
    emergencyOverrideLinked: boolean
    activeGatesCount: number
    totalActiveCameras: number
  }
  aiDecisionLog: Array<{ id: number; time: string; text: string; status: string }>
}

export default function TempleManagement() {
  const [data, setData] = useState<TempleData | null>(null)
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)

  async function fetchTempleSummary() {
    try {
      const res = await fetch('/api/temple/summary')
      if (res.ok) {
        const json = await res.json()
        if (json.success && json.data) {
          setData(json.data)
        }
      }
    } catch {
      setData({
        sanctum: {
          name: 'Main Garbhagriha (Sanctum Sanctorum)',
          capacity: 2000,
          currentOccupancy: 1560,
          densityPct: 78,
          status: 'BALANCED',
          darshanRatePerHour: 1800,
          avgDarshanTimeMin: 1.8,
          queueLineLength: 4360,
        },
        crossSystemLinks: {
          aiPredictionLinked: true,
          crowdManagementLinked: true,
          virtualPassThrottling: false,
          emergencyOverrideLinked: false,
          activeGatesCount: 4,
          totalActiveCameras: 128,
        },
        aiDecisionLog: [
          { id: 1, time: new Date().toLocaleTimeString(), text: 'AI Queue Engine: Synchronized Gate 2 flow with Sanctum exit speed.', status: 'SUCCESS' },
          { id: 2, time: new Date().toLocaleTimeString(), text: 'Virtual Queue Pass rate: OPTIMAL (100% capacity pacing).', status: 'INFO' },
          { id: 3, time: new Date().toLocaleTimeString(), text: 'CCTV Neural Net: Object tracking synchronized across 128 camera nodes.', status: 'SUCCESS' },
        ],
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTempleSummary()
    const t = setInterval(fetchTempleSummary, 3000)
    return () => clearInterval(t)
  }, [])

  function triggerMasterSync() {
    setSyncing(true)
    setTimeout(() => {
      setSyncing(false)
      fetchTempleSummary()
    }, 900)
  }

  if (loading || !data) {
    return (
      <div className="p-16 text-center text-sm font-mono text-amber-400">
        Loading Sanctum Operations Hub...
      </div>
    )
  }

  const { sanctum, crossSystemLinks, aiDecisionLog } = data
  const statusColor = sanctum.densityPct > 85 ? '#f43f5e' : sanctum.densityPct > 65 ? '#f59e0b' : '#10b981'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="badge-pill bg-amber-500/15 text-amber-300 border border-amber-500/30">
              <IconTemple size={13} className="text-amber-400" />
              SANCTUM SANCTORUM
            </span>
            <span className="text-xs text-slate-400 font-mono">INNER GARBHAGRIHA CONTROL</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
            Temple Sanctum & Cross-System Synchronization
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl mt-1">
            Master coordinator binding virtual pass reservations, CCTV headcounts, gate diversions, and ceremonial darshan velocity.
          </p>
        </div>

        <button
          onClick={triggerMasterSync}
          disabled={syncing}
          className="btn-primary py-2.5 px-4 text-xs font-semibold"
        >
          <IconRefresh size={14} className={syncing ? 'animate-spin' : ''} />
          <span>{syncing ? 'Synchronizing...' : 'Master System Re-Sync'}</span>
        </button>
      </div>

      {/* Cross-System Connection Matrix */}
      <div className="card-pro p-5 space-y-3">
        <h3 className="text-sm font-bold text-white font-display pb-2 border-b border-white/[0.08]">
          Cross-Subsystem Operational Matrix
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { label: 'LSTM Surge Predictor', status: 'LINKED', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', desc: '15-minute lookahead horizon' },
            { label: 'Spatial Density Heatmap', status: 'ACTIVE', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', desc: '10×10 geo-grid real-time matrix' },
            { label: 'Devotee E-Pass Throttle', status: crossSystemLinks.virtualPassThrottling ? 'THROTTLED' : 'NOMINAL', color: crossSystemLinks.virtualPassThrottling ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', desc: 'Auto capacity load balancing' },
            { label: 'CCTV Camera Network', status: `${crossSystemLinks.totalActiveCameras}/128 ONLINE`, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20', desc: '30 FPS YOLO vision pipeline' },
            { label: 'Automated Entry Gates', status: `${crossSystemLinks.activeGatesCount}/4 ACTUATING`, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20', desc: 'Smart corridor flow diversion' },
            { label: 'Crisis Evacuation Fail-safe', status: crossSystemLinks.emergencyOverrideLinked ? 'CRISIS ACTIVE' : 'STANDBY', color: crossSystemLinks.emergencyOverrideLinked ? 'text-rose-400 bg-rose-500/10 border-rose-500/20' : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', desc: 'Sub-90s emergency protocol' },
          ].map((item, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-white/[0.05] space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-200">{item.label}</span>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${item.color}`}>
                  {item.status}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Grid: Sanctum Gauge & AI Decision Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Garbhagriha Sanctum Telemetry (7 cols) */}
        <div className="lg:col-span-7 card-pro p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <IconTemple size={18} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-display">Garbhagriha (Sanctum) Telemetry</h3>
                <p className="text-xs text-slate-400">Core shrine capacity & darshan pacing</p>
              </div>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
              sanctum.densityPct > 85
                ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
            }`}>
              {sanctum.status}
            </span>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs mb-1.5 font-mono">
              <span className="text-slate-400">Occupancy Level</span>
              <span className="font-bold text-white">
                {sanctum.densityPct}% ({sanctum.currentOccupancy} / {sanctum.capacity} Max)
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${sanctum.densityPct}%`, backgroundColor: statusColor }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#141210] border border-white/[0.05] space-y-1">
              <span className="text-xs text-[#a89f91] block">Queue Line Length</span>
              <p className="text-2xl font-extrabold text-amber-400 font-mono">
                {sanctum.queueLineLength.toLocaleString()}
              </p>
              <p className="text-[11px] text-[#a89f91]">Devotees currently in queue</p>
            </div>

            <div className="p-4 rounded-xl bg-[#141210] border border-white/[0.05] space-y-1">
              <span className="text-xs text-[#a89f91] block">Darshan Velocity</span>
              <p className="text-2xl font-extrabold text-emerald-400 font-mono">
                {sanctum.darshanRatePerHour}<span className="text-xs font-normal text-[#a89f91]">/hr</span>
              </p>
              <p className="text-[11px] text-[#a89f91]">Avg sanctum stay: {sanctum.avgDarshanTimeMin} min</p>
            </div>
          </div>
        </div>

        {/* AI Decision Console (5 cols) */}
        <div className="lg:col-span-5 card-pro p-5 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-white/[0.08]">
            <IconSparkles size={16} className="text-amber-400" />
            <h3 className="text-sm font-bold text-[#fbf9f5] font-display">AI Queue Balancing Directives</h3>
          </div>

          <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
            {aiDecisionLog.map(item => (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-[#141210] border border-white/[0.05] text-xs space-y-1"
              >
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-amber-400 font-semibold uppercase">Autonomous Event</span>
                  <span className="text-[#a89f91]">{item.time}</span>
                </div>
                <p className="text-[#d6cebf] leading-snug">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
