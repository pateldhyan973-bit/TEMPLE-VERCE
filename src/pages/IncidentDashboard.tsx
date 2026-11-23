import { useState, useEffect, useCallback } from 'react'
import {
  IconShield,
  IconAlert,
  IconCheck,
  IconClock,
  IconUsers,
  IconX,
  IconPlus,
  IconSearch,
  IconFilter
} from '../components/Icons'

interface IncidentNote {
  text: string
  author: string
  at: string
}

interface Incident {
  id: string
  type: string
  zone: string
  description: string
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED'
  assignedTo: string
  reporter: string
  reportedAt: string
  updatedAt: string
  closedAt?: string
  notes: IncidentNote[]
}

const INCIDENT_TYPES = [
  'High Density Surge', 'Gate Turnstile Congestion', 'Medical Urgent Response', 'Corridor Bottleneck',
  'Security Perimeter Alert', 'Lost Child / Devotee', 'Water Kiosk Failure', 'VIP Procession'
]

const ZONES = [
  'Main Sanctum Courtyard', 'North Queue Corridor', 'East Shrine Promenade',
  'South Food & Refreshment Park', 'West Transit Hub',
  'Gate 1 West Entry', 'Gate 2 East Main', 'Gate 3 South Gate', 'Gate 4 North Exit'
]

const STAFF = [
  'Cmdr. Sharma (Ops)', 'Security Team Alpha', 'Security Team Beta',
  'Dr. Anita (Medical)', 'Gate Control Room', 'Volunteer Coordinator'
]

function priorityBadge(p: string) {
  if (p === 'CRITICAL') return 'bg-rose-500/15 text-rose-300 border-rose-500/30'
  if (p === 'HIGH') return 'bg-orange-500/15 text-orange-300 border-orange-500/30'
  if (p === 'MEDIUM') return 'bg-amber-500/15 text-amber-300 border-amber-500/30'
  return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
}

function statusBadge(s: string) {
  if (s === 'OPEN') return 'bg-amber-500/15 text-amber-300 border-amber-500/30'
  if (s === 'IN_PROGRESS') return 'bg-amber-500/15 text-amber-300 border-amber-500/30'
  return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
}

