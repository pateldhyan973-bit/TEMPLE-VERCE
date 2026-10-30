import { useState, useRef, useEffect, useCallback } from 'react'
import PilgrimCanvas from '../components/PilgrimCanvas'
import { useSystemState } from '../context/SystemStateContext'
import {
  IconAlert,
  IconShield,
  IconCheck,
  IconRadio,
  IconUsers,
  IconTicket,
  IconSparkles
} from '../components/Icons'

const STEPS = [
  { id: 1, label: 'DETECTION',   desc: 'AI Vision detects critical density surge in Zone 2 Sanctum (>95%).' },
  { id: 2, label: 'BROADCAST',   desc: 'Mass SMS, WhatsApp, and App push broadcast dispatched to all registered devotees.' },
  { id: 3, label: 'HALT INFLOW', desc: 'Electronic turnstiles at Gates 1 & 2 locked to incoming crowds.' },
  { id: 4, label: 'OPEN EXITS',  desc: 'Emergency exit corridors E1 through E4 unlocked and lighted.' },
  { id: 5, label: 'EVACUATE',    desc: 'Dynamic digital signage guides crowd outward toward West & South plazas.' },
  { id: 6, label: 'SECURE ZONE', desc: 'Rapid response security and paramedic squads deploy to Sanctum.' },
  { id: 7, label: 'STABILIZED',  desc: 'Zone density reduced below safe baseline (<40%). Normal flow resumes.' },
]

const MOCK_EPASS_HOLDERS = [
  { passId: 'DARSHAN-8841', name: 'Rajesh Sharma',   phone: '+91 98765 43210', gate: 'Gate 1 West', slot: '09:00-10:00', status: 'ALERT SENT' },
  { passId: 'DARSHAN-9932', name: 'Priya Patel',     phone: '+91 98765 43211', gate: 'Gate 3 South', slot: '10:00-11:00', status: 'DELIVERED' },
  { passId: 'DARSHAN-3312', name: 'Arun Krishnan',   phone: '+91 87654 32109', gate: 'Gate 2 East',  slot: '11:00-12:00', status: 'ACKNOWLEDGED' },
  { passId: 'DARSHAN-7700', name: 'Meena Devi',      phone: '+91 76543 21098', gate: 'Gate 4 North', slot: '04:00-05:00', status: 'ALERT SENT' },
  { passId: 'DARSHAN-5501', name: 'Suresh Iyer',     phone: '+91 65432 10987', gate: 'Gate 3 South', slot: '06:00-07:00', status: 'DELIVERED' },
]

const STAFF_ROSTER = [
  { id: 'OPS-01', name: 'Commander Sharma (Security Ops)', channel: 'Intercom Ch 1', status: 'ACTIVE' },
  { id: 'SEC-02', name: 'Alpha QRF Squad (Sanctum)',       channel: 'Radio VHF 2', status: 'DEPLOYED' },
  { id: 'MED-03', name: 'Dr. Anita (Medical Rapid Unit)',    channel: 'Direct Line 108', status: 'ON SCENE' },
  { id: 'GATE-04', name: 'Gate Control Room Supervisor',    channel: 'Intercom Ch 4', status: 'ACTUATING' },
  { id: 'FIRE-05', name: 'District Fire Brigade Liaison',   channel: 'Emergency 101', status: 'STANDBY' },
]

