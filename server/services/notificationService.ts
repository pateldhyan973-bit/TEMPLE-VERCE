import { v4 as uuidv4 } from 'uuid'

export type NotificationChannel = 'sms' | 'email' | 'push' | 'whatsapp'
export type NotificationPriority = 'low' | 'normal' | 'high' | 'critical'
export type NotificationStatus = 'pending' | 'sent' | 'delivered' | 'failed' | 'bounced'

export interface NotificationTemplate {
  id: string
  name: string
  channel: NotificationChannel
  subject: string
  body: string
  variables: string[]
  createdAt: string
  updatedAt: string
}

export interface NotificationLog {
  id: string
  templateId?: string
  channel: NotificationChannel
  to: string
  subject: string
  body: string
  status: NotificationStatus
  priority: NotificationPriority
  error?: string
  sentAt: string
  deliveredAt?: string
  metadata?: Record<string, any>
}

export interface UserPreferences {
  userId: string
  sms: boolean
  email: boolean
  push: boolean
  whatsapp: boolean
  emergencyOnly: boolean
  quietHours: { start: string; end: string }
  language: string
  updatedAt: string
}

export interface SendNotificationOptions {
  templateId?: string
  channel: NotificationChannel
  to: string
  subject?: string
  body?: string
  variables?: Record<string, string>
  priority?: NotificationPriority
}

export interface BroadcastOptions {
  templateId?: string
  channel: NotificationChannel
  recipients: string[]
  subject?: string
  body?: string
  variables?: Record<string, string>
  priority?: NotificationPriority
}

// Default templates
const DEFAULT_TEMPLATES: Omit<NotificationTemplate, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'Emergency Alert',
    channel: 'sms',
    subject: '',
    body: '🚨 EMERGENCY: {message} Please follow instructions from temple authorities immediately.',
    variables: ['message']
  },
  {
    name: 'Emergency Alert Email',
    channel: 'email',
    subject: '🚨 TEMPLE EMERGENCY ALERT',
    body: `
      <h2>Emergency Alert</h2>
      <p><strong>Message:</strong> {message}</p>
      <p><strong>Time:</strong> {timestamp}</p>
      <p>Please follow instructions from temple authorities immediately.</p>
      <p>For updates, visit the Temple Management Portal.</p>
    `,
    variables: ['message', 'timestamp']
  },
  {
    name: 'Gate Change Notification',
    channel: 'sms',
    subject: '',
    body: '📍 Gate Update: {gateName} is now {status}. Estimated wait: {waitTime} mins. Redirect to {alternateGate} if needed.',
    variables: ['gateName', 'status', 'waitTime', 'alternateGate']
  },
  {
    name: 'Virtual Pass Confirmed',
    channel: 'email',
    subject: '✅ Your Virtual Darshan Pass - {passId}',
    body: `
      <h2>Virtual Darshan Pass Confirmed</h2>
      <p><strong>Pass ID:</strong> {passId}</p>
      <p><strong>Name:</strong> {pilgrimName}</p>
      <p><strong>Gate:</strong> {gate}</p>
      <p><strong>Time Slot:</strong> {timeSlot}</p>
      <p><strong>Status:</strong> {status}</p>
      <p>Present this pass at the gate for priority entry.</p>
    `,
    variables: ['passId', 'pilgrimName', 'gate', 'timeSlot', 'status']
  },
  {
    name: 'Virtual Pass Confirmed SMS',
    channel: 'sms',
    subject: '',
    body: '✅ Pass Confirmed: {passId} for {gate} at {timeSlot}. Show this at entry.',
    variables: ['passId', 'gate', 'timeSlot']
  },
  {
    name: 'Queue Position Update',
    channel: 'push',
    subject: 'Queue Update',
    body: 'Your queue position: {position}. Estimated wait: {waitTime} mins.',
    variables: ['position', 'waitTime']
  },
  {
    name: 'VIP Arrival Alert',
    channel: 'sms',
    subject: '',
    body: '🛡️ VIP ALERT: {vipName} arriving at {gate} in {minutes} mins. Protocol: {protocolLevel}. Escort: {escortName}',
    variables: ['vipName', 'gate', 'minutes', 'protocolLevel', 'escortName']
  },
  {
    name: 'Incident Assigned',
    channel: 'push',
    subject: 'New Incident Assigned',
    body: 'Incident #{incidentId} assigned to you: {title} at {location}. Priority: {priority}',
    variables: ['incidentId', 'title', 'location', 'priority']
  },
  {
    name: 'Density Threshold Alert',
    channel: 'email',
    subject: '⚠️ Crowd Density Threshold Exceeded - {zoneName}',
    body: `
      <h2>Density Alert</h2>
      <p><strong>Zone:</strong> {zoneName}</p>
      <p><strong>Current Density:</strong> {density}%</p>
      <p><strong>Threshold:</strong> {threshold}%</p>
      <p><strong>Time:</strong> {timestamp}</p>
      <p>Recommended action: {action}</p>
    `,
    variables: ['zoneName', 'density', 'threshold', 'timestamp', 'action']
  },
  {
    name: 'Daily Summary Report',
    channel: 'email',
    subject: '📊 Daily Temple Operations Summary - {date}',
    body: `
      <h2>Daily Operations Summary</h2>
      <p><strong>Date:</strong> {date}</p>
      <p><strong>Total Pilgrims:</strong> {totalPilgrims}</p>
      <p><strong>Peak Density:</strong> {peakDensity}%</p>
      <p><strong>Incidents:</strong> {incidentCount}</p>
      <p><strong>Emergency Activations:</strong> {emergencyCount}</p>
      <p><strong>Virtual Passes Issued:</strong> {passesIssued}</p>
      <p><strong>Avg Response Time:</strong> {avgResponseTime}s</p>
    `,
    variables: ['date', 'totalPilgrims', 'peakDensity', 'incidentCount', 'emergencyCount', 'passesIssued', 'avgResponseTime']
  }
]

