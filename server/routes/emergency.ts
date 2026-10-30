import { Router } from 'express'
import { simulation } from '../simulationManager.js'
import { notificationService } from '../services/notificationService.js'

export const emergencyRouter = Router()

/**
 * GET /api/emergency/status
 * Returns emergency state, protocol steps, broadcast logs and SMS dispatch log
 */
emergencyRouter.get('/status', (req, res) => {
  try {
    const data = simulation.getEmergency()
    res.json({ success: true, data })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch emergency status', error })
  }
})

/**
 * POST /api/emergency/trigger
 * Triggers emergency protocol — fires SMS/Email/Push broadcast to all registered contacts
 */
emergencyRouter.post('/trigger', async (req, res) => {
  try {
    const result = simulation.triggerEmergency()

    // ─── Fire multi-channel emergency broadcast ───────────────────────────────
    const message = '⚠️ TEMPLE EVACUATION ORDER: A critical crowd density emergency has been declared. Exit through Gates E1-E4 immediately. Follow security personnel. Do NOT block exits.'
    try {
      await notificationService.broadcastEmergency(message, ['all'])
    } catch (broadcastErr) {
      console.error('[Emergency Broadcast Error]', broadcastErr)
    }

    res.json({ success: true, result, broadcastSent: true })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to trigger emergency protocol', error })
  }
})

/**
 * POST /api/emergency/reset
 * Resets emergency protocol and sends all-clear notification
 */
emergencyRouter.post('/reset', async (req, res) => {
  try {
    const result = simulation.resetEmergency()

    // ─── All-clear broadcast ──────────────────────────────────────────────────
    try {
      await notificationService.broadcastEmergency(
        '✅ ALL CLEAR: The emergency at the temple premises has been resolved. Normal operations have resumed. Thank you for your patience.',
        ['all']
      )
    } catch (broadcastErr) {
      console.error('[All-Clear Broadcast Error]', broadcastErr)
    }

    res.json({ success: true, result, broadcastSent: true })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to reset emergency state', error })
  }
})

/**
 * GET /api/emergency/broadcast-log
 * Returns audit log of all emergency SMS/Email/Push notifications sent
 */
emergencyRouter.get('/broadcast-log', (req, res) => {
  try {
    const logs = notificationService.getLogs({ limit: 50, channel: undefined, status: undefined })
    res.json({ success: true, data: logs })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch broadcast log', error })
  }
})
