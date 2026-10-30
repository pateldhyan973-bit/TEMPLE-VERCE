import { useState } from 'react'
import {
  IconBuilding,
  IconClock,
  IconCheck,
  IconSparkles,
  IconUsers,
  IconTicket,
  IconShield
} from '../components/Icons'

interface GuestHouse {
  id: string
  name: string
  location: string
  type: 'AC_SUITE' | 'NON_AC' | 'DORMITORY' | 'FAMILY_COTTAGE'
  availableRooms: number
  totalRooms: number
  tariff: string
  amenities: string[]
  distanceToShrine: string
  status: 'AVAILABLE' | 'FEW_LEFT' | 'FULL'
}

const GUEST_HOUSES: GuestHouse[] = [
  {
    id: 'gh_srinivasam',
    name: 'Srinivasam Pilgrim Amenities Complex',
    location: 'Opposite Central Railway Station',
    type: 'NON_AC',
    availableRooms: 142,
    totalRooms: 1200,
    tariff: '₹200 / 24 Hours',
    amenities: ['Attached bathroom', '24hr Hot water geyser', 'Elevator', 'Safe locker hall'],
    distanceToShrine: '12 mins by free electric bus',
    status: 'AVAILABLE'
  },
  {
    id: 'gh_madhavam',
    name: 'Madhavam Deluxe Rest House',
    location: 'Adjacent to Central Bus Stand',
    type: 'AC_SUITE',
    availableRooms: 34,
    totalRooms: 800,
    tariff: '₹800 / 24 Hours',
    amenities: ['Split AC', 'LED TV with devotional channels', 'Free WiFi', 'Room service'],
    distanceToShrine: '15 mins by free electric bus',
    status: 'FEW_LEFT'
  },
  {
    id: 'gh_vishnu',
    name: 'Vishnu Nivasam Complex',
    location: 'Front of Railway Station Platform 1',
    type: 'AC_SUITE',
    availableRooms: 68,
    totalRooms: 1000,
    tariff: '₹600 / 24 Hours',
    amenities: ['Air conditioned', 'Complimentary luggage cloakroom', 'Pure vegetarian canteen'],
    distanceToShrine: '10 mins by express shuttle',
    status: 'AVAILABLE'
  },
  {
    id: 'gh_dorm',
    name: 'Free Pilgrim Dormitory & Locker Halls',
    location: 'Hilltop Complex, Vaikuntham Gate',
    type: 'DORMITORY',
    availableRooms: 420,
    totalRooms: 2500,
    tariff: 'COMPLIMENTARY / FREE',
    amenities: ['Steel locker per pilgrim', 'Clean common showers', 'Continuous security', 'RO water'],
    distanceToShrine: 'Direct walking ramp (2 mins)',
    status: 'AVAILABLE'
  }
]