class NotificationService {
  private templates: Map<string, NotificationTemplate> = new Map()
  private logs: NotificationLog[] = []
  private preferences: Map<string, UserPreferences> = new Map()
  private providers: Map<NotificationChannel, NotificationProvider> = new Map()

  constructor() {
    // Initialize default templates
    DEFAULT_TEMPLATES.forEach(t => {
      const id = uuidv4()
      const now = new Date().toISOString()
      this.templates.set(id, { ...t, id, createdAt: now, updatedAt: now })
    })

    // Initialize mock providers
    this.providers.set('sms', new MockSMSProvider())
    this.providers.set('email', new MockEmailProvider())
    this.providers.set('push', new MockPushProvider())
    this.providers.set('whatsapp', new MockWhatsAppProvider())
  }

  getTemplates(): NotificationTemplate[] {
    return Array.from(this.templates.values())
  }

  createTemplate(template: Omit<NotificationTemplate, 'id' | 'createdAt' | 'updatedAt'>): NotificationTemplate {
    const id = uuidv4()
    const now = new Date().toISOString()
    const newTemplate: NotificationTemplate = { ...template, id, createdAt: now, updatedAt: now }
    this.templates.set(id, newTemplate)
    return newTemplate
  }

  getTemplate(id: string): NotificationTemplate | undefined {
    return this.templates.get(id)
  }

  async sendNotification(options: SendNotificationOptions): Promise<NotificationLog> {
    const { templateId, channel, to, subject, body, variables, priority = 'normal' } = options

    let finalSubject = subject
    let finalBody = body

    if (templateId) {
      const template = this.templates.get(templateId)
      if (!template) throw new Error(`Template ${templateId} not found`)
      if (template.channel !== channel) throw new Error(`Template channel mismatch`)

      finalSubject = this.interpolate(template.subject, variables || {})
      finalBody = this.interpolate(template.body, variables || {})
    }

    if (!finalBody) throw new Error('Notification body is required')

    const provider = this.providers.get(channel)
    if (!provider) throw new Error(`No provider for channel: ${channel}`)

    const log: NotificationLog = {
      id: uuidv4(),
      templateId,
      channel,
      to,
      subject: finalSubject || '',
      body: finalBody,
      status: 'pending',
      priority,
      sentAt: new Date().toISOString(),
      metadata: { variables }
    }

    this.logs.unshift(log)

    try {
      await provider.send(to, finalSubject || '', finalBody, priority)
      log.status = 'sent'
      log.deliveredAt = new Date().toISOString()
    } catch (error: any) {
      log.status = 'failed'
      log.error = error.message
    }

    // Keep only last 10000 logs
    if (this.logs.length > 10000) this.logs = this.logs.slice(0, 10000)

    return log
  }

