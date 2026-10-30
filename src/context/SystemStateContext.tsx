/**
 * SystemStateContext — Single source of truth for all live system data.
 *
 * Polls /api/overview every 2.5s.  When an emergency is active, a LOCAL
 * step-timer advances emergencyStep 0→6 autonomously so the UI always
 * progresses regardless of whether the backend is reachable.
 */

import { createContext, useContext, useState, useEffect, useRef, ReactNode, useCallback } from 'react'

interface GateStatus {
  id: string
  name: string
  pct: number
  capacity: number
  current: number
  status: 'OPTIMAL' | 'MODERATE' | 'HIGH' | 'CRITICAL'
  open: boolean
}

interface ZoneData {
  id: string
  name: string
  density: number
  count: number
  capacity: number
  status: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  temp: number
}

interface CameraData {
  id: string
  name: string
  count: number
  density: number
  status: 'active' | 'warning' | 'alert'
  resolution: string
  fps: number
  latencyMs: number
}

interface EmergencyNotification {
  id: number
  time: string
  text: string
  color: string
  severity: 'INFO' | 'WARNING' | 'CRITICAL'
}

export interface SystemState {
  totalPilgrims: number
  emergencyActive: boolean
  emergencyStep: number       // -1 = idle, 0-6 = steps 1-7
  gates: GateStatus[]
  zones: ZoneData[]
  cameras: CameraData[]
  notifications: EmergencyNotification[]
  overallRiskLevel: 'SAFE' | 'MODERATE' | 'HIGH' | 'CRITICAL'
  criticalGates: string[]
  criticalZones: string[]
  lastUpdated: string
  backendOnline: boolean
}

// Step messages injected into the notification log as steps advance
const STEP_NOTIFICATIONS: { text: string; color: string; severity: EmergencyNotification['severity'] }[] = [
  { text: '◉ STEP 1 — AI Vision confirmed critical density at Zone 2 (97%). Evacuation trigger authorised.', color: '#ff7b2e', severity: 'CRITICAL' },
  { text: '⚠ STEP 2 — Emergency SMS, Email & Push broadcast dispatched to 12,000+ registered devotees and all staff.', color: '#ff7b2e', severity: 'CRITICAL' },
  { text: '⊗ STEP 3 — Inbound Gates G1 & G2 CLOSED. All incoming flow halted. Pilgrims diverted to alternate exits.', color: '#ff1744', severity: 'CRITICAL' },
  { text: '⊕ STEP 4 — Emergency exits E1, E2, E3, E4 UNLOCKED and opened for immediate evacuation.', color: '#ffd700', severity: 'WARNING' },
  { text: '◀ STEP 5 — AI wayfinding arrows activated on devotee mobile devices. Security routing crowd to exits.', color: '#ffd700', severity: 'WARNING' },
  { text: '⬡ STEP 6 — Security teams and Medical rapid response deployed to Sanctum area. Police Control notified.', color: '#00ff88', severity: 'WARNING' },
  { text: '✓ STEP 7 — Evacuation complete. Zone density reduced to safe levels. System returning to normal monitoring.', color: '#00ff88', severity: 'INFO' },
]

// Step durations in milliseconds (matches Emergency.tsx STEPS array)
const STEP_DURATIONS = [2500, 2000, 2000, 2000, 2500, 2500, 3000]

function deriveRisk(gates: GateStatus[], zones: ZoneData[]): SystemState['overallRiskLevel'] {
  if (gates.some(g => g.status === 'CRITICAL') || zones.some(z => z.status === 'CRITICAL')) return 'CRITICAL'
  if (gates.some(g => g.status === 'HIGH') || zones.some(z => z.status === 'HIGH')) return 'HIGH'
  if (gates.reduce((a, g) => a + g.pct, 0) / (gates.length || 1) > 60) return 'MODERATE'
  return 'SAFE'
}

