import { Router } from 'express'
import { simulation } from '../simulationManager.js'

export const virtualQueueRouter = Router()

/**
 * GET /api/virtual-queue/passes
 * Get list of virtual entry passes
 */
virtualQueueRouter.get('/passes', (req, res) => {
  try {
    const data = simulation.getVirtualPasses()
    res.json({ success: true, data })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch virtual passes', error })
  }
})

/**
 * POST /api/virtual-queue/book
 * Book a pilgrim virtual pass
 */
virtualQueueRouter.post('/book', (req, res) => {
  try {
    const { pilgrimName, timeSlot, gate } = req.body
    if (!pilgrimName || !timeSlot || !gate) {
      return res.status(400).json({ success: false, message: 'pilgrimName, timeSlot, and gate are required.' })
    }

    const pass = simulation.bookVirtualPass(pilgrimName, timeSlot, gate)
    res.json({ success: true, message: 'Virtual pass booked successfully!', pass })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to book virtual pass', error })
  }
})