export default function DevoteeAccommodation() {
  const [filter, setFilter] = useState<string>('ALL')
  const [selectedHouse, setSelectedHouse] = useState<GuestHouse | null>(null)
  const [guestName, setGuestName] = useState('')
  const [idNumber, setIdNumber] = useState('')
  const [guestCount, setGuestCount] = useState('2')
  const [bookingSuccess, setBookingSuccess] = useState<any | null>(null)

  const filteredHouses = GUEST_HOUSES.filter(h => {
    if (filter === 'ALL') return true
    return h.type === filter
  })

  function handleBookRoom(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedHouse || !guestName.trim()) return

    const bookingRef = 'ROOM-' + Math.random().toString(36).substring(2, 8).toUpperCase()
    const roomNum = Math.floor(100 + Math.random() * 800)

    const newBooking = {
      id: bookingRef,
      guestHouseName: selectedHouse.name,
      roomNumber: `Room ${roomNum}`,
      name: guestName,
      idNumber: idNumber || 'Aadhaar Verified',
      tariff: selectedHouse.tariff,
      guests: guestCount,
      checkIn: 'Today 12:00 PM (24 Hours Valid)',
      createdAt: new Date().toISOString()
    }

    // Persist to wallet
    const existing = JSON.parse(localStorage.getItem('temple_pilgrim_passes') || '[]')
    existing.unshift({
      id: bookingRef,
      name: guestName,
      gate: selectedHouse.name,
      slot: `Room ${roomNum} • ${selectedHouse.tariff}`,
      partySize: Number(guestCount) || 1,
      type: 'ROOM_ALLOTMENT',
      sevaName: selectedHouse.name,
      createdAt: new Date().toISOString()
    })
    localStorage.setItem('temple_pilgrim_passes', JSON.stringify(existing))

    setBookingSuccess(newBooking)
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#181512] border border-white/[0.08] shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="badge-pill bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 font-semibold">
              <IconBuilding size={12} />
              PILGRIM REST HOUSES & COTTAGES
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#fbf9f5] font-display">
              Devotee Accommodation & Room Allotment
            </h1>
            <p className="text-sm text-[#d6cebf] max-w-2xl leading-relaxed">
              Official temple rest houses, subsidized AC suites, donor family cottages, and free locker dormitory complexes with real-time room vacancy and instant allotment slips.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#141210] border border-white/10 text-center">
            <div className="text-[10px] font-mono text-[#a89f91] uppercase">Available Rooms Now</div>
            <div className="text-2xl font-bold text-emerald-400 font-mono mt-0.5">
              664 Vacant
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {[
          { key: 'ALL', label: 'All Rest Houses' },
          { key: 'AC_SUITE', label: 'AC Deluxe Suites' },
          { key: 'NON_AC', label: 'Standard Non-AC' },
          { key: 'DORMITORY', label: 'Free Locker Dormitories' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${
              filter === tab.key
                ? 'bg-amber-500 text-[#1a1612] font-bold shadow-md shadow-amber-500/20'
                : 'bg-[#181512] text-[#a89f91] hover:text-[#fbf9f5] border border-white/[0.06]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Guest House Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredHouses.map(gh => (
          <div
            key={gh.id}
            className="card-pro p-6 flex flex-col justify-between border border-white/[0.08] hover:border-amber-500/40 transition-all space-y-5"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 uppercase">
                  {gh.tariff}
                </span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                    gh.status === 'FEW_LEFT'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}
                >
                  {gh.availableRooms} Rooms Vacant
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#fbf9f5] font-display">
                  {gh.name}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {gh.location} • {gh.distanceToShrine}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/[0.06]">
                {gh.amenities.map((am, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-xs text-slate-300">
                    <IconCheck size={12} className="text-emerald-400 shrink-0" />
                    <span>{am}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between gap-3">
              <div className="text-xs text-slate-400 font-mono">
                24-Hour Check-in Allowed
              </div>

              <button
                onClick={() => {
                  setSelectedHouse(gh)
                  setBookingSuccess(null)
                }}
                className="btn-primary py-2 px-4 text-xs flex items-center gap-1.5"
              >
                <IconTicket size={14} />
                <span>Reserve Room</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Form Modal */}
      {selectedHouse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md bg-[#181512] border border-amber-500/30 rounded-2xl p-6 sm:p-7 shadow-2xl space-y-5">
            {!bookingSuccess ? (
              <form onSubmit={handleBookRoom} className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                  <div>
                    <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider">
                      INSTANT ROOM ALLOTMENT
                    </span>
                    <h3 className="text-base font-bold text-[#fbf9f5] font-display mt-0.5">
                      {selectedHouse.name}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedHouse(null)}
                    className="p-1 rounded text-[#a89f91] hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-[#d6cebf] font-semibold mb-1">
                      Primary Devotee Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Anand Sharma"
                      value={guestName}
                      onChange={e => setGuestName(e.target.value)}
                      className="input-pro text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#d6cebf] font-semibold mb-1">
                        Aadhaar / ID Number
                      </label>
                      <input
                        type="text"
                        placeholder="Last 4 digits e.g. 8492"
                        value={idNumber}
                        onChange={e => setIdNumber(e.target.value)}
                        className="input-pro text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[#d6cebf] font-semibold mb-1">
                        Number of Guests
                      </label>
                      <select
                        value={guestCount}
                        onChange={e => setGuestCount(e.target.value)}
                        className="input-pro text-xs"
                      >
                        <option value="1">1 Person</option>
                        <option value="2">2 Persons</option>
                        <option value="4">4 Persons (Family)</option>
                        <option value="6">6 Persons (Suite)</option>
                      </select>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#141210] border border-white/[0.05] space-y-1 text-[#d6cebf]">
                    <div className="flex justify-between">
                      <span className="text-[#a89f91]">Subsidized Tariff:</span>
                      <span className="font-mono text-emerald-400 font-bold">{selectedHouse.tariff}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#a89f91]">Caution Deposit:</span>
                      <span className="font-mono text-white">Refundable ₹500 at key return</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/[0.08]">
                  <button
                    type="button"
                    onClick={() => setSelectedHouse(null)}
                    className="btn-secondary text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary text-xs flex items-center gap-1.5"
                  >
                    <IconCheck size={14} />
                    <span>Confirm Allotment</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
                  <IconCheck size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#fbf9f5] font-display">
                    Room Allotment Confirmed!
                  </h3>
                  <p className="text-xs text-[#d6cebf] mt-1">
                    Your key receipt has been generated and saved to your Devotee Wallet.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#141210] border border-amber-500/30 text-left font-mono space-y-2 text-xs">
                  <div className="flex justify-between border-b border-white/[0.08] pb-2">
                    <span className="text-[#a89f91]">ALLOTMENT REF:</span>
                    <span className="text-amber-400 font-bold">{bookingSuccess.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#a89f91]">REST HOUSE:</span>
                    <span className="text-[#fbf9f5]">{bookingSuccess.guestHouseName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#a89f91]">ASSIGNED ROOM:</span>
                    <span className="text-amber-400 font-bold">{bookingSuccess.roomNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#a89f91]">DEVOTEE:</span>
                    <span className="text-[#fbf9f5]">{bookingSuccess.name} ({bookingSuccess.guests} Guests)</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setSelectedHouse(null)}
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