export default function Emergency() {
  const { state, triggerEmergency: ctxTrigger, resetEmergency: ctxReset } = useSystemState()
  const active = state.emergencyActive
  const stepIdx = Math.max(-1, state.emergencyStep)

  const [activeTab, setActiveTab] = useState<'notifications' | 'epass' | 'staff'>('notifications')
  const [broadcastLog, setBroadcastLog] = useState<any[]>([])

  const fetchBroadcastLog = useCallback(async () => {
    try {
      const res = await fetch('/api/emergency/broadcast-log')
      if (res.ok) {
        const json = await res.json()
        if (json.success) setBroadcastLog(json.data || [])
      }
    } catch { /* backend offline */ }
  }, [])

  useEffect(() => {
    if (active) {
      fetchBroadcastLog()
      const t = setInterval(fetchBroadcastLog, 3000)
      return () => clearInterval(t)
    }
  }, [active, fetchBroadcastLog])

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="card-pro p-6 bg-gradient-to-r from-rose-950/30 via-slate-900 to-slate-900 border-rose-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className={`badge-pill ${active ? 'badge-rose' : 'badge-emerald'}`}>
              <span className={`status-dot ${active ? 'status-dot-rose pulse-live' : 'status-dot-emerald'}`} />
              {active ? 'CRISIS EVACUATION IN PROGRESS' : 'STANDBY MONITORING'}
            </span>
            <span className="text-xs text-slate-400 font-mono">PROTOCOL ALPHA-4</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
            Emergency Response & Crisis Automation
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl mt-1 leading-relaxed">
            Multi-stage automated evacuation sequencing with instant gate unlocking, devotee mass messaging, and security dispatch.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {!active ? (
            <button
              onClick={() => ctxTrigger()}
              className="btn-danger py-2.5 px-5 text-sm font-bold shadow-lg shadow-rose-900/40"
            >
              <IconAlert size={16} />
              <span>Initiate Evacuation Protocol</span>
            </button>
          ) : (
            <button
              onClick={() => ctxReset()}
              className="btn-primary py-2.5 px-5 text-sm font-bold bg-emerald-600 hover:bg-emerald-500"
            >
              <IconCheck size={16} />
              <span>Reset to Normal Standby</span>
            </button>
          )}
        </div>
      </div>

      {/* 7-Step Evacuation Pipeline Sequencer */}
      <div className="card-pro p-5 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
          <h3 className="text-sm font-bold text-white font-display">
            Automated Evacuation Sequence Pipeline
          </h3>
          <span className="text-xs font-mono text-slate-400">
            {active ? `Executing Step ${Math.min(7, stepIdx + 1)} of 7` : 'System Ready'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {STEPS.map((step, idx) => {
            const isCompleted = active && stepIdx >= idx
            const isCurrent = active && stepIdx === idx
            return (
              <div
                key={step.id}
                className={`p-3 rounded-xl border text-center transition-all ${
                  isCurrent
                    ? 'bg-rose-500/20 border-rose-500 shadow-md shadow-rose-500/20'
                    : isCompleted
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : 'bg-slate-900/40 border-white/[0.06] text-slate-400'
                }`}
              >
                <div className="flex items-center justify-center mb-1">
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                    isCurrent ? 'bg-rose-500 text-white' : isCompleted ? 'bg-emerald-500 text-slate-950 font-extrabold' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {isCompleted ? '✓' : `0${step.id}`}
                  </span>
                </div>
                <p className="text-xs font-bold text-white font-display truncate">{step.label}</p>
              </div>
            )
          })}
        </div>

        {active && stepIdx >= 0 && stepIdx < STEPS.length && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs">
            <span className="font-bold text-rose-300 uppercase tracking-wider text-[10px] block mb-0.5">
              Current Active Directive: {STEPS[stepIdx].label}
            </span>
            <p className="text-slate-200 leading-relaxed text-sm">
              {STEPS[stepIdx].desc}
            </p>
          </div>
        )}
      </div>

      {/* Spatial Map & Right Feed Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Spatial Radar in Evacuation Mode (8 cols) */}
        <div className="lg:col-span-8 card-pro overflow-hidden flex flex-col justify-between">
          <div className="p-4 bg-[#181512] border-b border-white/[0.08] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`badge-pill ${active ? 'badge-rose' : 'badge-amber'} text-[10px]`}>
                {active ? 'EVACUATION WAYFINDING ACTIVE' : 'RADAR STANDBY'}
              </span>
              <span className="text-xs font-semibold text-[#fbf9f5] font-display">Complex Spatial Radar</span>
            </div>
            <span className="text-xs text-[#a89f91] font-mono">Corridors E1–E4</span>
          </div>

          <div className="relative bg-[#100e0c] p-2 flex items-center justify-center min-h-[380px]">
            <PilgrimCanvas emergency={active} />
          </div>

          <div className="p-4 bg-[#181512] border-t border-white/[0.08] flex items-center justify-between text-xs text-[#a89f91]">
            <span>Primary Egress: West & South Plazas</span>
            <span className="font-mono text-emerald-400 font-semibold">Exit Corridors 100% Unlocked</span>
          </div>
        </div>

        {/* Right: Operational Tabs & Action Feeds (4 cols) */}
        <div className="lg:col-span-4 card-pro flex flex-col overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-white/[0.08] bg-[#181512]">
            {[
              { id: 'notifications', label: 'Alerts', icon: IconAlert },
              { id: 'epass', label: 'E-Pass Holders', icon: IconTicket },
              { id: 'staff', label: 'Staff Roster', icon: IconRadio },
            ].map(tab => {
              const Icon = tab.icon
              const isCurrent = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border-b-2 ${
                    isCurrent
                      ? 'border-amber-400 text-amber-300 bg-amber-500/10'
                      : 'border-transparent text-[#a89f91] hover:text-[#fbf9f5]'
                  }`}
                >
                  <Icon size={14} />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>

          <div className="p-4 flex-1 overflow-y-auto max-h-[400px] space-y-3">
            {activeTab === 'notifications' && (
              <div className="space-y-2">
                {state.notifications.length === 0 ? (
                  <p className="text-xs text-[#a89f91] text-center py-8">
                    No active emergency alerts. All quiet.
                  </p>
                ) : (
                  state.notifications.map((n: { id: number; text: string; time: string; color: string }) => (
                    <div
                      key={n.id}
                      className="p-3 rounded-xl bg-[#141210] border border-white/[0.06] text-xs space-y-1"
                    >
                      <span className="text-[10px] font-mono text-[#a89f91] block">{n.time}</span>
                      <p className="text-[#d6cebf] leading-snug">{n.text}</p>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'epass' && (
              <div className="space-y-2.5">
                <p className="text-[11px] text-[#a89f91]">
                  Mass broadcast delivery tracking to current pilgrims in complex:
                </p>
                {MOCK_EPASS_HOLDERS.map(p => (
                  <div key={p.passId} className="p-3 rounded-xl bg-[#141210] border border-white/[0.05] text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-amber-400">{p.passId}</span>
                      <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                        {p.status}
                      </span>
                    </div>
                    <p className="font-semibold text-[#fbf9f5]">{p.name}</p>
                    <p className="text-[11px] text-[#a89f91]">{p.gate} • {p.slot}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'staff' && (
              <div className="space-y-2.5">
                <p className="text-[11px] text-[#a89f91]">
                  Direct encrypted radio links & squad status:
                </p>
                {STAFF_ROSTER.map(s => (
                  <div key={s.id} className="p-3 rounded-xl bg-[#141210] border border-white/[0.05] text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-[#a89f91]">{s.id}</span>
                      <span className="text-[10px] font-semibold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                        {s.status}
                      </span>
                    </div>
                    <p className="font-semibold text-[#fbf9f5]">{s.name}</p>
                    <p className="text-[11px] text-[#a89f91] font-mono">{s.channel}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
