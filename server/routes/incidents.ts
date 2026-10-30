import { Router } from 'express'

export const incidentsRouter = Router()

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
  notes: { text: string; author: string; at: string }[]
}

// ─── In-memory store ──────────────────────────────────────────────────────────
const incidents: Incident[] = [
  {
    id: 'INC-0001',
    type: 'High Density',
    zone: 'Main Sanctum Courtyard',
    description: 'AI Vision detected crowd density at 97% — Zone Z1. Immediate dispersal required.',
    priority: 'CRITICAL',
    status: 'IN_PROGRESS',
    assignedTo: 'Cmdr. Sharma (Ops)',
    reporter: 'AI Vision Engine',
    reportedAt: new Date(Date.now() - 1800000).toISOString(),
    updatedAt: new Date(Date.now() - 900000).toISOString(),
    notes: [
      { text: 'Security team Alpha deployed to Zone Z1.', author: 'Cmdr. Sharma', at: new Date(Date.now() - 1500000).toISOString() },
    ],
  },
  {
    id: 'INC-0002',
    type: 'Gate Congestion',
    zone: 'Gate 2 East Main',
    description: 'Gate G2 operating at 91% capacity. Entry queue spilling onto road. Side lanes require crowd control.',
    priority: 'HIGH',
    status: 'OPEN',
    assignedTo: 'Gate Control Room',
    reporter: 'Camera CAM-03',
    reportedAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
    notes: [],
  },
  {
    id: 'INC-0003',
    type: 'Medical Assistance',
    zone: 'West Parking & Bus Depot',
    description: 'Elderly pilgrim reported dehydration near Bus Bay 4. Medical team requested on-site.',
    priority: 'MEDIUM',
    status: 'RESOLVED',
    assignedTo: 'Dr. Anita (Medical)',
    reporter: 'Security Volunteer',
    reportedAt: new Date(Date.now() - 7200000).toISOString(),
    updatedAt: new Date(Date.now() - 3200000).toISOString(),
    closedAt: new Date(Date.now() - 3200000).toISOString(),
    notes: [
      { text: 'Medical team responded within 4 minutes. Pilgrim stable, transferred to first aid center.', author: 'Dr. Anita', at: new Date(Date.now() - 3200000).toISOString() },
    ],
  },
  {
    id: 'INC-0004',
    type: 'Flow Blockage',
    zone: 'North Queue Corridor',
    description: 'Pilgrim group blocking the main flow corridor near pillar 7. Navigation volunteers required.',
    priority: 'LOW',
    status: 'RESOLVED',
    assignedTo: 'Security Team Beta',
    reporter: 'Camera CAM-04',
    reportedAt: new Date(Date.now() - 10800000).toISOString(),
    updatedAt: new Date(Date.now() - 9000000).toISOString(),
    closedAt: new Date(Date.now() - 9000000).toISOString(),
    notes: [
      { text: 'Blockage cleared. Pilgrims redirected to Corridor B.', author: 'Security Beta', at: new Date(Date.now() - 9000000).toISOString() },
    ],
  },
]

// ─── GET /api/incidents ────────────────────────────────────────────────────────
incidentsRouter.get('/', (req, res) => {
  const { status, priority, zone } = req.query
  let filtered = [...incidents]
  if (status) filtered = filtered.filter(i => i.status === status)
  if (priority) filtered = filtered.filter(i => i.priority === priority)
  if (zone) filtered = filtered.filter(i => i.zone.toLowerCase().includes(String(zone).toLowerCase()))
  // Sort: CRITICAL first, then by updatedAt desc
  const ORDER: Record<string,number> = { CRITICAL:0, HIGH:1, MEDIUM:2, LOW:3 }
  filtered.sort((a, b) => (ORDER[a.priority] - ORDER[b.priority]) || new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  res.json({ success: true, data: filtered, total: filtered.length })
})

// ─── GET /api/incidents/stats/summary ────────────────────────────────────────
// NOTE: This MUST be defined BEFORE /:id to avoid Express matching 'stats' as an id
incidentsRouter.get('/stats/summary', (_req, res) => {
  const total = incidents.length
  const open = incidents.filter(i => i.status === 'OPEN').length
  const inProgress = incidents.filter(i => i.status === 'IN_PROGRESS').length
  const resolved = incidents.filter(i => i.status === 'RESOLVED').length
  const critical = incidents.filter(i => i.priority === 'CRITICAL').length
  res.json({ success: true, data: { total, open, inProgress, resolved, critical } })
})

// ─── GET /api/incidents/:id ────────────────────────────────────────────────────
incidentsRouter.get('/:id', (req, res) => {
  const inc = incidents.find(i => i.id === req.params.id)
  if (!inc) return res.status(404).json({ success: false, message: 'Incident not found' })
  res.json({ success: true, data: inc })
})

// ─── POST /api/incidents ──────────────────────────────────────────────────────
incidentsRouter.post('/', (req, res) => {
  const { type, zone, description, priority, assignedTo, reporter } = req.body
  if (!type || !zone || !description) {
    return res.status(400).json({ success: false, message: 'type, zone, description are required' })
  }
  const newInc: Incident = {
    id: `INC-${String(incidents.length + 1).padStart(4, '0')}`,
    type,
    zone,
    description,
    priority: priority || 'MEDIUM',
    status: 'OPEN',
    assignedTo: assignedTo || 'Unassigned',
    reporter: reporter || 'Manual',
    reportedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    notes: [],
  }
  incidents.unshift(newInc)
  res.status(201).json({ success: true, data: newInc })
})

// ─── PATCH /api/incidents/:id/status ─────────────────────────────────────────
incidentsRouter.patch('/:id/status', (req, res) => {
  const inc = incidents.find(i => i.id === req.params.id)
  if (!inc) return res.status(404).json({ success: false, message: 'Incident not found' })
  const { status } = req.body
  if (!['OPEN', 'IN_PROGRESS', 'RESOLVED'].includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status' })
  }
  inc.status = status
  inc.updatedAt = new Date().toISOString()
  if (status === 'RESOLVED') {
    inc.closedAt = new Date().toISOString()
  } else {
    // Clear closedAt when incident is reopened
    delete inc.closedAt
  }
  res.json({ success: true, data: inc })
})

// ─── POST /api/incidents/:id/notes ────────────────────────────────────────────
incidentsRouter.post('/:id/notes', (req, res) => {
  const inc = incidents.find(i => i.id === req.params.id)
  if (!inc) return res.status(404).json({ success: false, message: 'Incident not found' })
  const { text, author } = req.body
  if (!text) return res.status(400).json({ success: false, message: 'text is required' })
  const note = { text, author: author || 'Staff', at: new Date().toISOString() }
  inc.notes.push(note)
  inc.updatedAt = new Date().toISOString()
  res.json({ success: true, data: note })
})

// (stats/summary route moved above /:id to prevent routing conflict)
