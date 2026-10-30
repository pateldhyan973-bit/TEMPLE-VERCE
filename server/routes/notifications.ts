import { Router, Request, Response } from 'express'
import { notificationService } from '../services/notificationService.js'

export const notificationsRouter = Router()

/**
 * GET /api/notifications/templates
 * List all notification templates
 */
notificationsRouter.get('/templates', async (req: Request, res: Response) => {
  try {
    const templates = notificationService.getTemplates()
    res.json({ success: true, data: templates })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch templates', error })
  }
})

/**
 * POST /api/notifications/templates
 * Create a new notification template
 */
notificationsRouter.post('/templates', async (req: Request, res: Response) => {
  try {
    const { name, channel, subject, body, variables } = req.body
    const template = notificationService.createTemplate({ name, channel, subject, body, variables })
    res.json({ success: true, data: template })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create template', error })
  }
})

/**
 * POST /api/notifications/send
 * Send a notification using a template or custom content
 */
notificationsRouter.post('/send', async (req: Request, res: Response) => {
  try {
    const { templateId, channel, to, subject, body, variables, priority } = req.body
    const result = await notificationService.sendNotification({
      templateId,
      channel,
      to,
      subject,
      body,
      variables,
      priority: priority || 'normal'
    })
    res.json({ success: true, data: result })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to send notification', error })
  }
})

/**
 * POST /api/notifications/broadcast
 * Send notification to multiple recipients
 */
notificationsRouter.post('/broadcast', async (req: Request, res: Response) => {
  try {
    const { templateId, channel, recipients, variables, priority } = req.body
    const results = await notificationService.broadcastNotification({
      templateId,
      channel,
      recipients,
      variables,
      priority: priority || 'normal'
    })
    res.json({ success: true, data: results })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to broadcast notification', error })
  }
})

/**
 * GET /api/notifications/logs
 * Get notification delivery logs
 */
notificationsRouter.get('/logs', async (req: Request, res: Response) => {
  try {
    const { limit = 100, offset = 0, channel, status, startDate, endDate } = req.query
    const logs = notificationService.getLogs({
      limit: Number(limit),
      offset: Number(offset),
      channel: channel as string,
      status: status as string,
      startDate: startDate as string,
      endDate: endDate as string
    })
    res.json({ success: true, data: logs })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch logs', error })
  }
})

/**
 * POST /api/notifications/preferences
 * Update pilgrim notification preferences
 */
notificationsRouter.post('/preferences', async (req: Request, res: Response) => {
  try {
    const { userId, preferences } = req.body
    const result = notificationService.updatePreferences(userId, preferences)
    res.json({ success: true, data: result })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update preferences', error })
  }
})

/**
 * GET /api/notifications/preferences/:userId
 * Get pilgrim notification preferences
 */
notificationsRouter.get('/preferences/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params
    const preferences = notificationService.getPreferences(userId)
    res.json({ success: true, data: preferences })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch preferences', error })
  }
})

/**
 * POST /api/notifications/test
 * Send test notification
 */
notificationsRouter.post('/test', async (req: Request, res: Response) => {
  try {
    const { channel, to } = req.body
    const result = await notificationService.sendTestNotification(channel, to)
    res.json({ success: true, data: result })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to send test notification', error })
  }
})