import { useState, useEffect } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import { SystemStateProvider, useSystemState } from './context/SystemStateContext'
import AuthModal from './components/AuthModal'
import NavBar from './components/NavBar'
import Home from './pages/Home'
import LiveMap from './pages/LiveMap'
import AIDetection from './pages/AIDetection'
import Prediction from './pages/Prediction'
import RouteManagement from './pages/RouteManagement'
import Emergency from './pages/Emergency'
import Analytics from './pages/Analytics'
import TempleManagement from './pages/TempleManagement'
import PilgrimPortal from './pages/PilgrimPortal'
import DevoteeFloorLive from './pages/DevoteeFloorLive'
import DevoteeLiveDarshan from './pages/DevoteeLiveDarshan'
import DevoteeCampusMap from './pages/DevoteeCampusMap'
import DevoteeSevas from './pages/DevoteeSevas'
import DevoteeAccommodation from './pages/DevoteeAccommodation'
import DevoteeDonations from './pages/DevoteeDonations'
import DevoteeCrowdForecast from './pages/DevoteeCrowdForecast'
import DevoteeTraditions from './pages/DevoteeTraditions'
import DevoteeSafety from './pages/DevoteeSafety'
import DevoteeWallet from './pages/DevoteeWallet'
import NotificationCenter from './pages/NotificationCenter'
import IncidentDashboard from './pages/IncidentDashboard'
import StaffChat from './components/StaffChat'
import LanguageSelector from './components/LanguageSelector'
import { I18nProvider } from './i18n'
import {
  IconMenu,
  IconShield,
  IconAlert,
  IconTicket,
  IconSparkles,
  IconChevronRight,
  IconClock,
  IconTemple
} from './components/Icons'

const PAGE_METADATA: Record<string, { title: string; category: string }> = {
  // ─── Devotee Pages (11 Modules) ─────────────────────────────────────────────
  'pilgrim':        { title: 'Darshan Booking & Queue', category: 'QUEUE & DARSHAN' },
  'pilgrim-floor':  { title: 'Floor & Compartments Live', category: 'QUEUE & DARSHAN' },
  'pilgrim-live':   { title: 'Sanctum Live Webcast & Aarti', category: 'QUEUE & DARSHAN' },
  'pilgrim-map':    { title: 'Sacred Campus & Amenities Map', category: 'QUEUE & DARSHAN' },
  'pilgrim-sevas':  { title: 'Special Sevas & Sacred Prasadam', category: 'SEVAS, STAY & CHARITY' },
  'pilgrim-stay':   { title: 'Rest Houses & Rooms', category: 'SEVAS, STAY & CHARITY' },
  'pilgrim-hundi':  { title: 'Sacred e-Hundi & Trusts', category: 'SEVAS, STAY & CHARITY' },
  'pilgrim-crowd':  { title: 'When to Visit: Crowd Forecast', category: 'DEVOTEE GUIDE' },
  'pilgrim-rules':  { title: 'Sanctum Traditions & Dress Code', category: 'DEVOTEE GUIDE' },
  'pilgrim-safety': { title: 'Emergency SOS & Lost Desk', category: 'DEVOTEE GUIDE' },
  'pilgrim-wallet': { title: 'My Digital Devotee Wallet', category: 'DEVOTEE GUIDE' },

  // ─── Admin Pages (100% Restricted to Authorized Admin) ─────────────────────
  'home':           { title: 'Executive Overview', category: 'COMMAND & CONTROL' },
  'livemap':        { title: 'Live Spatial Radar', category: 'COMMAND & CONTROL' },
  'temple':         { title: 'Sanctum Telemetry', category: 'COMMAND & CONTROL' },
  'detection':      { title: 'AI Vision & CCTV Matrix', category: 'AI & INTELLIGENCE' },
  'prediction':     { title: 'Surge Prediction', category: 'AI & INTELLIGENCE' },
  'routes':         { title: 'Dynamic Flow Routing', category: 'AI & INTELLIGENCE' },
  'emergency':      { title: 'Emergency Protocol', category: 'SAFETY & INCIDENTS' },
  'analytics':      { title: 'Footfall Analytics', category: 'SAFETY & INCIDENTS' },
  'notifications':  { title: 'Broadcast Engine', category: 'SAFETY & INCIDENTS' },
  'incidents':      { title: 'Incident Dispatch Kanban', category: 'SAFETY & INCIDENTS' },
}

