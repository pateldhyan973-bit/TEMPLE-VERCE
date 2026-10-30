export interface GateStatus {
  id: string
  name: string
  pct: number
  capacity: number
  current: number
  status: 'OPTIMAL' | 'MODERATE' | 'HIGH' | 'CRITICAL'
  open: boolean
}

export interface ZoneData {
  id: string
  name: string
  density: number // 0 - 100
  count: number
  capacity: number
  status: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  temp: number
}

export interface CameraData {
  id: string
  name: string
  count: number
  density: number
  status: 'active' | 'warning' | 'alert'
  resolution: string
  fps: number
  latencyMs: number
}

export interface EmergencyNotification {
  id: number
  time: string
  text: string
  color: string
  severity: 'INFO' | 'WARNING' | 'CRITICAL'
}

export interface VirtualPass {
  passId: string
  pilgrimName: string
  timeSlot: string
  gate: string
  status: 'CONFIRMED' | 'CHECKED_IN' | 'EXPIRED'
  createdAt: string
}

class SimulationManager {
  private totalPilgrims = 12458
  private systemUptime = 99.97
  private cameraCount = 128
  private activeEmergency = false
  private emergencyStep = -1
  private notificationIdCounter = 100

  private gates: GateStatus[] = [
    { id: 'G1', name: 'G1 West Entry', pct: 62, capacity: 5000, current: 3100, status: 'MODERATE', open: true },
    { id: 'G2', name: 'G2 East Main', pct: 91, capacity: 6000, current: 5460, status: 'CRITICAL', open: true },
    { id: 'G3', name: 'G3 South Gate', pct: 38, capacity: 4000, current: 1520, status: 'OPTIMAL', open: true },
    { id: 'G4', name: 'G4 North Exit', pct: 55, capacity: 4500, current: 2475, status: 'MODERATE', open: true }
  ]

  private zones: ZoneData[] = [
    { id: 'Z1', name: 'Main Sanctum Outer Courtyard', density: 92, count: 4600, capacity: 5000, status: 'CRITICAL', temp: 31.4 },
    { id: 'Z2', name: 'North Queue Corridor', density: 78, count: 3120, capacity: 4000, status: 'HIGH', temp: 30.2 },
    { id: 'Z3', name: 'East Shrine Promenade', density: 45, count: 2250, capacity: 5000, status: 'MEDIUM', temp: 29.8 },
    { id: 'Z4', name: 'South Food & Refreshment Park', density: 28, count: 1400, capacity: 5000, status: 'LOW', temp: 28.5 },
    { id: 'Z5', name: 'West Parking & Bus Depot', density: 50, count: 2500, capacity: 5000, status: 'MEDIUM', temp: 29.1 }
  ]

  private cameras: CameraData[] = [
    { id: 'CAM-01', name: 'South Gate Entrance', count: 124, density: 0.62, status: 'active', resolution: '4K', fps: 30, latencyMs: 14 },
    { id: 'CAM-02', name: 'East Courtyard', count: 89, density: 0.45, status: 'active', resolution: '4K', fps: 30, latencyMs: 12 },
    { id: 'CAM-03', name: 'Temple Plaza', count: 312, density: 0.91, status: 'alert', resolution: '4K', fps: 30, latencyMs: 18 },
    { id: 'CAM-04', name: 'North Corridor', count: 44, density: 0.22, status: 'active', resolution: '4K', fps: 30, latencyMs: 11 },
    { id: 'CAM-05', name: 'West Gate', count: 156, density: 0.78, status: 'warning', resolution: '4K', fps: 30, latencyMs: 15 },
    { id: 'CAM-06', name: 'Medical Zone', count: 12, density: 0.06, status: 'active', resolution: '4K', fps: 30, latencyMs: 10 }
  ]

  private notifications: EmergencyNotification[] = [
    { id: 1, time: new Date().toLocaleTimeString(), text: 'AI Vision Engine online across all 128 nodes.', color: '#00ff88', severity: 'INFO' },
    { id: 2, time: new Date().toLocaleTimeString(), text: 'High crowd density threshold reached at Gate 2 East.', color: '#ffd700', severity: 'WARNING' }
  ]

