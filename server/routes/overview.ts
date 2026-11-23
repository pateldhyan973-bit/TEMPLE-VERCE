import { Router } from 'express'
import { simulation } from '../simulationManager.js'

export const overviewRouter = Router()

/**
 * GET /api/overview
 * Returns top-level dashboard metrics (Current pilgrims, live gate status, AI active cameras, etc.)
 */
overviewRouter.get('/', (req, res) => {
  try {
    const data = simulation.getOverview()
    res.json({ success: true, data })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch overview metrics', error })
  }
})