  async broadcastNotification(options: BroadcastOptions): Promise<NotificationLog[]> {
    const { recipients, ...rest } = options
    const results: NotificationLog[] = []

    for (const recipient of recipients) {
      try {
        const result = await this.sendNotification({ ...rest, to: recipient })
        results.push(result)
      } catch (error) {
        results.push({
          id: uuidv4(),
          templateId: rest.templateId,
          channel: rest.channel,
          to: recipient,
          subject: '',
          body: '',
          status: 'failed',
          priority: rest.priority || 'normal',
          error: error instanceof Error ? error.message : 'Unknown error',
          sentAt: new Date().toISOString()
        })
      }
    }

    return results
  }

  getLogs(filters: {
    limit?: number
    offset?: number
    channel?: string
    status?: string
    startDate?: string
    endDate?: string
  }): NotificationLog[] {
    let filtered = [...this.logs]

    if (filters.channel) filtered = filtered.filter(l => l.channel === filters.channel)
    if (filters.status) filtered = filtered.filter(l => l.status === filters.status)
    if (filters.startDate) filtered = filtered.filter(l => l.sentAt >= filters.startDate!)
    if (filters.endDate) filtered = filtered.filter(l => l.sentAt <= filters.endDate!)

    return filtered.slice(filters.offset || 0, (filters.offset || 0) + (filters.limit || 100))
  }

  updatePreferences(userId: string, preferences: Partial<UserPreferences>): UserPreferences {
    const existing = this.preferences.get(userId) || {
      userId,
      sms: true,
      email: true,
      push: true,
      whatsapp: false,
      emergencyOnly: false,
      quietHours: { start: '22:00', end: '07:00' },
      language: 'en',
      updatedAt: new Date().toISOString()
    }

    const updated: UserPreferences = {
      ...existing,
      ...preferences,
      updatedAt: new Date().toISOString()
    }

    this.preferences.set(userId, updated)
    return updated
  }

  getPreferences(userId: string): UserPreferences {
    return this.preferences.get(userId) || {
      userId,
      sms: true,
      email: true,
      push: true,
      whatsapp: false,
      emergencyOnly: false,
      quietHours: { start: '22:00', end: '07:00' },
      language: 'en',
      updatedAt: new Date().toISOString()
    }
  }

  async sendTestNotification(channel: NotificationChannel, to: string): Promise<NotificationLog> {
    return this.sendNotification({
      channel,
      to,
      subject: 'Test Notification',
      body: `This is a test notification from Temple Crowd Management System at ${new Date().toLocaleTimeString()}`,
      priority: 'normal'
    })
  }

  private interpolate(template: string, variables: Record<string, string>): string {
    return template.replace(/\{(\w+)\}/g, (match, key) => variables[key] || match)
  }

  // Emergency broadcast to all channels
  async broadcastEmergency(message: string, recipientGroups: string[] = ['all']): Promise<NotificationLog[]> {
    const results: NotificationLog[] = []
    const timestamp = new Date().toISOString()

    // SMS to all registered users
    const smsRecipients = this.getRecipientsForGroup('sms', recipientGroups)
    if (smsRecipients.length > 0) {
      const smsResults = await this.broadcastNotification({
        templateId: this.getTemplateByName('Emergency Alert')?.id,
        channel: 'sms',
        recipients: smsRecipients,
        variables: { message, timestamp },
        priority: 'critical'
      })
      results.push(...smsResults)
    }

    // Email to admins
    const emailRecipients = this.getRecipientsForGroup('email', recipientGroups)
    if (emailRecipients.length > 0) {
      const emailResults = await this.broadcastNotification({
        templateId: this.getTemplateByName('Emergency Alert Email')?.id,
        channel: 'email',
        recipients: emailRecipients,
        variables: { message, timestamp },
        priority: 'critical'
      })
      results.push(...emailResults)
    }

    // Push to all app users
    const pushRecipients = this.getRecipientsForGroup('push', recipientGroups)
    if (pushRecipients.length > 0) {
      const pushResults = await this.broadcastNotification({
        channel: 'push',
        recipients: pushRecipients,
        body: `🚨 Emergency Alert: ${message}`,
        priority: 'critical'
      })
      results.push(...pushResults)
    }

    return results
  }