function MainApp() {
  const { user, role, isAuthModalOpen, openAuthModal, closeAuthModal, setUserSession, logout } = useAuth()
  const { state: sysState } = useSystemState()
  const [page, setPage] = useState('pilgrim')
  const [pageKey, setPageKey] = useState(0)
  const [mobileNav, setMobileNav] = useState(false)
  const [time, setTime] = useState(new Date())
  const [mounted, setMounted] = useState(false)
  const [authModalMode, setAuthModalMode] = useState<'LOGIN_PILGRIM' | 'REGISTER_PILGRIM' | 'LOGIN_ADMIN'>('LOGIN_PILGRIM')

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 50)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  function navigate(p: string) {
    setPage(p)
    setPageKey(k => k + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleOpenAuth(mode: 'LOGIN_PILGRIM' | 'REGISTER_PILGRIM' | 'LOGIN_ADMIN' = 'LOGIN_PILGRIM') {
    setAuthModalMode(mode)
    openAuthModal()
  }

  const isAdmin = String(role).toUpperCase() === 'ADMIN'

  // Safety auto-redirect: if user logged out or regular user, never stay on an admin URL
  const isAdminTool = ['home', 'livemap', 'temple', 'detection', 'prediction', 'routes', 'emergency', 'analytics', 'notifications', 'incidents'].includes(page)
  useEffect(() => {
    if (isAdminTool && !isAdmin) {
      setPage('pilgrim')
    }
  }, [isAdmin, page, isAdminTool])

  function renderPage() {
    // ─── 1. If not admin, strictly render devotee pages only ───
    if (!isAdmin) {
      switch (page) {
        case 'pilgrim-floor':  return <DevoteeFloorLive />
        case 'pilgrim-live':   return <DevoteeLiveDarshan />
        case 'pilgrim-map':    return <DevoteeCampusMap />
        case 'pilgrim-sevas':  return <DevoteeSevas />
        case 'pilgrim-stay':   return <DevoteeAccommodation />
        case 'pilgrim-hundi':  return <DevoteeDonations />
        case 'pilgrim-crowd':  return <DevoteeCrowdForecast />
        case 'pilgrim-rules':  return <DevoteeTraditions />
        case 'pilgrim-safety': return <DevoteeSafety />
        case 'pilgrim-wallet': return <DevoteeWallet />
        case 'pilgrim':
        default:
          return <PilgrimPortal />
      }
    }

    // ─── 2. Authorized Admin can access all command and devotee views ───
    switch (page) {
      case 'home':           return <Home onNavigate={navigate} />
      case 'livemap':        return <LiveMap />
      case 'temple':         return <TempleManagement />
      case 'detection':      return <AIDetection />
      case 'prediction':     return <Prediction />
      case 'routes':         return <RouteManagement />
      case 'emergency':      return <Emergency />
      case 'analytics':      return <Analytics />
      case 'notifications':  return <NotificationCenter />
      case 'incidents':      return <IncidentDashboard />
      case 'pilgrim-floor':  return <DevoteeFloorLive />
      case 'pilgrim-live':   return <DevoteeLiveDarshan />
      case 'pilgrim-map':    return <DevoteeCampusMap />
      case 'pilgrim-sevas':  return <DevoteeSevas />
      case 'pilgrim-stay':   return <DevoteeAccommodation />
      case 'pilgrim-hundi':  return <DevoteeDonations />
      case 'pilgrim-crowd':  return <DevoteeCrowdForecast />
      case 'pilgrim-rules':  return <DevoteeTraditions />
      case 'pilgrim-safety': return <DevoteeSafety />
      case 'pilgrim-wallet': return <DevoteeWallet />
      case 'pilgrim':
      default:
        return <PilgrimPortal />
    }
  }

  const currentMeta = PAGE_METADATA[page] || { title: 'Devotee Portal', category: 'DEVOTEE SERVICES' }

  return (
    <div className={`min-h-screen bg-[#0c0b0a] text-[#fbf9f5] transition-opacity duration-300 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
      {/* Global Emergency Alert Banner (Shown during active drill/incident) */}
      {sysState.emergencyActive && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-rose-600/95 text-white px-5 py-2.5 flex items-center justify-between backdrop-blur-md shadow-lg shadow-rose-950/60 border-b border-rose-400/40">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center animate-pulse">
              <IconAlert size={15} className="text-white" />
            </div>
            <div className="text-xs sm:text-sm font-semibold tracking-wide">
              EMERGENCY PROTOCOL ACTIVE: Zone 2 Evacuation Sequence in Progress. All gates diverted to exit.
            </div>
          </div>
          {isAdmin && (
            <button
              onClick={() => navigate('emergency')}
              className="px-3 py-1 rounded-lg bg-white text-rose-700 text-xs font-bold hover:bg-slate-100 transition-colors shadow-sm ml-4 shrink-0"
            >
              Access Emergency Command
            </button>
          )}
        </div>
      )}

      {/* Navigation Sidebar */}
      <NavBar
        current={page}
        role={role}
        onChange={navigate}
        onOpenAuth={handleOpenAuth}
        mobileOpen={mobileNav}
        onMobileClose={() => setMobileNav(false)}
      />

      {/* Main Content Viewport */}
      <div className="lg:pl-[260px] min-h-screen flex flex-col">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 h-16 bg-[#141210]/95 backdrop-blur-xl border-b border-[#2b251f] px-4 sm:px-8 flex items-center justify-between">
          {/* Left: Mobile trigger & Breadcrumb */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileNav(true)}
              className="p-2 rounded-lg text-[#b8ae9f] hover:text-white hover:bg-white/5 lg:hidden"
            >
              <IconMenu size={20} />
            </button>
            <div className="flex items-center gap-2 text-xs">
              <span className="font-mono text-[#b8ae9f] font-semibold">{currentMeta.category}</span>
              <IconChevronRight size={12} className="text-[#b8ae9f]" />
              <span className="font-bold text-white font-display">{currentMeta.title}</span>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            {/* Admin-only Operations vs Devotee Switcher */}
            {isAdmin && (
              <div className="hidden sm:flex items-center bg-[#1c1815] p-1 rounded-xl border border-amber-500/30 shadow-inner">
                <button
                  onClick={() => navigate('pilgrim')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    page.startsWith('pilgrim')
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-sm font-bold'
                      : 'text-[#b8ae9f] hover:text-white'
                  }`}
                >
                  <IconTicket size={13} />
                  <span>Devotee Portal</span>
                </button>
                <button
                  onClick={() => navigate('home')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    !page.startsWith('pilgrim')
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-sm font-bold'
                      : 'text-[#b8ae9f] hover:text-white'
                  }`}
                >
                  <IconShield size={13} />
                  <span>Operations Hub</span>
                </button>
              </div>
            )}

            {/* Language Selector */}
            <LanguageSelector />

            {/* Live Time */}
            <div className="hidden md:flex items-center gap-2 font-mono text-xs text-[#b8ae9f] px-2.5 py-1.5 rounded-lg bg-[#1c1815] border border-white/[0.05]">
              <IconClock size={13} className="text-amber-400" />
              <span>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
            </div>

            {/* Auth Profile / Login Button */}
            {user ? (
              <div className="flex items-center gap-2.5 pl-2 border-l border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                    isAdmin
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  }`}>
                    {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-xs font-semibold text-white leading-tight">
                      {user.displayName || (isAdmin ? 'Command Officer' : 'Devotee')}
                    </p>
                    <p className="text-[10px] text-[#b8ae9f] font-mono leading-tight">
                      {isAdmin ? 'ADMIN CLEARANCE' : 'PILGRIM'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="px-2.5 py-1 text-xs text-[#b8ae9f] hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors border border-transparent hover:border-rose-500/20"
                >
                  Exit
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleOpenAuth('LOGIN_PILGRIM')}
                className="btn-primary py-2 px-3.5 text-xs"
              >
                Sign In
              </button>
            )}
          </div>
        </header>

        {/* Page Content Viewport */}
        <main key={pageKey} className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-fade-in">
          {renderPage()}
        </main>

        {/* Footer */}
        <footer className="mt-auto px-6 py-4 border-t border-[#2b251f] bg-[#12100e] text-xs text-[#b8ae9f] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-mono text-[11px]">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span>SHRINE DARSHAN & DEVOTEE SERVICES</span>
            <span className="text-slate-400">•</span>
            <span>TIRUMALA PILGRIM PORTAL</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-mono text-[#b8ae9f]">
            <span>24x7 Devotee Helpline: 1800-425-4141</span>
            <span>•</span>
            <span>Sarva Darshan Open</span>
            {!isAdmin && (
              <>
                <span>•</span>
                <button
                  onClick={() => handleOpenAuth('LOGIN_ADMIN')}
                  className="hover:text-amber-400 underline transition-colors"
                >
                  Officer Portal
                </button>
              </>
            )}
          </div>
        </footer>
      </div>

      {/* Staff Intercom Chat (Strictly visible to Admin only) */}
      {isAdmin && <StaffChat />}

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={authModalMode}
        onClose={closeAuthModal}
        onSuccess={(u) => {
          setUserSession(u)
          if (String(u.role).toUpperCase() === 'ADMIN') {
            navigate('home')
          } else {
            navigate('pilgrim')
          }
        }}
      />
    </div>
  )
}

export default function App() {
  return (
    <I18nProvider>
      <AuthProvider>
        <SystemStateProvider>
          <MainApp />
        </SystemStateProvider>
      </AuthProvider>
    </I18nProvider>
  )
}
