import { useState } from 'react'
import {
  IconGift,
  IconSparkles,
  IconCheck,
  IconClock,
  IconTemple,
  IconUsers,
  IconTicket,
  IconQrCode
} from '../components/Icons'

interface SevaItem {
  id: string
  title: string
  category: 'DAILY_SEVA' | 'SPECIAL_POOJA' | 'PRASADAM'
  timing: string
  offering: string
  includes: string[]
  devoteesAllowed: number
  price: string
  badge: string
  description: string
}

const SEVA_CATALOG: SevaItem[] = [
  {
    id: 'seva_suprabhatam',
    title: 'Suprabhata Seva',
    category: 'DAILY_SEVA',
    timing: '05:00 AM Daily',
    offering: 'Sacred Dawn Hymn Awakening',
    includes: ['Sanctum front row seating', '2 Special Temple Laddoos', 'Blessed Silk Angavastram'],
    devoteesAllowed: 2,
    price: 'Complimentary / Token',
    badge: 'MOST SACRED',
    description: 'Awaken the Lord with celestial Sanskrit hymns recited by Hereditary Temple Priests.'
  },
  {
    id: 'seva_kalyanam',
    title: 'Sri Srinivasa Kalyanotsavam',
    category: 'SPECIAL_POOJA',
    timing: '10:30 AM Daily',
    offering: 'Divine Celestial Wedding',
    includes: ['Full wedding Sankalpam', 'Pooja Akshata & Raksha', '4 Big Laddoos + 2 Vadas', 'Silver Coin Souvenir'],
    devoteesAllowed: 2,
    price: 'Devotional Contribution',
    badge: 'FAMILY BLESSING',
    description: 'Auspicious celestial marriage ritual performed for harmony, prosperity, and family well-being.'
  },
  {
    id: 'seva_archana',
    title: 'Sahasranama Archana',
    category: 'DAILY_SEVA',
    timing: '07:30 AM & 04:30 PM',
    offering: '1008 Holy Tulasi Petal Worship',
    includes: ['Devotee Gotram recitation', 'Blessed Kumkum & Prasadam packet', 'Direct Sanctum view'],
    devoteesAllowed: 1,
    price: 'Token Reservation',
    badge: 'POPULAR',
    description: 'Chanting of the 1,008 sacred names of the Lord accompanied by fragrant golden flowers.'
  },
  {
    id: 'prasad_laddoo',
    title: 'Special Pure Ghee Temple Laddoo (Box of 4)',
    category: 'PRASADAM',
    timing: 'Collection: 07:00 AM - 09:30 PM',
    offering: 'GI-Tagged Divine Confection',
    includes: ['Prepared with pure Cow Ghee', 'Cardamom, Cashews & Raisins', 'Express Pickup Counter G2'],
    devoteesAllowed: 1,
    price: 'Tokens Allocated',
    badge: 'SACRED TASTE',
    description: 'The world-famous sacred Laddoo consecrated inside the sacred temple kitchen (Potu).'
  },
  {
    id: 'prasad_panchamritam',
    title: 'Holy Panchamritam & Vada Prasadam',
    category: 'PRASADAM',
    timing: 'Collection: 09:00 AM - 08:00 PM',
    offering: 'Pure Honey & Fruit Nectar',
    includes: ['Air-tight sealed sacred jar', '2 Traditional Savory Vadas', 'Direct Counter Express Turnstile'],
    devoteesAllowed: 1,
    price: 'Tokens Allocated',
    badge: 'HEALTH & DEVOTION',
    description: 'Sacred mixture of pure mountain honey, ghee, dates, and cardamom blessed during Abhishekam.'
  }
]

