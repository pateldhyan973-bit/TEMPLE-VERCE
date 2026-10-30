import { Router } from 'express'
import { simulation } from '../simulationManager.js'

export const routesRouter = Router()

/**
 * GET /api/routes/gates
 * Returns active gate statuses and automated rerouting suggestions
 */
routesRouter.get('/gates', (req, res) => {
  try {
    const data = simulation.getRoutes()
    res.json({ success: true, data })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch gate route information', error })
  }
})

/**
 * POST /api/routes/toggle-gate
 * Toggle gate open / close state
 */
routesRouter.post('/toggle-gate', (req, res) => {
  try {
    const { id, open } = req.body
    if (!id) {
      return res.status(400).json({ success: false, message: 'Gate ID parameter is required.' })
    }
    const gate = simulation.toggleGate(id, open)
    if (!gate) {
      return res.status(404).json({ success: false, message: `Gate with ID ${id} not found.` })
    }
    res.json({ success: true, message: `Gate ${id} state updated successfully.`, gate })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to toggle gate state', error })
  }
})
