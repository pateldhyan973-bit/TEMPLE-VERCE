import { Router } from 'express'
import { simulation } from '../simulationManager.js'

export const analyticsRouter = Router()

/**
 * GET /api/analytics/summary
 * Returns overall statistics for reporting & dashboard exports
 */
analyticsRouter.get('/summary', (req, res) => {
  try {
    const overview = simulation.getOverview()
    const summary = {
      totalFootfallToday: '2,845,920',
      peakHour: '14:30 - 15:30',
      avgDwellTimeMin: 42,
      maxDensityPct: 94,
      aiAccuracyPct: overview.aiAccuracyPct,
      incidentsPrevented: overview.incidentsPreventedToday,
      hourlyTrends: [
        { hour: '06:00', pilgrims: 14200 },
        { hour: '08:00', pilgrims: 38900 },
        { hour: '10:00', pilgrims: 84500 },
        { hour: '12:00', pilgrims: 112000 },
        { hour: '14:00', pilgrims: 145000 },
        { hour: '16:00', pilgrims: 128000 },
        { hour: '18:00', pilgrims: 96000 },
        { hour: '20:00', pilgrims: 52000 }
      ],
      weatherImpact: {
        condition: 'Clear Sky / Sunny',
        temperatureC: 31,
        humidityPct: 48,
        crowdFactorScore: 1.15
      }
    }
    res.json({ success: true, summary })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch analytics summary', error })
  }
})
