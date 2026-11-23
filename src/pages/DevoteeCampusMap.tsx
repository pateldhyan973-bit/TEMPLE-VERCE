import { useState } from 'react'
import {
  IconCompass,
  IconMap,
  IconCheck,
  IconClock,
  IconSparkles,
  IconTemple,
  IconShield,
  IconUsers,
  IconRoute
} from '../components/Icons'

interface AmenityPoint {
  id: string
  name: string
  category: 'PRASADAM' | 'FOOTWEAR' | 'CLOAKROOM' | 'WATER' | 'MEDICAL' | 'RESTROOM' | 'ACCESSIBILITY'
  location: string
  distanceMeters: number
  walkTimeMins: number
  queueStatus: 'FAST' | 'MODERATE' | 'BUSY'
  operatingHours: string
  description: string
  coordinates: { x: number; y: number }
}

const AMENITIES_DATA: AmenityPoint[] = [
  {
    id: 'p1',
    name: 'Maha Prasadam Distribution Center',
    category: 'PRASADAM',
    location: 'Adjacent to East Gopuram Exit, Block B',
    distanceMeters: 120,
    walkTimeMins: 2,
    queueStatus: 'FAST',
    operatingHours: '06:00 AM - 10:30 PM',
    description: 'Fresh Tirupati sacred Laddoo tokens and divine Annaprasadam dining halls.',
    coordinates: { x: 72, y: 35 }
  },
  {
    id: 'f1',
    name: 'Complimentary Footwear Depository #1',
    category: 'FOOTWEAR',
    location: 'West Entry Gate Complex G1',
    distanceMeters: 45,
    walkTimeMins: 1,
    queueStatus: 'FAST',
    operatingHours: '24 Hours Open',
    description: 'Safe computerized token-based shoe stands with dedicated barcode lockers.',
    coordinates: { x: 25, y: 65 }
  },
  {
    id: 'c1',
    name: 'Luggage & Mobile Phone Cloakroom',
    category: 'CLOAKROOM',
    location: 'Central Plaza, Opposite Main Pilgrim Queue',
    distanceMeters: 80,
    walkTimeMins: 2,
    queueStatus: 'MODERATE',
    operatingHours: '04:30 AM - 11:30 PM',
    description: 'Secure biometric deposit for cameras, mobile phones, and oversized pilgrim luggage.',
    coordinates: { x: 40, y: 75 }
  },
  {
    id: 'w1',
    name: 'Chilled RO Drinking Water Station #4',
    category: 'WATER',
    location: 'Inner Sanctum Perambulation Corridor',
    distanceMeters: 30,
    walkTimeMins: 1,
    queueStatus: 'FAST',
    operatingHours: 'Continuous 24x7',
    description: 'Hygienic multi-stage UV/RO purified water dispensers with disposable paper cups.',
    coordinates: { x: 50, y: 48 }
  },
  {
    id: 'm1',
    name: '24x7 Emergency Medical Aid & ICU Booth',
    category: 'MEDICAL',
    location: 'Gate 2 Medical Center Annex',
    distanceMeters: 110,
    walkTimeMins: 2,
    queueStatus: 'FAST',
    operatingHours: '24x7 Emergency',
    description: 'Staffed by senior paramedics, emergency defibrillators, wheelchairs, and rapid transport.',
    coordinates: { x: 82, y: 60 }
  },
  {
    id: 'r1',
    name: 'Modern Restroom & Sanitation Complex',
    category: 'RESTROOM',
    location: 'South Quadrangle, Wing 3',
    distanceMeters: 150,
    walkTimeMins: 3,
    queueStatus: 'MODERATE',
    operatingHours: 'Continuous Cleaning',
    description: 'Clean sanitized restrooms, baby care feeding room, and disabled-friendly accessible toilets.',
    coordinates: { x: 45, y: 88 }
  },
  {
    id: 'a1',
    name: 'Senior Citizen & Specially Abled Buggy Stand',
    category: 'ACCESSIBILITY',
    location: 'Direct Drop-Off Gate 3',
    distanceMeters: 60,
    walkTimeMins: 1,
    queueStatus: 'FAST',
    operatingHours: '05:00 AM - 10:00 PM',
    description: 'Free electric golf carts and wheelchair assistants directly to sanctum queue ramp.',
    coordinates: { x: 28, y: 38 }
  }
]

