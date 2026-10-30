import React from 'react'
import {
  IconHome,
  IconMap,
  IconCamera,
  IconBrain,
  IconRoute,
  IconAlert,
  IconBarChart,
  IconBell,
  IconTicket,
  IconShield,
  IconTemple,
  IconX,
  IconChevronRight,
  IconSparkles,
  IconVideo,
  IconGift,
  IconCompass,
  IconTrendingUp,
  IconPhoneCall,
  IconWallet,
  IconLock,
  IconBuilding,
  IconHeart,
  IconBookOpen
} from './Icons'

interface NavBarProps {
  current: string
  role?: 'admin' | 'pilgrim' | 'ADMIN' | 'PILGRIM'
  onRoleChange?: (role: 'admin' | 'pilgrim') => void
  onChange: (page: string) => void
  onOpenAuth?: (initialMode?: 'LOGIN_PILGRIM' | 'REGISTER_PILGRIM' | 'LOGIN_ADMIN') => void
  mobileOpen: boolean
  onMobileClose: () => void
}

interface NavItem {
  id: string
  label: string
  badge?: string
  icon: React.ComponentType<{ size?: number; className?: string; color?: string }>
}

interface NavSection {
  title: string
  items: NavItem[]
}

// ─── Regular Devotee / Pilgrim Navigation (100% Free of any Admin Clutter) ───
const DEVOTEE_NAV_SECTIONS: NavSection[] = [
  {
    title: 'QUEUE & DARSHAN SERVICES',
    items: [
      { id: 'pilgrim', label: 'Darshan Booking & Queue', icon: IconTicket, badge: 'LIVE' },
      { id: 'pilgrim-floor', label: 'Floor & Compartments', icon: IconBuilding, badge: 'FLOORS 1-3' },
      { id: 'pilgrim-live', label: 'Sanctum Webcast & Aarti', icon: IconVideo, badge: 'HD' },
      { id: 'pilgrim-map', label: 'Campus & Amenities Map', icon: IconCompass },
    ]
  },
  {
    title: 'SEVAS, STAY & CHARITY',
    items: [
      { id: 'pilgrim-sevas', label: 'Sevas & Sacred Prasadam', icon: IconGift },
      { id: 'pilgrim-stay', label: 'Rest Houses & Rooms', icon: IconBuilding, badge: 'ROOMS' },
      { id: 'pilgrim-hundi', label: 'Sacred e-Hundi & Trusts', icon: IconHeart },
    ]
  },
  {
    title: 'DEVOTEE GUIDE & ASSISTANCE',
    items: [
      { id: 'pilgrim-crowd', label: 'Best Time to Visit', icon: IconTrendingUp },
      { id: 'pilgrim-rules', label: 'Dress Code & Traditions', icon: IconBookOpen },
      { id: 'pilgrim-safety', label: 'Safety, SOS & Lost Desk', icon: IconPhoneCall },
      { id: 'pilgrim-wallet', label: 'My Devotee Wallet', icon: IconWallet },
    ]
  }
]

// ─── Authorized Shrine Operations Navigation (Only visible to Admin) ─────────
const ADMIN_NAV_SECTIONS: NavSection[] = [
  {
    title: 'EXECUTIVE COMMAND',
    items: [
      { id: 'home', label: 'Executive Overview', icon: IconHome },
      { id: 'livemap', label: 'Spatial Radar Map', icon: IconMap },
      { id: 'temple', label: 'Sanctum Telemetry', icon: IconTemple },
    ]
  },
  {
    title: 'AI & INTELLIGENCE',
    items: [
      { id: 'detection', label: 'AI Vision & CCTV Matrix', icon: IconCamera },
      { id: 'prediction', label: 'Surge Prediction', icon: IconBrain, badge: 'LSTM' },
      { id: 'routes', label: 'Flow Routing Controls', icon: IconRoute },
    ]
  },
  {
    title: 'SAFETY & INCIDENTS',
    items: [
      { id: 'emergency', label: 'Emergency Evacuation', icon: IconAlert },
      { id: 'incidents', label: 'Incident Dispatch Kanban', icon: IconShield },
      { id: 'notifications', label: 'Broadcast Center', icon: IconBell },
      { id: 'analytics', label: 'Footfall Analytics', icon: IconBarChart },
    ]
  },
  {
    title: 'DEVOTEE PORTAL PREVIEW',
    items: [
      { id: 'pilgrim', label: 'Devotee Darshan Hub', icon: IconTicket, badge: 'PUBLIC' },
      { id: 'pilgrim-live', label: 'Live Aarti Feed', icon: IconVideo },
      { id: 'pilgrim-map', label: 'Devotee Campus Map', icon: IconCompass },
      { id: 'pilgrim-sevas', label: 'Seva Booking System', icon: IconGift },
      { id: 'pilgrim-crowd', label: 'Crowd Forecast View', icon: IconTrendingUp },
      { id: 'pilgrim-safety', label: 'Safety & SOS Help', icon: IconPhoneCall },
      { id: 'pilgrim-wallet', label: 'Devotee Passes Wallet', icon: IconWallet },
    ]
  }
]

