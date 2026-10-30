import { useState } from 'react'
import {
  IconPhoneCall,
  IconShield,
  IconAlert,
  IconCheck,
  IconClock,
  IconUsers,
  IconRadio,
  IconSparkles
} from '../components/Icons'

interface LostPersonReport {
  id: string
  name: string
  age: number
  type: 'CHILD' | 'SENIOR' | 'ITEM'
  description: string
  lastSeenLocation: string
  reportedAt: string
  status: 'SEARCHING' | 'REUNITED'
}

const SAMPLE_REPORTS: LostPersonReport[] = [
  {
    id: 'LF-892',
    name: 'Ananya Sharma (Child)',
    age: 7,
    type: 'CHILD',
    description: 'Wearing yellow traditional pavada and red hair ribbons. Fluent in Telugu & Hindi.',
    lastSeenLocation: 'Gate 2 East Gopuram Courtyard',
    reportedAt: '12 mins ago',
    status: 'SEARCHING'
  },
  {
    id: 'LF-889',
    name: 'Srinivasa Rao (Senior Citizen)',
    age: 74,
    type: 'SENIOR',
    description: 'Wearing white dhoti, spectacles with silver frame, walking with a wooden cane.',
    lastSeenLocation: 'Prasadam Distribution Counter Block B',
    reportedAt: '35 mins ago',
    status: 'REUNITED'
  },
  {
    id: 'LF-884',
    name: 'Black Leather Backpack with Documents',
    age: 0,
    type: 'ITEM',
    description: 'Contains train tickets, Aadhaar card, and medicines.',
    lastSeenLocation: 'Footwear Depository Counter #1',
    reportedAt: '1 hour ago',
    status: 'REUNITED'
  }
]