export default function IncidentDashboard() {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [noteText, setNoteText] = useState('')

  // Modal Form State
  const [form, setForm] = useState({
    type: INCIDENT_TYPES[0],
    zone: ZONES[0],
    description: '',
    priority: 'HIGH' as const,
    assignedTo: STAFF[0],
    reporter: 'Control Room Officer'
  })

  const fetchIncidents = useCallback(async () => {
    try {
      const res = await fetch('/api/incidents')
      if (res.ok) {
        const json = await res.json()
        if (json.success && json.data) {
          setIncidents(json.data)
        }
      }
    } catch {
      // Fallback state
      setIncidents([
        {
          id: 'INC-1042',
          type: 'Gate Congestion',
          zone: 'Gate 2 East Main',
          description: 'Devotee queue density exceeded 88% due to special darshan train arrival.',
          priority: 'HIGH',
          status: 'OPEN',
          assignedTo: 'Security Team Alpha',
          reporter: 'AI Vision Bot',
          reportedAt: new Date(Date.now() - 15 * 60000).toISOString(),
          updatedAt: new Date().toISOString(),
          notes: [{ author: 'Ops', text: 'Staggered diversion to Gate 3 activated.', at: 'Just now' }]
        },
        {
          id: 'INC-1041',
          type: 'Medical Assistance',
          zone: 'East Shrine Promenade',
          description: 'Elderly pilgrim experiencing dehydration near corridor junction.',
          priority: 'CRITICAL',
          status: 'IN_PROGRESS',
          assignedTo: 'Dr. Anita (Medical)',
          reporter: 'Volunteer Kiosk',
          reportedAt: new Date(Date.now() - 40 * 60000).toISOString(),
          updatedAt: new Date().toISOString(),
          notes: [{ author: 'Dr. Anita', text: 'Paramedic unit on scene with wheelchair.', at: '12m ago' }]
        },
        {
          id: 'INC-1040',
          type: 'Flow Blockage',
          zone: 'Main Sanctum Courtyard',
          description: 'Barricade realignment required to smooth exit turnstiles.',
          priority: 'LOW',
          status: 'RESOLVED',
          assignedTo: 'Gate Control Room',
          reporter: 'Steward Team',
          reportedAt: new Date(Date.now() - 90 * 60000).toISOString(),
          updatedAt: new Date().toISOString(),
          notes: []
        }
      ])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchIncidents()
    const t = setInterval(fetchIncidents, 3500)
    return () => clearInterval(t)
  }, [fetchIncidents])

  async function handleStatusChange(id: string, status: Incident['status']) {
    try {
      await fetch(`/api/incidents/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      fetchIncidents()
      if (selectedIncident?.id === id) {
        setSelectedIncident(prev => prev ? { ...prev, status } : null)
      }
    } catch {
      setIncidents(prev => prev.map(inc => inc.id === id ? { ...inc, status } : inc))
    }
  }

  async function handleCreateIncident(e: React.FormEvent) {
    e.preventDefault()
    try {
      await fetch('/api/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      setIsModalOpen(false)
      fetchIncidents()
    } catch {
      const newInc: Incident = {
        id: `INC-${Math.floor(1000 + Math.random() * 9000)}`,
        ...form,
        status: 'OPEN',
        reportedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        notes: []
      }
      setIncidents(prev => [newInc, ...prev])
      setIsModalOpen(false)
    }
  }

  async function handleAddNote() {
    if (!noteText.trim() || !selectedIncident) return
    const newNote = { text: noteText, author: 'Control Room', at: 'Just now' }
    try {
      await fetch(`/api/incidents/${selectedIncident.id}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newNote)
      })
    } catch { /* offline */ }
    setSelectedIncident(prev => prev ? { ...prev, notes: [...prev.notes, newNote] } : null)
    setIncidents(prev => prev.map(inc => inc.id === selectedIncident.id ? { ...inc, notes: [...inc.notes, newNote] } : inc))
    setNoteText('')
  }

  const filteredIncidents = incidents.filter(inc => {
    if (priorityFilter !== 'ALL' && inc.priority !== priorityFilter) return false
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      return inc.type.toLowerCase().includes(q) || inc.zone.toLowerCase().includes(q) || inc.id.toLowerCase().includes(q)
    }
    return true
  })

  const openList = filteredIncidents.filter(i => i.status === 'OPEN')
  const inProgressList = filteredIncidents.filter(i => i.status === 'IN_PROGRESS')
  const resolvedList = filteredIncidents.filter(i => i.status === 'RESOLVED')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="badge-pill badge-amber">
              <IconShield size={13} />
              INCIDENT RESPONSE HUB
            </span>
            <span className="text-xs text-slate-400 font-mono">DISPATCH & SITUATIONAL AUDIT</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
            Operational Incidents & Rapid Dispatch
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl mt-1">
            Real-time tracking of security alerts, medical emergencies, queue bottlenecks, and automated resolution workflows.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary py-2.5 px-4 text-xs font-semibold"
        >
          <IconPlus size={15} />
          <span>Report New Incident</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="card-pro p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <IconSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by ID, Zone, or Incident type..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="input-pro pl-9 py-2 text-xs"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs text-[#a89f91] font-medium shrink-0">Severity:</span>
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map(p => (
            <button
              key={p}
              onClick={() => setPriorityFilter(p)}
              className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-all shrink-0 ${
                priorityFilter === p
                  ? 'bg-amber-500 text-[#1a1612] font-bold shadow'
                  : 'bg-[#181512] text-[#a89f91] hover:text-[#fbf9f5] border border-white/5'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Kanban Board 3-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Column 1: OPEN */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <h3 className="text-xs font-bold text-[#d6cebf] tracking-wider uppercase font-mono">
                New Alerts ({openList.length})
              </h3>
            </div>
          </div>

          <div className="space-y-3 min-h-[300px]">
            {openList.length === 0 ? (
              <div className="p-8 rounded-xl bg-[#181512]/30 border border-white/[0.04] text-center text-xs text-[#a89f91]">
                No open alerts
              </div>
            ) : (
              openList.map(inc => (
                <div
                  key={inc.id}
                  onClick={() => setSelectedIncident(inc)}
                  className="card-pro p-4 cursor-pointer hover:border-amber-500/40 transition-all space-y-3 bg-[#181512]"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-amber-400">{inc.id}</span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${priorityBadge(inc.priority)}`}>
                      {inc.priority}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#fbf9f5] font-display">{inc.type}</h4>
                    <p className="text-xs text-[#a89f91] mt-0.5">{inc.zone}</p>
                  </div>
                  <p className="text-xs text-[#d6cebf] line-clamp-2 leading-relaxed">
                    {inc.description}
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-white/[0.05] text-[11px] text-[#a89f91]">
                    <span>{inc.assignedTo}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleStatusChange(inc.id, 'IN_PROGRESS')
                      }}
                      className="px-2 py-1 rounded bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 font-semibold"
                    >
                      Acknowledge
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 2: IN_PROGRESS */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <h3 className="text-xs font-bold text-slate-200 tracking-wider uppercase font-mono">
                Active Response ({inProgressList.length})
              </h3>
            </div>
          </div>

          <div className="space-y-3 min-h-[300px]">
            {inProgressList.length === 0 ? (
              <div className="p-8 rounded-xl bg-slate-900/30 border border-white/[0.04] text-center text-xs text-slate-400">
                No active responses
              </div>
            ) : (
              inProgressList.map(inc => (
                <div
                  key={inc.id}
                  onClick={() => setSelectedIncident(inc)}
                  className="card-pro p-4 cursor-pointer hover:border-amber-500/40 transition-all space-y-3 bg-[#181512]"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-amber-400">{inc.id}</span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${priorityBadge(inc.priority)}`}>
                      {inc.priority}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white font-display">{inc.type}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{inc.zone}</p>
                  </div>
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {inc.description}
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-white/[0.05] text-[11px] text-slate-400">
                    <span>{inc.assignedTo}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleStatusChange(inc.id, 'RESOLVED')
                      }}
                      className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 font-semibold"
                    >
                      Resolve
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 3: RESOLVED */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <h3 className="text-xs font-bold text-slate-200 tracking-wider uppercase font-mono">
                Resolved ({resolvedList.length})
              </h3>
            </div>
          </div>

          <div className="space-y-3 min-h-[300px]">
            {resolvedList.length === 0 ? (
              <div className="p-8 rounded-xl bg-slate-900/30 border border-white/[0.04] text-center text-xs text-slate-400">
                No resolved incidents
              </div>
            ) : (
              resolvedList.map(inc => (
                <div
                  key={inc.id}
                  onClick={() => setSelectedIncident(inc)}
                  className="card-pro p-4 cursor-pointer hover:border-emerald-500/40 transition-all space-y-3 bg-[#181512]/60 opacity-80"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#a89f91]">{inc.id}</span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      RESOLVED
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#d6cebf] font-display line-through">{inc.type}</h4>
                    <p className="text-xs text-[#a89f91] mt-0.5">{inc.zone}</p>
                  </div>
                  <p className="text-xs text-[#a89f91] line-clamp-1">
                    {inc.description}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Incident Detail Slide-Over Modal */}
      {selectedIncident && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-[#181512] border-l border-white/[0.08] h-full overflow-y-auto p-6 space-y-6 shadow-2xl flex flex-col justify-between">
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                <div>
                  <span className="font-mono text-xs font-bold text-amber-400">{selectedIncident.id}</span>
                  <h2 className="text-lg font-bold text-[#fbf9f5] font-display mt-0.5">{selectedIncident.type}</h2>
                </div>
                <button
                  onClick={() => setSelectedIncident(null)}
                  className="p-2 rounded-lg text-[#a89f91] hover:text-white hover:bg-white/5"
                >
                  <IconX size={18} />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full border ${priorityBadge(selectedIncident.priority)}`}>
                  {selectedIncident.priority} PRIORITY
                </span>
                <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full border ${statusBadge(selectedIncident.status)}`}>
                  {selectedIncident.status}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-white/[0.05] space-y-2 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Zone Location</span>
                  <span className="font-semibold text-white">{selectedIncident.zone}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Assigned Squad</span>
                  <span className="font-semibold text-white">{selectedIncident.assignedTo}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Reported By</span>
                  <span>{selectedIncident.reporter}</span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Description</h4>
                <p className="text-sm text-slate-200 leading-relaxed p-3.5 rounded-xl bg-slate-900/40 border border-white/[0.05]">
                  {selectedIncident.description}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Operational Notes</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto mb-3">
                  {selectedIncident.notes.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No notes added yet.</p>
                  ) : (
                    selectedIncident.notes.map((n, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-[#141210] border border-white/[0.04] text-xs space-y-1">
                        <div className="flex justify-between font-mono text-[10px] text-[#a89f91]">
                          <span className="font-bold text-amber-400">{n.author}</span>
                          <span>{n.at}</span>
                        </div>
                        <p className="text-[#d6cebf]">{n.text}</p>
                      </div>
                    ))
                  )}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add dispatch note..."
                    value={noteText}
                    onChange={e => setNoteText(e.target.value)}
                    className="input-pro text-xs py-2"
                  />
                  <button
                    onClick={handleAddNote}
                    className="btn-primary px-4 text-xs font-semibold shrink-0"
                  >
                    Post Note
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/[0.08] flex gap-3">
              {selectedIncident.status !== 'RESOLVED' ? (
                <button
                  onClick={() => handleStatusChange(selectedIncident.id, 'RESOLVED')}
                  className="w-full btn-primary bg-emerald-600 hover:bg-emerald-500 py-2.5 font-bold text-xs"
                >
                  Mark as Resolved
                </button>
              ) : (
                <button
                  onClick={() => handleStatusChange(selectedIncident.id, 'OPEN')}
                  className="w-full btn-secondary py-2.5 font-bold text-xs"
                >
                  Reopen Incident
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* New Incident Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-[#181512] border border-white/[0.08] rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <h3 className="text-base font-bold text-[#fbf9f5] font-display">Report Security or Flow Incident</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <IconX size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateIncident} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Incident Classification</label>
                  <select
                    value={form.type}
                    onChange={e => setForm({ ...form, type: e.target.value })}
                    className="input-pro text-xs"
                  >
                    {INCIDENT_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Severity Priority</label>
                  <select
                    value={form.priority}
                    onChange={e => setForm({ ...form, priority: e.target.value as any })}
                    className="input-pro text-xs"
                  >
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="LOW">LOW</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Temple Zone Location</label>
                <select
                  value={form.zone}
                  onChange={e => setForm({ ...form, zone: e.target.value })}
                  className="input-pro text-xs"
                >
                  {ZONES.map(z => <option key={z}>{z}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Incident Summary & Details *</label>
                <textarea
                  required
                  rows={3}
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe location, queue density, or assistance required..."
                  className="input-pro text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Assign Response Unit</label>
                <select
                  value={form.assignedTo}
                  onChange={e => setForm({ ...form, assignedTo: e.target.value })}
                  className="input-pro text-xs"
                >
                  {STAFF.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-secondary text-xs py-2 px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs py-2 px-5 font-bold"
                >
                  Dispatch Incident
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