export default function NavBar({
  current,
  role = 'pilgrim',
  onChange,
  onOpenAuth,
  mobileOpen,
  onMobileClose
}: NavBarProps) {
  const isAdmin = String(role).toUpperCase() === 'ADMIN'
  const sections = isAdmin ? ADMIN_NAV_SECTIONS : DEVOTEE_NAV_SECTIONS

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          onClick={onMobileClose}
          className="fixed inset-0 bg-black/75 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Main Sidebar */}
      <aside
        style={{ width: 'var(--sidebar-w)' }}
        className={`fixed top-0 left-0 bottom-0 z-50 bg-[#141210]/95 border-r border-white/[0.07] backdrop-blur-xl flex flex-col transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Header / Brand */}
        <div className="p-5 border-b border-white/[0.07] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 p-[1px] shadow-lg shadow-amber-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-[#1c1815] rounded-[11px] flex items-center justify-center">
                <IconTemple size={22} className="text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-bold text-sm tracking-tight text-[#fbf9f5]">
                  TEMPLEVERSE
                </span>
                <span className="text-[10px] font-semibold bg-amber-500/15 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/30">
                  {isAdmin ? 'COMMAND' : 'PORTAL'}
                </span>
              </div>
              <p className="text-[11px] text-[#b8ae9f] tracking-normal font-medium">
                {isAdmin ? 'Temple Security & Operations' : 'Sacred Devotee Services'}
              </p>
            </div>
          </div>
          <button
            onClick={onMobileClose}
            className="p-1.5 rounded-lg text-[#b8ae9f] hover:text-white hover:bg-white/5 lg:hidden"
          >
            <IconX size={18} />
          </button>
        </div>

        {/* Live Status Pill */}
        <div className="px-4 py-2.5 bg-[#181512] border-b border-white/[0.04] flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-2">
            <span className="status-dot status-dot-emerald pulse-live" />
            <span className="font-mono text-emerald-400 font-medium">
              {isAdmin ? 'COMMAND NEXUS ACTIVE' : 'SANCTUM OPEN'}
            </span>
          </div>
          <span className="text-[10px] text-[#a3998b] font-mono">
            {isAdmin ? '128 Cams • 18ms' : 'Sarva Darshan Active'}
          </span>
        </div>

        {/* Navigation Items List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {sections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              <div className="px-3 pb-1.5 text-[10px] font-bold tracking-wider text-[#9c9384] font-mono">
                {section.title}
              </div>
              {section.items.map(item => {
                const active = current === item.id
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onChange(item.id)
                      onMobileClose()
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all ${
                      active
                        ? 'bg-amber-500/15 text-amber-300 shadow-sm border border-amber-500/30 font-semibold'
                        : 'text-[#b8ae9f] hover:text-[#fbf9f5] hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon
                        size={17}
                        className={active ? 'text-amber-400' : 'text-[#8c8273]'}
                      />
                      <span>{item.label}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {item.badge && (
                        <span
                          className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                            item.badge === 'LIVE'
                              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/25'
                              : item.badge === 'HD'
                              ? 'bg-amber-500/15 text-amber-300 border border-amber-500/25'
                              : 'bg-[#25201b] text-[#d6cebf]'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                      {active && (
                        <IconChevronRight
                          size={14}
                          className="text-amber-400"
                        />
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          ))}
        </div>

        {/* Bottom Section: Devotee Status vs Staff Clearance */}
        <div className="p-3 border-t border-white/[0.08] bg-[#12100e]">
          {isAdmin ? (
            /* Admin Officer Badge */
            <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center text-xs font-bold">
                  ADM
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-semibold text-amber-200 truncate">Shrine Administrator</p>
                  <p className="text-[10px] text-amber-400/80 font-mono truncate">Operations Clearance</p>
                </div>
              </div>
              <button
                onClick={() => onChange('pilgrim')}
                title="Preview Devotee Portal"
                className="p-1.5 rounded-lg text-[#b8ae9f] hover:text-white hover:bg-white/10 text-xs"
              >
                <IconSparkles size={15} />
              </button>
            </div>
          ) : (
            /* Devotee Guest Status & Unobtrusive Officer Sign In Link */
            <div className="space-y-2">
              <div className="p-2.5 rounded-xl bg-[#1c1815] border border-white/[0.05] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/15 text-amber-300 border border-amber-500/25 flex items-center justify-center text-[11px] font-bold">
                    DEV
                  </div>
                  <div>
                    <div className="font-semibold text-[#fbf9f5] text-xs">Devotee Portal</div>
                    <div className="text-[10px] text-[#a3998b] font-mono">Public Access</div>
                  </div>
                </div>
              </div>

              {/* Staff & Officer Link for Authorized Admins */}
              <button
                onClick={() => onOpenAuth && onOpenAuth('LOGIN_ADMIN')}
                className="w-full py-1.5 px-2 rounded-lg text-[11px] text-[#a3998b] hover:text-[#d6cebf] hover:bg-white/[0.04] transition-colors flex items-center justify-center gap-1.5 font-mono"
              >
                <IconLock size={12} className="text-[#a3998b]" />
                <span>Officer & Staff Login</span>
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}