  private passes: VirtualPass[] = [
    { passId: 'PASS-8841', pilgrimName: 'Rajesh Sharma', timeSlot: '09:00 - 10:00', gate: 'G1 West Entry', status: 'CHECKED_IN', createdAt: '2026-09-19T08:00:00Z' },
    { passId: 'PASS-9932', pilgrimName: 'Priya Patel', timeSlot: '10:00 - 11:00', gate: 'G3 South Gate', status: 'CONFIRMED', createdAt: '2026-09-19T08:15:00Z' }
  ]

  constructor() {
    // Start continuous dynamic simulation updates
    setInterval(() => this.updateSimulation(), 2500)
  }

  private updateSimulation() {
    const delta = Math.round((Math.random() - 0.45) * 18)
    this.totalPilgrims = Math.max(1000, this.totalPilgrims + delta)

    // Update gate stats
    this.gates = this.gates.map(g => {
      const pDelta = Math.round((Math.random() - 0.48) * 4)
      const newPct = Math.max(5, Math.min(99, g.pct + pDelta))
      const status: GateStatus['status'] = newPct > 90 ? 'CRITICAL' : newPct > 75 ? 'HIGH' : newPct > 50 ? 'MODERATE' : 'OPTIMAL'
      return {
        ...g,
        pct: newPct,
        current: Math.round((g.capacity * newPct) / 100),
        status
      }
    })

    // Update zone densities
    this.zones = this.zones.map(z => {
      const dDelta = Math.round((Math.random() - 0.48) * 3)
      const newDensity = Math.max(10, Math.min(98, z.density + dDelta))
      const status: ZoneData['status'] = newDensity > 85 ? 'CRITICAL' : newDensity > 70 ? 'HIGH' : newDensity > 45 ? 'MEDIUM' : 'LOW'
      return {
        ...z,
        density: newDensity,
        count: Math.round((z.capacity * newDensity) / 100),
        status
      }
    })

    // Update camera counts
    this.cameras = this.cameras.map(c => {
      const cDelta = Math.round((Math.random() - 0.45) * 6)
      const newCount = Math.max(1, c.count + cDelta)
      const newDensity = Math.max(0.02, Math.min(0.99, c.density + (Math.random() - 0.48) * 0.04))
      const status: CameraData['status'] = newDensity > 0.85 ? 'alert' : newDensity > 0.65 ? 'warning' : 'active'
      return {
        ...c,
        count: newCount,
        density: parseFloat(newDensity.toFixed(2)),
        status
      }
    })
  }

  public getOverview() {
    return {
      totalPilgrims: this.totalPilgrims,
      gates: this.gates,
      activeCameras: 128,
      totalCameras: 128,
      aiAccuracyPct: 99.2,
      avgResponseTimeSec: 1.4,
      incidentsPreventedToday: 47,
      pilgrimsServedToday: '2.8M',
      emergencyActive: this.activeEmergency,
      emergencyStep: this.emergencyStep,
      timestamp: new Date().toISOString()
    }
  }

  public getCrowdZones() {
    return {
      totalPilgrims: this.totalPilgrims,
      zones: this.zones,
      timestamp: new Date().toISOString()
    }
  }

  public getCameras() {
    return {
      cameras: this.cameras,
      pipeline: [
        { label: 'CCTV Camera', sublabel: '128 cameras, 4K stream', icon: '◉', color: '#00d4ff' },
        { label: 'AI Detection', sublabel: 'YOLOv9 person detection', icon: '⬡', color: '#a78bfa' },
        { label: 'Crowd Count', sublabel: '±2 person accuracy', icon: '◈', color: '#00ff88' },
        { label: 'Density Map', sublabel: '10×10 grid analysis', icon: '◰', color: '#ffd700' },
        { label: 'Risk Score', sublabel: '0–100 danger index', icon: '⚠', color: '#ff7b2e' },
        { label: 'Alert/Action', sublabel: 'Automated response', icon: '▶', color: '#ff1744' }
      ]
    }
  }