export default function DevoteeSafety() {
  const [sosTriggered, setSosTriggered] = useState(false)
  const [reportTab, setReportTab] = useState<'PERSON' | 'ITEM' | 'NOTICE_BOARD'>('NOTICE_BOARD')
  const [reports, setReports] = useState<LostPersonReport[]>(SAMPLE_REPORTS)

  // Report form state
  const [reportedName, setReportedName] = useState('')
  const [reportedAge, setReportedAge] = useState('')
  const [description, setDescription] = useState('')
  const [lastLocation, setLastLocation] = useState('Gate 2 East Main')
  const [contactPhone, setContactPhone] = useState('')
  const [submissionSuccess, setSubmissionSuccess] = useState(false)

  function handleTriggerSos() {
    setSosTriggered(true)
  }

  function handleCancelSos() {
    setSosTriggered(false)
  }

  function handleSubmitReport(e: React.FormEvent) {
    e.preventDefault()
    if (!reportedName.trim() || !description.trim()) return

    const newReport: LostPersonReport = {
      id: 'LF-' + Math.floor(100 + Math.random() * 900),
      name: reportedName,
      age: Number(reportedAge) || 0,
      type: reportTab === 'PERSON' ? 'CHILD' : 'ITEM',
      description,
      lastSeenLocation: lastLocation,
      reportedAt: 'Just now',
      status: 'SEARCHING'
    }

    setReports([newReport, ...reports])
    setSubmissionSuccess(true)
    setTimeout(() => {
      setSubmissionSuccess(false)
      setReportTab('NOTICE_BOARD')
      setReportedName('')
      setReportedAge('')
      setDescription('')
      setContactPhone('')
    }, 2500)
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#0e1628] border border-rose-500/20 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="badge-pill bg-rose-500/15 text-rose-300 border border-rose-500/30 flex items-center gap-1.5 font-semibold">
              <IconShield size={12} />
              24X7 DEVOTEE SAFETY & ASSISTANCE
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-white font-display">
              Emergency SOS & Lost-and-Found Assistance Desk
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Immediate medical aid, rapid missing family reunification assistance, and police shrine control room support. We are here to keep your sacred pilgrimage safe.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleTriggerSos}
              className="px-6 py-4 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-sm shadow-xl shadow-rose-950/60 border border-rose-400/50 flex items-center gap-2.5 animate-pulse"
            >
              <IconAlert size={20} className="text-white" />
              <span>TRIGGER EMERGENCY SOS</span>
            </button>
          </div>
        </div>
      </div>

      {/* SOS Active Emergency Modal */}
      {sosTriggered && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md bg-[#130b12] border-2 border-rose-500 rounded-2xl p-6 sm:p-7 shadow-2xl text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-rose-600/30 border-2 border-rose-500 text-rose-400 flex items-center justify-center mx-auto animate-bounce">
              <IconAlert size={36} />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono font-bold tracking-widest text-rose-400 uppercase">
                EMERGENCY BEACON ACTIVE
              </span>
              <h2 className="text-xl font-bold text-white font-display">
                Emergency Beacon Dispatched
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Temple Medical Response and Security Officers have been alerted with your current device location. Stay calm and remain at your current point.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-rose-500/30 text-left font-mono text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">BEACON ID:</span>
                <span className="text-rose-400 font-bold">EMERGENCY-SOS-09</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">NEAREST POST:</span>
                <span className="text-white">Gate 2 Medical Team (Est. 90 secs)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">DIRECT LINE:</span>
                <span className="text-amber-400 font-bold">1800-425-4141</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="tel:18004254141"
                className="flex-1 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-2"
              >
                <IconPhoneCall size={16} />
                <span>Call Helpline Now</span>
              </a>
              <button
                onClick={handleCancelSos}
                className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 text-xs font-semibold"
              >
                Cancel SOS
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Emergency Contact Directory Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card-pro p-4 flex items-center gap-3 border border-rose-500/20">
          <div className="w-10 h-10 rounded-xl bg-rose-500/15 text-rose-400 flex items-center justify-center shrink-0">
            <IconPhoneCall size={18} />
          </div>
          <div>
            <div className="text-[10px] font-mono text-slate-400 uppercase">Shrine Control Room</div>
            <div className="text-sm font-bold text-white font-mono">1800-425-4141</div>
          </div>
        </div>

        <div className="card-pro p-4 flex items-center gap-3 border border-amber-500/20">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0">
            <IconShield size={18} />
          </div>
          <div>
            <div className="text-[10px] font-mono text-slate-400 uppercase">Police Shrine Post</div>
            <div className="text-sm font-bold text-white font-mono">100 / 0877-2277777</div>
          </div>
        </div>

        <div className="card-pro p-4 flex items-center gap-3 border border-emerald-500/20">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0">
            <IconRadio size={18} />
          </div>
          <div>
            <div className="text-[10px] font-mono text-slate-400 uppercase">ICU Ambulance 24x7</div>
            <div className="text-sm font-bold text-white font-mono">108 (Toll Free)</div>
          </div>
        </div>

        <div className="card-pro p-4 flex items-center gap-3 border border-amber-500/20">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0">
            <IconUsers size={18} />
          </div>
          <div>
            <div className="text-[10px] font-mono text-slate-400 uppercase">Child Reunification Desk</div>
            <div className="text-sm font-bold text-white font-mono">0877-2233444</div>
          </div>
        </div>
      </div>

      {/* Lost & Found Assistance Section */}
      <div className="card-pro p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
          <div>
            <h3 className="text-base font-bold text-white font-display">
              Lost & Found Assistance Desk
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Report missing children or family members, or submit details of misplaced valuables to notify all gate officers.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-white/[0.08] text-xs">
            <button
              onClick={() => setReportTab('NOTICE_BOARD')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                reportTab === 'NOTICE_BOARD' ? 'bg-amber-500 text-[#1a1612] font-bold shadow-md shadow-amber-500/20' : 'text-slate-400 hover:text-white'
              }`}
            >
              Public Notices ({reports.length})
            </button>
            <button
              onClick={() => setReportTab('PERSON')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                reportTab === 'PERSON' ? 'bg-amber-500 text-[#1a1612] font-bold shadow-md shadow-amber-500/20' : 'text-slate-400 hover:text-white'
              }`}
            >
              + Report Missing Person
            </button>
            <button
              onClick={() => setReportTab('ITEM')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                reportTab === 'ITEM' ? 'bg-amber-500 text-[#1a1612] font-bold shadow-md shadow-amber-500/20' : 'text-slate-400 hover:text-white'
              }`}
            >
              + Report Lost Valuables
            </button>
          </div>
        </div>

        {/* Tab 1: Live Public Notices Board */}
        {reportTab === 'NOTICE_BOARD' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reports.map(r => (
              <div
                key={r.id}
                className={`p-4 rounded-xl border space-y-3 ${
                  r.status === 'SEARCHING'
                    ? 'bg-rose-500/10 border-rose-500/30'
                    : 'bg-emerald-500/10 border-emerald-500/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-black/40 text-slate-300">
                    REF: {r.id}
                  </span>
                  <span
                    className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                      r.status === 'SEARCHING'
                        ? 'bg-rose-500 text-white animate-pulse'
                        : 'bg-emerald-500 text-slate-950 font-bold'
                    }`}
                  >
                    {r.status}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white font-display">
                    {r.name} {r.age > 0 && `(${r.age} yrs)`}
                  </h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {r.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>Last Seen: {r.lastSeenLocation}</span>
                  <span>{r.reportedAt}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2 & 3: Report Submission Form */}
        {(reportTab === 'PERSON' || reportTab === 'ITEM') && (
          <form onSubmit={handleSubmitReport} className="max-w-xl mx-auto space-y-4">
            {submissionSuccess ? (
              <div className="p-6 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
                  <IconCheck size={24} />
                </div>
                <h4 className="text-base font-bold text-white font-display">
                  Report Registered & Broadcasted to Security
                </h4>
                <p className="text-xs text-slate-300">
                  Temple Gate officers, PA announcement booth, and patrol staff have received the notification.
                </p>
              </div>
            ) : (
              <>
                <div className="text-center pb-2">
                  <h4 className="text-base font-bold text-white font-display">
                    {reportTab === 'PERSON' ? 'Report Missing Family Member or Child' : 'Report Lost Belonging / Valuables'}
                  </h4>
                  <p className="text-xs text-slate-400">
                    Details will be transmitted immediately to temple security turnstiles and announcements.
                  </p>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      {reportTab === 'PERSON' ? 'Full Name of Missing Person *' : 'Description of Item *'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={reportTab === 'PERSON' ? 'e.g. Sumanth Kumar' : 'e.g. Blue backpack with documents'}
                      value={reportedName}
                      onChange={e => setReportedName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30"
                    />
                  </div>

                  {reportTab === 'PERSON' && (
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        Age (Years)
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 8"
                        value={reportedAge}
                        onChange={e => setReportedAge(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Clothing / Distinguishing Details *
                    </label>
                    <textarea
                      rows={3}
                      required
                      placeholder="e.g. Wearing blue t-shirt and grey shorts, speaks Hindi, wearing red thread on wrist..."
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        Last Known Location
                      </label>
                      <select
                        value={lastLocation}
                        onChange={e => setLastLocation(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30"
                      >
                        <option value="Gate 1 West Entry">Gate 1 West Entry</option>
                        <option value="Gate 2 East Main">Gate 2 East Main</option>
                        <option value="Gate 3 South Express">Gate 3 South Express</option>
                        <option value="Prasadam Hall">Prasadam Hall</option>
                        <option value="Footwear Stand #1">Footwear Stand #1</option>
                        <option value="Sanctum Queue Corridor">Sanctum Queue Corridor</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        Your Contact Phone *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={contactPhone}
                        onChange={e => setContactPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setReportTab('NOTICE_BOARD')}
                    className="btn-secondary text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary text-xs flex items-center gap-1.5"
                  >
                    <IconAlert size={14} />
                    <span>Submit & Notify All Officers</span>
                  </button>
                </div>
              </>
            )}
          </form>
        )}
      </div>
    </div>
  )
}
