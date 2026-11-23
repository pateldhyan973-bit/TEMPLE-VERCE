import { useState } from 'react'
import {
  IconHeart,
  IconSparkles,
  IconCheck,
  IconTemple,
  IconShield,
  IconClock,
  IconTicket
} from '../components/Icons'

interface CharityTrust {
  id: string
  title: string
  impact: string
  description: string
  taxBenefit: string
  dailyService: string
}

const CHARITY_TRUSTS: CharityTrust[] = [
  {
    id: 'trust_annadanam',
    title: 'Sri Venkateswara Nitya Annadanam Trust',
    impact: 'Feeds 100,000+ Pilgrims Complimentary Meals Daily',
    description: 'Providing wholesome, sacred, piping-hot Annaprasadam meals, sweet Pongal, and sambar to thousands of visiting pilgrims every day at Tarigonda Vengamamba complex.',
    taxBenefit: '100% Tax Exemption under Sec 80G',
    dailyService: 'Continuous Annadanam from 09:00 AM to 11:00 PM'
  },
  {
    id: 'trust_pranadana',
    title: 'Sri Venkateswara Pranadana Trust',
    impact: 'Free Life-Saving Surgeries for Needy Patients',
    description: 'Funding free advanced open-heart surgeries, pediatric organ transplants, kidney dialysis, and oncology treatments for underprivileged children and families.',
    taxBenefit: '100% Tax Exemption under Sec 80G',
    dailyService: 'Over 14,000 free operations completed to date'
  },
  {
    id: 'trust_goshala',
    title: 'Sri Venkateswara Gosamrakshana Trust',
    impact: 'Sanctuary & Healthcare for 3,500+ Sacred Cows',
    description: 'Dedicated to sheltering, feeding, and medical care of native Indian indigenous cow breeds (Gir, Ongole, Sahiwal, Kapila) providing pure milk for sanctum Abhishekam.',
    taxBenefit: '50% Tax Exemption under Sec 80G',
    dailyService: 'Green fodder, organic nutrition, and dedicated veterinary hospital'
  },
  {
    id: 'trust_veda',
    title: 'SV Veda Parirakshana & Heritage Trust',
    impact: 'Sponsoring Vedic Gurukuls & Sanskrit Scholars',
    description: 'Preserving our sacred millennium-old oral Vedic chanting traditions, supporting young Vedic students and providing lifelong pensions to elderly scholars.',
    taxBenefit: '100% Tax Exemption under Sec 80G',
    dailyService: 'Educating 1,200 Vedapathashala students across the nation'
  }
]

