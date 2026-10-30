import { Router } from 'express'
import { simulation } from '../simulationManager.js'

export const crowdRouter = Router()

/**
 * GET /api/crowd/zones
 * Returns crowd density for each temple zone & active count
 */
crowdRouter.get('/zones', (req, res) => {
  try {
    const data = simulation.getCrowdZones()
    res.json({ success: true, data })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch crowd zones', error })
  }
})

/**
 * GET /api/crowd/heatmap
 * Returns simulated 2D grid matrix of density points for canvas heatmap rendering
 */
crowdRouter.get('/heatmap', (req, res) => {
  try {
    const rows = 10
    const cols = 15
    const grid: number[][] = []

    for (let r = 0; r < rows; r++) {
      const row: number[] = []
      for (let c = 0; c < cols; c++) {
        // Create center heavy crowd density pattern
        const distFromCenter = Math.sqrt(Math.pow(r - rows / 2, 2) + Math.pow(c - cols / 2, 2))
        const baseDensity = Math.max(0, 1 - distFromCenter / 7)
        const noise = (Math.random() - 0.4) * 0.2
        row.push(parseFloat(Math.min(1, Math.max(0.05, baseDensity + noise)).toFixed(2)))
      }
      grid.push(row)
    }

    res.json({ success: true, grid, timestamp: new Date().toISOString() })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to generate heatmap grid', error })
  }
})