export default function DevoteeSevas() {
  const [activeTab, setActiveTab] = useState<'ALL' | 'DAILY_SEVA' | 'SPECIAL_POOJA' | 'PRASADAM'>('ALL')
  const [selectedSeva, setSelectedSeva] = useState<SevaItem | null>(null)
  const [devoteeName, setDevoteeName] = useState('')
  const [gotram, setGotram] = useState('')
  const [nakshatram, setNakshatram] = useState('Rohini')
  const [bookingSuccess, setBookingSuccess] = useState<any | null>(null)

  const filteredItems = SEVA_CATALOG.filter(item => {
    if (activeTab === 'ALL') return true
    return item.category === activeTab
  })

  function handleConfirmBooking(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedSeva || !devoteeName.trim()) return

    const bookingId = 'SEVA-' + Math.random().toString(36).substring(2, 8).toUpperCase()
    const newBooking = {
      id: bookingId,
      sevaTitle: selectedSeva.title,
      name: devoteeName,
      gotram: gotram || 'Kashyapa',
      nakshatram,
      timing: selectedSeva.timing,
      createdAt: new Date().toISOString(),
      qrCode: `SEVA:${bookingId}:${devoteeName}`,
    }

    // Persist to local devotee wallet
    const existing = JSON.parse(localStorage.getItem('temple_pilgrim_passes') || '[]')
    existing.unshift({
      id: bookingId,
      name: devoteeName,
      gate: 'Seva Pavilion / Gate 2',
      slot: selectedSeva.timing,
      partySize: selectedSeva.devoteesAllowed,
      type: selectedSeva.category === 'PRASADAM' ? 'PRASADAM' : 'SEVA',
      sevaName: selectedSeva.title,
      createdAt: new Date().toISOString()
    })
    localStorage.setItem('temple_pilgrim_passes', JSON.stringify(existing))

    setBookingSuccess(newBooking)
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#0e1628] border border-amber-500/20 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-2 max-w-2xl">
          <span className="badge-pill bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 font-semibold">
            <IconGift size={12} />
            SACRED SEVAS & PRASADAM
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-display">
            Special Sevas, Poojas & Sacred Prasadam
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Reserve auspicious daily Seva tickets, perform special family Poojas with priest Gotram recitation, and pre-order sacred Temple Laddoos with priority pickup tokens.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {[
          { key: 'ALL', label: 'All Offerings' },
          { key: 'DAILY_SEVA', label: 'Daily Sevas' },
          { key: 'SPECIAL_POOJA', label: 'Kalyanam & Poojas' },
          { key: 'PRASADAM', label: 'Sacred Prasadam' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${
              activeTab === tab.key
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-white/[0.06]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Seva Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map(item => (
          <div
            key={item.id}
            className="card-pro p-6 flex flex-col justify-between border border-white/[0.08] hover:border-amber-500/40 transition-all hover:translate-y-[-2px] space-y-5"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 uppercase">
                  {item.badge}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {item.timing}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-white font-display">
                  {item.title}
                </h3>
                <p className="text-xs text-amber-400/90 font-medium mt-0.5">
                  {item.offering}
                </p>
              </div>

              {item.category === 'PRASADAM' && (
                <div className="rounded-xl overflow-hidden h-36 relative border border-amber-500/20 shadow-md">
                  <img
                    src="/assets/temple_laddoo.jpg"
                    alt={item.title}
                    className="w-full h-full object-cover object-center filter brightness-95 contrast-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <span className="absolute bottom-2 left-2 text-[10px] font-mono px-2 py-0.5 rounded bg-black/70 text-amber-300 font-bold border border-amber-500/30">
                    Potu Consecrated Prasadam
                  </span>
                </div>
              )}

              <p className="text-xs text-slate-300 leading-relaxed">
                {item.description}
              </p>

              <div className="space-y-1.5 pt-2 border-t border-white/[0.06]">
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                  Blessings Included:
                </div>
                {item.includes.map((inc, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                    <IconCheck size={13} className="text-emerald-400 shrink-0" />
                    <span>{inc}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between gap-3">
              <div>
                <div className="text-[10px] text-slate-400 font-mono">Devotees Allowed</div>
                <div className="text-xs font-bold text-white font-mono">
                  Up to {item.devoteesAllowed} Persons
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedSeva(item)
                  setBookingSuccess(null)
                }}
                className="btn-primary py-2 px-3.5 text-xs flex items-center gap-1.5"
              >
                <IconTicket size={14} />
                <span>Book Slot</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Form Modal */}
      {selectedSeva && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg bg-[#0d1527] border border-amber-500/30 rounded-2xl p-6 sm:p-7 shadow-2xl space-y-5">
            {!bookingSuccess ? (
              <form onSubmit={handleConfirmBooking} className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                  <div>
                    <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider">
                      RESERVE SEVA OR PRASADAM
                    </span>
                    <h3 className="text-base font-bold text-white font-display mt-0.5">
                      {selectedSeva.title}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedSeva(null)}
                    className="p-1 rounded text-slate-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Primary Devotee Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Chandra Sharma"
                      value={devoteeName}
                      onChange={e => setDevoteeName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        Devotee Gotram
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Kashyapa / Bharadwaja"
                        value={gotram}
                        onChange={e => setGotram(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        Janma Nakshatram
                      </label>
                      <select
                        value={nakshatram}
                        onChange={e => setNakshatram(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-amber-400"
                      >
                        {['Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu', 'Pushya', 'Makha', 'Uttara', 'Hasta', 'Swati'].map(n => (
                          <option key={n} value={n}>{n}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/60 border border-white/[0.05] space-y-1 text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Scheduled Time:</span>
                      <span className="font-mono text-white">{selectedSeva.timing}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Admittance:</span>
                      <span className="font-mono text-emerald-400">Direct Express Turnstile</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/[0.08]">
                  <button
                    type="button"
                    onClick={() => setSelectedSeva(null)}
                    className="btn-secondary text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary text-xs flex items-center gap-1.5"
                  >
                    <IconCheck size={14} />
                    <span>Confirm Seva Booking</span>
                  </button>
                </div>
              </form>
            ) : (
              /* Success Confirmation Card */
              <div className="text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
                  <IconCheck size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-display">
                    Seva Booking Confirmed!
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Your sacred reservation token has been saved to your Devotee Wallet.
                  </p>
                </div>

                {/* Digital Token Slip */}
                <div className="p-4 rounded-xl bg-slate-900/90 border border-amber-500/30 text-left font-mono space-y-2 text-xs">
                  <div className="flex justify-between border-b border-white/[0.08] pb-2">
                    <span className="text-slate-400">TOKEN REF:</span>
                    <span className="text-amber-400 font-bold">{bookingSuccess.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">DEVOTEE:</span>
                    <span className="text-white">{bookingSuccess.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">SEVA:</span>
                    <span className="text-white">{bookingSuccess.sevaTitle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">SANKALPAM:</span>
                    <span className="text-white">{bookingSuccess.gotram} / {bookingSuccess.nakshatram}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setSelectedSeva(null)}
                    className="w-full btn-primary py-2.5 text-xs"
                  >
                    Done & View in My Wallet
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
