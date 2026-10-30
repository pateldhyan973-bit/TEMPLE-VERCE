import { Router } from 'express'
import { simulation } from '../simulationManager.js'

export const predictionRouter = Router()

/**
 * GET /api/prediction/forecast
 * Returns historical crowd trend data + ML 15-30 min lookahead predictions
 */
predictionRouter.get('/forecast', (req, res) => {
  try {
    const data = simulation.getPrediction()
    res.json({ success: true, data })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch predictive analytics forecast', error })
  }
})