export default function DevoteeCampusMap() {
  const [filter, setFilter] = useState<string>('ALL')
  const [selectedPoint, setSelectedPoint] = useState<AmenityPoint>(AMENITIES_DATA[0])

  const filteredAmenities = AMENITIES_DATA.filter(item => {
    if (filter === 'ALL') return true
    return item.category === filter
  })

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#181512] border border-white/[0.08] shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="badge-pill bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 font-semibold">
              <IconCompass size={12} />
              DEVOTEE CAMPUS NAVIGATION
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#fbf9f5] font-display">
              Sacred Campus Guide & Amenities Map
            </h1>
            <p className="text-sm text-[#d6cebf] max-w-2xl leading-relaxed">
              Locate complimentary shoe stands, pure RO drinking water kiosks, free Prasadam distribution halls, cloakrooms, and medical first-aid stations with live walking distances.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                const w = AMENITIES_DATA.find(a => a.category === 'WATER')
                if (w) setSelectedPoint(w)
              }}
              className="px-3.5 py-2 rounded-xl bg-[#25201b] text-[#d6cebf] border border-white/10 text-xs font-semibold hover:border-amber-500/40 transition-colors"
            >
              💧 Nearest Water
            </button>
            <button
              onClick={() => {
                const p = AMENITIES_DATA.find(a => a.category === 'PRASADAM')
                if (p) setSelectedPoint(p)
              }}
              className="px-3.5 py-2 rounded-xl bg-amber-500/15 text-amber-300 border border-amber-500/30 text-xs font-semibold hover:bg-amber-500/25 transition-colors"
            >
              Prasadam Counter
            </button>
            <button
              onClick={() => {
                const m = AMENITIES_DATA.find(a => a.category === 'MEDICAL')
                if (m) setSelectedPoint(m)
              }}
              className="px-3.5 py-2 rounded-xl bg-rose-500/15 text-rose-300 border border-rose-500/30 text-xs font-semibold hover:bg-rose-500/25 transition-colors"
            >
              First Aid Aid
            </button>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
        {[
          { key: 'ALL', label: 'All Campus Amenities' },
          { key: 'PRASADAM', label: 'Prasadam Centers' },
          { key: 'FOOTWEAR', label: 'Shoe / Footwear Stands' },
          { key: 'CLOAKROOM', label: 'Luggage Cloakroom' },
          { key: 'WATER', label: 'RO Drinking Water' },
          { key: 'MEDICAL', label: 'Medical & First Aid' },
          { key: 'RESTROOM', label: 'Sanitation Restrooms' },
          { key: 'ACCESSIBILITY', label: 'Wheelchair / Buggy' }
        ].map(cat => (
          <button
            key={cat.key}
            onClick={() => setFilter(cat.key)}
            className={`px-3.5 py-2 rounded-xl font-medium shrink-0 transition-all ${
              filter === cat.key
                ? 'bg-amber-500 text-[#1a1612] font-bold shadow-md shadow-amber-500/20'
                : 'bg-[#181512] text-[#a89f91] hover:text-[#fbf9f5] border border-white/[0.06]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Map & Facility Detail Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Campus Visual Canvas */}
        <div className="lg:col-span-2 space-y-4">
          <div className="card-pro p-6 relative overflow-hidden bg-[#0a101f] border border-white/[0.08] min-h-[460px] flex flex-col justify-between">
            {/* Campus Plan SVG Illustration */}
            <div className="absolute inset-0 opacity-40 pointer-events-none">
              <svg width="100%" height="100%" viewBox="0 0 1000 600" preserveAspectRatio="none">
                {/* Marble courtyard grid */}
                <pattern id="campus-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#campus-grid)" />

                {/* Outer Temple Walls */}
                <rect x="80" y="50" width="840" height="500" rx="20" fill="none" stroke="rgba(245, 158, 11, 0.25)" strokeWidth="6" />

                {/* Inner Sanctum Enclosure */}
                <rect x="360" y="160" width="280" height="240" rx="14" fill="#181512" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 4" />
                <rect x="420" y="210" width="160" height="140" rx="8" fill="#241e17" stroke="#f59e0b" strokeWidth="1.5" />
                <circle cx="500" cy="280" r="28" fill="#f59e0b" fillOpacity="0.15" stroke="#f59e0b" strokeWidth="2" />

                {/* Pathways */}
                <path d="M 120 300 L 420 280" stroke="#d97706" strokeWidth="3" strokeDasharray="6 4" />
                <path d="M 880 300 L 580 280" stroke="#16a34a" strokeWidth="3" strokeDasharray="6 4" />
                <path d="M 500 550 L 500 350" stroke="#f59e0b" strokeWidth="3" strokeDasharray="6 4" />
              </svg>
            </div>

            {/* Interactive Pins Placed on Map */}
            <div className="relative z-10 w-full h-[380px] my-auto">
              {filteredAmenities.map(point => {
                const isSelected = selectedPoint.id === point.id
                return (
                  <button
                    key={point.id}
                    onClick={() => setSelectedPoint(point)}
                    style={{ left: `${point.coordinates.x}%`, top: `${point.coordinates.y}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 transition-all p-2 rounded-xl flex items-center gap-1.5 shadow-xl ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 scale-110 ring-4 ring-amber-400/40 z-30 font-bold'
                        : 'bg-slate-900/90 text-slate-200 border border-white/20 hover:scale-105 z-20'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-mono whitespace-nowrap">{point.name.split(' ')[0]}</span>
                  </button>
                )
              })}

              {/* Central Sanctum Label */}
              <div className="absolute left-1/2 top-[48%] -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                <div className="text-[11px] font-mono uppercase tracking-widest text-amber-400 font-bold bg-slate-950/80 px-2 py-0.5 rounded border border-amber-500/30">
                  SANCTUM GARBHAGRIHA
                </div>
              </div>
            </div>

            {/* Map Legend Footer */}
            <div className="relative z-10 pt-4 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 font-mono">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  West Entry (G1)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  East Main (G2)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-600" />
                  South Express (G3)
                </span>
              </div>
              <div>Click any marker to view directions & wait time</div>
            </div>
          </div>
        </div>

        {/* Right Col: Selected Facility Details Card */}
        <div className="space-y-6">
          <div className="card-pro p-6 space-y-5 border border-amber-500/25">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <span className="badge-pill bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[10px] font-mono">
                {selectedPoint.category} FACILITY
              </span>
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                <span className="status-dot status-dot-emerald" />
                {selectedPoint.operatingHours}
              </span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white font-display">
                {selectedPoint.name}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {selectedPoint.location}
              </p>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3.5 rounded-xl border border-white/[0.06]">
              {selectedPoint.description}
            </p>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/[0.05]">
                <div className="text-[10px] text-slate-400 font-mono">Distance</div>
                <div className="text-sm font-bold text-white font-mono mt-0.5">
                  {selectedPoint.distanceMeters}m
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/[0.05]">
                <div className="text-[10px] text-slate-400 font-mono">Walk Time</div>
                <div className="text-sm font-bold text-amber-400 font-mono mt-0.5">
                  ~{selectedPoint.walkTimeMins} mins
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/[0.05]">
                <div className="text-[10px] text-slate-400 font-mono">Queue Load</div>
                <div className="text-sm font-bold text-emerald-400 font-mono mt-0.5">
                  {selectedPoint.queueStatus}
                </div>
              </div>
            </div>

            <button
              onClick={() => alert(`Navigating to ${selectedPoint.name}. Follow the illuminated blue floor markers to corridor ${selectedPoint.location}.`)}
              className="w-full btn-primary py-3 text-xs flex items-center justify-center gap-2"
            >
              <IconRoute size={16} />
              <span>Get Step-by-Step Walking Directions</span>
            </button>
          </div>

          {/* Quick Help Card */}
          <div className="card-pro p-5 bg-[#0e1628] border-amber-500/20 space-y-3">
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <IconSparkles size={14} />
              Senior Citizen & Accessibility Guide
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Wheelchairs and free battery-operated buggies are stationed at Gate 3 for seniors aged 65+ and parents with infant strollers. No reservation needed.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