// ─── Default fallback state ────────────────────────────────────────────────────
const DEFAULT_GATES: GateStatus[] = [
  { id: 'G1', name: 'G1 West Entry', pct: 62, capacity: 5000, current: 3100, status: 'MODERATE', open: true },
  { id: 'G2', name: 'G2 East Main',  pct: 91, capacity: 6000, current: 5460, status: 'CRITICAL', open: true },
  { id: 'G3', name: 'G3 South Gate', pct: 38, capacity: 4000, current: 1520, status: 'OPTIMAL',  open: true },
  { id: 'G4', name: 'G4 North Exit', pct: 55, capacity: 4500, current: 2475, status: 'MODERATE', open: true },
]
const DEFAULT_ZONES: ZoneData[] = [
  { id: 'Z1', name: 'Main Sanctum Courtyard',        density: 92, count: 4600, capacity: 5000, status: 'CRITICAL', temp: 31.4 },
  { id: 'Z2', name: 'North Queue Corridor',          density: 78, count: 3120, capacity: 4000, status: 'HIGH',     temp: 30.2 },
  { id: 'Z3', name: 'East Shrine Promenade',         density: 45, count: 2250, capacity: 5000, status: 'MEDIUM',   temp: 29.8 },
  { id: 'Z4', name: 'South Food & Refreshment Park', density: 28, count: 1400, capacity: 5000, status: 'LOW',      temp: 28.5 },
  { id: 'Z5', name: 'West Parking & Bus Depot',      density: 50, count: 2500, capacity: 5000, status: 'MEDIUM',   temp: 29.1 },
]
const DEFAULT_CAMERAS: CameraData[] = [
  { id: 'CAM-01', name: 'South Gate Entrance', count: 124, density: 0.62, status: 'active',  resolution: '4K', fps: 30, latencyMs: 14 },
  { id: 'CAM-02', name: 'East Courtyard',      count: 89,  density: 0.45, status: 'active',  resolution: '4K', fps: 30, latencyMs: 12 },
  { id: 'CAM-03', name: 'Temple Plaza',        count: 312, density: 0.91, status: 'alert',   resolution: '4K', fps: 30, latencyMs: 18 },
  { id: 'CAM-04', name: 'North Corridor',      count: 44,  density: 0.22, status: 'active',  resolution: '4K', fps: 30, latencyMs: 11 },
  { id: 'CAM-05', name: 'West Gate',           count: 156, density: 0.78, status: 'warning', resolution: '4K', fps: 30, latencyMs: 15 },
  { id: 'CAM-06', name: 'Medical Zone',        count: 12,  density: 0.06, status: 'active',  resolution: '4K', fps: 30, latencyMs: 10 },
]

function buildDefault(): SystemState {
  return {
    totalPilgrims: 12458,
    emergencyActive: false,
    emergencyStep: -1,
    gates: DEFAULT_GATES,
    zones: DEFAULT_ZONES,
    cameras: DEFAULT_CAMERAS,
    notifications: [
      { id: 1, time: new Date().toLocaleTimeString(), text: 'AI Vision Engine online across all 128 nodes.', color: '#00ff88', severity: 'INFO' },
      { id: 2, time: new Date().toLocaleTimeString(), text: 'High crowd density threshold reached at Gate 2 East.', color: '#ffd700', severity: 'WARNING' },
    ],
    overallRiskLevel: deriveRisk(DEFAULT_GATES, DEFAULT_ZONES),
    criticalGates: DEFAULT_GATES.filter(g => g.status === 'CRITICAL').map(g => g.name),
    criticalZones: DEFAULT_ZONES.filter(z => z.status === 'CRITICAL').map(z => z.name),
    lastUpdated: new Date().toISOString(),
    backendOnline: false,
  }
}

// ─── Context ───────────────────────────────────────────────────────────────────
interface SystemStateContextType {
  state: SystemState
  triggerEmergency: () => Promise<void>
  resetEmergency: () => Promise<void>
  toggleGate: (id: string, open: boolean) => Promise<void>
}

const SystemStateContext = createContext<SystemStateContextType | undefined>(undefined)