  public getPrediction() {
    const historical = Array.from({ length: 28 }, (_, i) => {
      const h = i / 2
      const wave = Math.sin((h - 8) * 0.5) * 0.3 + Math.sin((h - 14) * 0.6) * 0.5 + Math.sin((h - 19) * 0.4) * 0.2
      return Math.round(850 + wave * 510 + (Math.random() - 0.5) * 40)
    })

    const predicted = Array.from({ length: 20 }, (_, i) => {
      const h = (28 + i) / 2
      const wave = Math.sin((h - 8) * 0.5) * 0.3 + Math.sin((h - 14) * 0.6) * 0.5 + Math.sin((h - 19) * 0.4) * 0.2
      return Math.round(850 + wave * 510 + (Math.random() - 0.5) * 60)
    })

    return {
      historical,
      predicted,
      forecasts: [
        { zone: 'Gate 2 East', risk: 'HIGH', time: '15 min', pct: 88, msg: 'Congestion likely — redirect to Gate 3' },
        { zone: 'Temple Plaza', risk: 'MEDIUM', time: '22 min', pct: 61, msg: 'Density rising, monitor closely' },
        { zone: 'South Queue', risk: 'LOW', time: '35 min', pct: 32, msg: 'Normal flow expected' },
        { zone: 'North Entry', risk: 'CRITICAL', time: '8 min', pct: 95, msg: 'IMMEDIATE: close inbound, open alternate' }
      ],
      aiModel: {
        type: 'LSTM + Transformer Neural Net',
        trainingData: '3.2M crowd events',
        accuracy15Min: '94.7%',
        accuracy30Min: '89.2%',
        updateFrequency: 'Real-time (60s retrain trigger)'
      }
    }
  }

  public getRoutes() {
    return {
      gates: this.gates,
      activeReroutes: [
        { from: 'Gate 2 East', to: 'Gate 3 South', flowDivertedPct: 40, status: 'ACTIVE', estimatedReliefMin: 6 },
        { from: 'North Corridor', to: 'West Exit E1', flowDivertedPct: 25, status: 'STANDBY', estimatedReliefMin: 12 }
      ],
      gateModes: {
        G1: 'INBOUND_OUTBOUND',
        G2: 'OUTBOUND_ONLY',
        G3: 'INBOUND_PRIMARY',
        G4: 'EMERGENCY_RESERVE'
      }
    }
  }

  public toggleGate(id: string, open?: boolean) {
    const gate = this.gates.find(g => g.id === id)
    if (gate) {
      gate.open = open !== undefined ? open : !gate.open
    }
    return gate
  }

  public getEmergency() {
    return {
      active: this.activeEmergency,
      stepIndex: this.emergencyStep,
      notifications: this.notifications,
      contacts: [
        { label: 'Police Control Room', number: '100', status: 'READY' },
        { label: 'Medical Rapid Response', number: '108', status: 'ON_STANDBY' },
        { label: 'Fire & Disaster Action', number: '101', status: 'READY' },
        { label: 'Temple Command Desk', number: 'EXT 204', status: 'ACTIVE' }
      ]
    }
  }

  private emergencyInterval: NodeJS.Timeout | null = null

  public triggerEmergency() {
    this.activeEmergency = true
    this.emergencyStep = 0

    // Close entry gates immediately to halt incoming crowd
    this.gates = this.gates.map(g => (g.id === 'G1' || g.id === 'G2' ? { ...g, open: false } : g))

    const newNotif: EmergencyNotification = {
      id: ++this.notificationIdCounter,
      time: new Date().toLocaleTimeString(),
      text: '🚨 CRITICAL EVACUATION PROTOCOL ACTIVATED: SMS & Push Emergency Broadcast Sent to all staff & devotees!',
      color: '#ff1744',
      severity: 'CRITICAL'
    }
    this.notifications.unshift(newNotif)

    // Clear any previous interval
    if (this.emergencyInterval) clearInterval(this.emergencyInterval)

    // Automatically advance through evacuation steps (0 through 6)
    this.emergencyInterval = setInterval(() => {
      if (!this.activeEmergency) {
        if (this.emergencyInterval) clearInterval(this.emergencyInterval)
        return
      }
      if (this.emergencyStep < 6) {
        this.emergencyStep += 1
        const stepNotifs = [
          '◉ Step 1: AI Vision confirmed high density evacuation trigger.',
          '⚠ Step 2: Emergency SMS broadcast dispatched to 12,000+ registered devotees.',
          '⊗ Step 3: Inbound Gates G1 & G2 HALTED. Flow diverted to Exits.',
          '⊕ Step 4: Emergency Exits E1, E2, E3, E4 unlocked.',
          '◀ Step 5: AI Wayfinding arrows activated on pilgrim mobile devices.',
          '⬡ Step 6: Security and Medical Teams deployed to Sanctum area.',
          '✓ Step 7: Evacuation complete. Zone density reduced to safe level.',
        ]
        if (stepNotifs[this.emergencyStep]) {
          this.notifications.unshift({
            id: ++this.notificationIdCounter,
            time: new Date().toLocaleTimeString(),
            text: stepNotifs[this.emergencyStep],
            color: this.emergencyStep >= 5 ? '#00ff88' : '#ffd700',
            severity: this.emergencyStep >= 5 ? 'INFO' : 'WARNING',
          })
        }
      } else {
        if (this.emergencyInterval) clearInterval(this.emergencyInterval)
      }
    }, 2500)

    return { success: true, message: 'Emergency protocol initiated & automated evacuation sequence running.', active: true, step: 0 }
  }

