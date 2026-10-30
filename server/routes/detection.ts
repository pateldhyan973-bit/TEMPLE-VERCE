import { Router } from 'express'
import { simulation } from '../simulationManager.js'

export const detectionRouter = Router()

/**
 * GET /api/detection/cameras
 * Returns status and active counts for all CCTV nodes in camera network
 */
detectionRouter.get('/cameras', (req, res) => {
  try {
    const data = simulation.getCameras()
    res.json({ success: true, data })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch camera network', error })
  }
})

/**
 * GET /api/detection/events
 * Returns recent AI object detection events (people groups, anomalies)
 */
detectionRouter.get('/events', (req, res) => {
  try {
    const events = [
      { id: 'EV-901', camId: 'CAM-03', label: 'Crowd Surge Alert', confidence: 0.94, timestamp: new Date().toISOString() },
      { id: 'EV-902', camId: 'CAM-05', label: 'Unusual Flow Bottleneck', confidence: 0.88, timestamp: new Date(Date.now() - 60000).toISOString() },
      { id: 'EV-903', camId: 'CAM-01', label: 'Single Entry Velocity Spike', confidence: 0.91, timestamp: new Date(Date.now() - 120000).toISOString() }
    ]
    res.json({ success: true, events })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch detection events', error })
  }
})
