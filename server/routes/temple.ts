import { Router } from 'express'
import { simulation } from '../simulationManager.js'

export const templeRouter = Router()

templeRouter.get('/summary', (req, res) => {
  try {
    const data = simulation.getTempleManagement()
    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      data
    })
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message })
  }
})