  public resetEmergency() {
    this.activeEmergency = false
    this.emergencyStep = -1
    if (this.emergencyInterval) {
      clearInterval(this.emergencyInterval)
      this.emergencyInterval = null
    }

    // Re-open all gates to normal operation
    this.gates = this.gates.map(g => ({ ...g, open: true }))

    const newNotif: EmergencyNotification = {
      id: ++this.notificationIdCounter,
      time: new Date().toLocaleTimeString(),
      text: '✓ System restored to normal state by operator override. All gates reopened.',
      color: '#00ff88',
      severity: 'INFO'
    }
    this.notifications.unshift(newNotif)
    return { success: true, message: 'Emergency mode reset.', active: false, step: -1 }
  }

  public getVirtualPasses() {
    return { passes: this.passes }
  }

  public bookVirtualPass(name: string, timeSlot: string, gate: string) {
    const newPass: VirtualPass = {
      passId: `PASS-${Math.floor(1000 + Math.random() * 9000)}`,
      pilgrimName: name,
      timeSlot,
      gate,
      status: 'CONFIRMED',
      createdAt: new Date().toISOString()
    }
    this.passes.unshift(newPass)
    return newPass
  }

  public getTempleManagement() {
    const mainZone = this.zones.find(z => z.id === 'Z1')
    const sanctumDensity = mainZone ? mainZone.density : 78
    const isOvercrowded = sanctumDensity > 85

    return {
      sanctum: {
        name: 'Main Garbhagriha (Sanctum Sanctorum)',
        capacity: 2000,
        currentOccupancy: Math.round(2000 * (sanctumDensity / 100)),
        densityPct: sanctumDensity,
        status: sanctumDensity > 85 ? 'HIGH_LOAD' : sanctumDensity > 60 ? 'BALANCED' : 'OPTIMAL',
        darshanRatePerHour: 1800,
        avgDarshanTimeMin: 1.8,
        queueLineLength: Math.round(this.totalPilgrims * 0.35)
      },
      crossSystemLinks: {
        aiPredictionLinked: true,
        crowdManagementLinked: true,
        virtualPassThrottling: isOvercrowded,
        emergencyOverrideLinked: this.activeEmergency,
        activeGatesCount: this.gates.filter(g => g.open).length,
        totalActiveCameras: this.cameras.filter(c => c.status !== 'alert').length
      },
      aiDecisionLog: [
        { id: 1, time: new Date().toLocaleTimeString(), text: 'AI Queue Engine: Synchronized Gate 2 flow with Sanctum exit speed.', status: 'SUCCESS' },
        { id: 2, time: new Date().toLocaleTimeString(), text: `Virtual Queue Pass rate: ${isOvercrowded ? 'THROTTLED (-25%)' : 'NORMAL (100%)'}.`, status: isOvercrowded ? 'WARN' : 'INFO' },
        { id: 3, time: new Date().toLocaleTimeString(), text: 'CCTV Neural Net: Object tracking synchronized across all 128 camera feeds.', status: 'SUCCESS' }
      ]
    }
  }
}

export const simulation = new SimulationManager()