export default function DevoteeDonations() {
  const [selectedTrust, setSelectedTrust] = useState<CharityTrust>(CHARITY_TRUSTS[0])
  const [amount, setAmount] = useState<number>(1116)
  const [donorName, setDonorName] = useState('')
  const [donorPan, setDonorPan] = useState('')
  const [prayerDedication, setPrayerDedication] = useState('')
  const [donationReceipt, setDonationReceipt] = useState<any | null>(null)

  function handleCompleteOffering(e: React.FormEvent) {
    e.preventDefault()
    if (!donorName.trim() || !amount) return

    const receiptRef = 'HUNDI-' + Math.random().toString(36).substring(2, 8).toUpperCase()
    const newReceipt = {
      id: receiptRef,
      trustName: selectedTrust.title,
      donor: donorName,
      pan: donorPan || 'NOT PROVIDED',
      amount: `₹${amount.toLocaleString()}`,
      dedication: prayerDedication || 'Prayers for family peace and health',
      date: new Date().toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' }),
      certificateNo: '80G-SV-' + Math.floor(100000 + Math.random() * 900000)
    }

    setDonationReceipt(newReceipt)
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#0e1628] border border-amber-500/20 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-2 max-w-2xl">
          <span className="badge-pill bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 font-semibold">
            <IconHeart size={12} />
            SACRED CHARITY & E-HUNDI
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-display">
            Divine e-Hundi & Charitable Trusts
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Support the monumental Sri Venkateswara Nitya Annadanam free feeding trust, life-saving medical surgeries, and sacred cow sanctuaries. Receive instant 80G tax exemption receipts.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Trust Selection & Contribution Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Trust Selector Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CHARITY_TRUSTS.map(trust => {
              const isSelected = selectedTrust.id === trust.id
              return (
                <button
                  key={trust.id}
                  type="button"
                  onClick={() => setSelectedTrust(trust)}
                  className={`card-pro p-5 text-left border transition-all flex flex-col justify-between space-y-3 ${
                    isSelected
                      ? 'border-amber-400 bg-amber-500/10 ring-2 ring-amber-400/20 shadow-lg shadow-amber-500/10'
                      : 'border-white/[0.08] bg-slate-900/60 hover:border-white/20'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 uppercase">
                        {trust.taxBenefit}
                      </span>
                      {isSelected && <IconCheck size={16} className="text-amber-400" />}
                    </div>
                    <h3 className="text-sm font-bold text-white font-display">
                      {trust.title}
                    </h3>
                    <p className="text-xs text-amber-300 font-semibold">
                      {trust.impact}
                    </p>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {trust.description}
                  </p>
                </button>
              )
            })}
          </div>

          {/* Contribution Form */}
          <div className="card-pro p-6 border border-white/[0.08] space-y-5">
            <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
              <IconSparkles size={16} className="text-amber-400" />
              Sacred Offering to {selectedTrust.title}
            </h3>

            <form onSubmit={handleCompleteOffering} className="space-y-5">
              {/* Presets */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Select Offering Amount
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {[501, 1116, 2500, 5100, 11000, 25000].map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setAmount(val)}
                      className={`py-2 rounded-xl text-xs font-mono font-bold transition-all border ${
                        amount === val
                          ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                          : 'bg-slate-900 text-slate-300 border-white/10 hover:border-white/20'
                      }`}
                    >
                      ₹{val.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Devotee / Donor Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Radhakrishnan Pillai"
                    value={donorName}
                    onChange={e => setDonorName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    PAN Card Number (For 80G Tax Exemption)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ABCDE1234F"
                    value={donorPan}
                    onChange={e => setDonorPan(e.target.value.toUpperCase())}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-500 font-mono uppercase focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-300 font-semibold mb-1">
                  Prayer Dedication / Sankalpam (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. For our daughter's health and successful graduation"
                  value={prayerDedication}
                  onChange={e => setPrayerDedication(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <button
                type="submit"
                className="w-full btn-primary py-3 text-xs flex items-center justify-center gap-2 font-bold"
              >
                <IconHeart size={16} />
                <span>Offer Sacred e-Hundi Contribution (₹{amount.toLocaleString()})</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right Col: Instant Digital Receipt & Tax Certificate */}
        <div className="space-y-6">
          {donationReceipt ? (
            <div className="card-pro p-6 bg-[#0c1527] border-2 border-amber-400/60 shadow-2xl space-y-4 text-center animate-fade-in">
              <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center mx-auto">
                <IconTemple size={26} />
              </div>

              <div>
                <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest block">
                  OFFICIAL HUNDI RECEIPT
                </span>
                <h3 className="text-base font-bold text-white font-display mt-0.5">
                  Blessings Bestowed
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Thank you for your sacred contribution. May Lord Srinivasa bless your household with peace and prosperity.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-white/10 text-left font-mono space-y-2 text-xs">
                <div className="flex justify-between border-b border-white/[0.08] pb-1.5">
                  <span className="text-slate-400">RECEIPT NO:</span>
                  <span className="text-amber-400 font-bold">{donationReceipt.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">AMOUNT:</span>
                  <span className="text-emerald-400 font-bold text-sm">{donationReceipt.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">DONOR:</span>
                  <span className="text-white">{donationReceipt.donor}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">TRUST:</span>
                  <span className="text-white text-[11px] truncate">{donationReceipt.trustName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">80G CERT:</span>
                  <span className="text-white">{donationReceipt.certificateNo}</span>
                </div>
              </div>

              <button
                onClick={() => window.print()}
                className="w-full btn-secondary py-2 text-xs flex items-center justify-center gap-1.5"
              >
                <span>Print Tax Exemption Certificate</span>
              </button>
            </div>
          ) : (
            <div className="card-pro p-6 bg-[#0c1424] border border-white/[0.08] space-y-4">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <IconSparkles size={14} />
                Transparency & Accountability
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                100% of all contributions are audited annually by the State Audit Department and Comptroller & Auditor General. All donations qualify for direct tax exemptions under Income Tax Section 80G.
              </p>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/[0.05] text-[11px] font-mono text-slate-400 space-y-1">
                <div>• Zero administrative deduction</div>
                <div>• Digital computerized acknowledgment</div>
                <div>• Official Prasad sent via registered post</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