  private getTemplateByName(name: string): NotificationTemplate | undefined {
    return Array.from(this.templates.values()).find(t => t.name === name)
  }

  private getRecipientsForGroup(channel: NotificationChannel, groups: string[]): string[] {
    // In production, query database for users in groups with channel preference
    // Simulating a large devotee database + staff contacts for emergency broadcast
    const mockRecipients: Record<NotificationChannel, string[]> = {
      sms: [
        // E-Pass registered devotees
        '+91 98765 43210', // Rajesh Sharma — PASS-8841
        '+91 98765 43211', // Priya Patel — PASS-9932
        '+91 87654 32109', // Arun Krishnan — PASS-3312
        '+91 76543 21098', // Meena Devi — PASS-7700
        '+91 65432 10987', // Suresh Iyer — PASS-5501
        // Staff contacts
        '+91 99887 76655', // Security Team Alpha
        '+91 99887 76656', // Medical Dr. Anita
        '+91 99887 76657', // Gate Control Room
        '+91 99887 76658', // VIP Escort Team
      ],
      email: [
        'admin@templeverse.gov.in',
        'security@templeverse.gov.in',
        'medical@templeverse.gov.in',
        'operations@templeverse.gov.in',
        'district.collector@gov.in',
      ],
      push: [
        'devotee_fcm_token_PASS8841',
        'devotee_fcm_token_PASS9932',
        'devotee_fcm_token_PASS3312',
        'devotee_fcm_token_PASS7700',
        'staff_fcm_token_SEC001',
        'staff_fcm_token_MED001',
      ],
      whatsapp: [
        '+91 98765 43210',
        '+91 98765 43211',
        '+91 99887 76655',
      ]
    }
    return mockRecipients[channel] || []
  }
}

// Provider interfaces
interface NotificationProvider {
  send(to: string, subject: string, body: string, priority: NotificationPriority): Promise<void>
}

class MockSMSProvider implements NotificationProvider {
  async send(to: string, subject: string, body: string, priority: NotificationPriority): Promise<void> {
    console.log(`[SMS] To: ${to} | Priority: ${priority} | Body: ${body.substring(0, 50)}...`)
    // Simulate network delay
    await new Promise(r => setTimeout(r, 100))
    // Simulate occasional failure
    if (Math.random() < 0.02) throw new Error('SMS gateway timeout')
  }
}

class MockEmailProvider implements NotificationProvider {
  async send(to: string, subject: string, body: string, priority: NotificationPriority): Promise<void> {
    console.log(`[EMAIL] To: ${to} | Subject: ${subject} | Priority: ${priority}`)
    await new Promise(r => setTimeout(r, 150))
    if (Math.random() < 0.01) throw new Error('SMTP connection failed')
  }
}

class MockPushProvider implements NotificationProvider {
  async send(to: string, subject: string, body: string, priority: NotificationPriority): Promise<void> {
    console.log(`[PUSH] To: ${to} | Title: ${subject} | Priority: ${priority}`)
    await new Promise(r => setTimeout(r, 50))
  }
}

class MockWhatsAppProvider implements NotificationProvider {
  async send(to: string, subject: string, body: string, priority: NotificationPriority): Promise<void> {
    console.log(`[WHATSAPP] To: ${to} | Priority: ${priority} | Body: ${body.substring(0, 50)}...`)
    await new Promise(r => setTimeout(r, 200))
    if (Math.random() < 0.05) throw new Error('WhatsApp API rate limited')
  }
}

export const notificationService = new NotificationService()