// ─── Provider ──────────────────────────────────────────────────────────────────
export function SystemStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SystemState>(buildDefault)

  // Ref so step-timer can always read & write latest state without stale closures
  const stepTimerRef = useRef<NodeJS.Timeout | null>(null)
  const stepIndexRef  = useRef<number>(-1)

  // ─── Stop any running step timer ────────────────────────────────────────────
  function stopStepTimer() {
    if (stepTimerRef.current) {
      clearTimeout(stepTimerRef.current)
      stepTimerRef.current = null
    }
    stepIndexRef.current = -1
  }

  // ─── Advance to next step (runs recursively) ─────────────────────────────────
  const scheduleNextStep = useCallback((nextStep: number) => {
    if (nextStep > 6) {
      stopStepTimer()
      return
    }
    const delay = STEP_DURATIONS[nextStep] ?? 2500
    stepTimerRef.current = setTimeout(() => {
      const notif = STEP_NOTIFICATIONS[nextStep]
      setState(prev => {
        if (!prev.emergencyActive) return prev  // aborted
        return {
          ...prev,
          emergencyStep: nextStep,
          notifications: [
            { id: Date.now() + nextStep, time: new Date().toLocaleTimeString(), ...notif },
            ...prev.notifications,
          ],
          // Step 3: close entry gates; Step 7: start reopening
          gates: nextStep === 2
            ? prev.gates.map(g => g.id === 'G1' || g.id === 'G2' ? { ...g, open: false } : g)
            : prev.gates,
        }
      })
      stepIndexRef.current = nextStep
      scheduleNextStep(nextStep + 1)
    }, delay)
  }, [])

  // ─── Backend polling ─────────────────────────────────────────────────────────
  const fetchAll = useCallback(async () => {
    try {
      const [overviewRes, crowdRes, emergencyRes] = await Promise.all([
        fetch('/api/overview'),
        fetch('/api/crowd'),
        fetch('/api/emergency/status'),
      ])
      const overview  = overviewRes.ok  ? await overviewRes.json()  : null
      const crowd     = crowdRes.ok     ? await crowdRes.json()     : null
      const emergency = emergencyRes.ok ? await emergencyRes.json() : null

      setState(prev => {
        const gates: GateStatus[]             = overview?.data?.gates  ?? prev.gates
        const zones: ZoneData[]               = crowd?.data?.zones     ?? prev.zones
        // Only update emergencyStep from backend if we're NOT in the middle of
        // local step advancement (i.e. local timer is running). This prevents
        // the backend's stale value from overwriting local progress.
        const backendActive: boolean          = overview?.data?.emergencyActive ?? emergency?.data?.active ?? prev.emergencyActive
        const backendStep: number             = overview?.data?.emergencyStep   ?? emergency?.data?.stepIndex ?? prev.emergencyStep
        const emergencyStep: number           = stepIndexRef.current >= 0 ? stepIndexRef.current : backendStep
        const notifications: EmergencyNotification[] = emergency?.data?.notifications ?? prev.notifications

        return {
          ...prev,
          totalPilgrims: overview?.data?.totalPilgrims ?? prev.totalPilgrims,
          emergencyActive: backendActive,
          emergencyStep,
          gates,
          zones,
          notifications,
          overallRiskLevel: deriveRisk(gates, zones),
          criticalGates: gates.filter(g => g.status === 'CRITICAL').map(g => g.name),
          criticalZones: zones.filter(z => z.status === 'CRITICAL').map(z => z.name),
          lastUpdated: new Date().toISOString(),
          backendOnline: true,
        }
      })
    } catch {
      // Backend offline — simulate gate/zone drift, preserve emergency state
      setState(prev => {
        const gates = prev.gates.map(g => {
          // Don't randomly fluctuate closed gates during emergency
          if (prev.emergencyActive && (g.id === 'G1' || g.id === 'G2') && stepIndexRef.current >= 2) return g
          const d = Math.round((Math.random() - 0.48) * 4)
          const pct = Math.max(5, Math.min(99, g.pct + d))
          const status: GateStatus['status'] = pct > 90 ? 'CRITICAL' : pct > 75 ? 'HIGH' : pct > 50 ? 'MODERATE' : 'OPTIMAL'
          return { ...g, pct, current: Math.round(g.capacity * pct / 100), status }
        })
        const zones = prev.zones.map(z => {
          const d = Math.round((Math.random() - 0.48) * 3)
          const density = Math.max(10, Math.min(98, z.density + d))
          const status: ZoneData['status'] = density > 85 ? 'CRITICAL' : density > 70 ? 'HIGH' : density > 45 ? 'MEDIUM' : 'LOW'
          return { ...z, density, count: Math.round(z.capacity * density / 100), status }
        })
        return {
          ...prev,
          totalPilgrims: Math.max(8000, prev.totalPilgrims + Math.round((Math.random() - 0.45) * 15)),
          gates, zones,
          overallRiskLevel: deriveRisk(gates, zones),
          criticalGates: gates.filter(g => g.status === 'CRITICAL').map(g => g.name),
          criticalZones: zones.filter(z => z.status === 'CRITICAL').map(z => z.name),
          lastUpdated: new Date().toISOString(),
          backendOnline: false,
        }
      })
    }
  }, [])

  useEffect(() => {
    fetchAll()
    const t = setInterval(fetchAll, 2500)
    return () => clearInterval(t)
  }, [fetchAll])

  // ─── Cleanup step timer on unmount ───────────────────────────────────────────
  useEffect(() => () => stopStepTimer(), [])

  // ─── Public actions ──────────────────────────────────────────────────────────
  async function triggerEmergency() {
    // Fire backend (best-effort, don't block UI)
    fetch('/api/emergency/trigger', { method: 'POST' }).catch(() => {})

    // Immediately update state + inject step-0 notification
    setState(prev => ({
      ...prev,
      emergencyActive: true,
      emergencyStep: 0,
      notifications: [
        {
          id: Date.now(),
          time: new Date().toLocaleTimeString(),
          text: '🚨 CRITICAL EVACUATION PROTOCOL ACTIVATED — Multi-channel emergency broadcast sent to all staff & devotees!',
          color: '#ff1744',
          severity: 'CRITICAL',
        },
        ...prev.notifications,
      ],
      // Close G1 & G2 immediately
      gates: prev.gates.map(g => g.id === 'G1' || g.id === 'G2' ? { ...g, open: false } : g),
    }))

    // Start local step timer from step 1 (step 0 set above)
    stopStepTimer()
    stepIndexRef.current = 0
    scheduleNextStep(1)
  }

  async function resetEmergency() {
    stopStepTimer()
    fetch('/api/emergency/reset', { method: 'POST' }).catch(() => {})

    setState(prev => ({
      ...prev,
      emergencyActive: false,
      emergencyStep: -1,
      // Reopen all gates
      gates: prev.gates.map(g => ({ ...g, open: true })),
      notifications: [
        {
          id: Date.now(),
          time: new Date().toLocaleTimeString(),
          text: '✅ ALL CLEAR: Emergency resolved. System restored to normal. All gates reopened.',
          color: '#00ff88',
          severity: 'INFO',
        },
        ...prev.notifications,
      ],
    }))
  }

  async function toggleGate(id: string, open: boolean) {
    fetch('/api/routes/gates/toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, open }),
    }).catch(() => {})
    setState(prev => ({
      ...prev,
      gates: prev.gates.map(g => g.id === id ? { ...g, open } : g),
    }))
  }

  return (
    <SystemStateContext.Provider value={{ state, triggerEmergency, resetEmergency, toggleGate }}>
      {children}
    </SystemStateContext.Provider>
  )
}

export function useSystemState() {
  const ctx = useContext(SystemStateContext)
  if (!ctx) throw new Error('useSystemState must be inside SystemStateProvider')
  return ctx
}
