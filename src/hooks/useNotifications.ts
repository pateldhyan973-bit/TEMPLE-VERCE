type NotificationFilters = {
  channel?: string
  status?: string
  dateFrom?: string
  dateTo?: string
}

type RequestOptions = Record<string, unknown>

const jsonHeaders = {
  'Content-Type': 'application/json',
}

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...jsonHeaders,
      ...(options.headers || {}),
    },
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(text || `Request failed: ${response.status}`)
  }

  if (response.status === 204) return undefined as T
  return response.json()
}

export function useNotifications() {
  const fetchTemplates = () =>
    request<any[]>('/api/notifications/templates')

  const createTemplate = (data: RequestOptions) =>
    request('/api/notifications/templates', {
      method: 'POST',
      body: JSON.stringify(data),
    })

  const sendNotification = (options: RequestOptions) =>
    request('/api/notifications/send', {
      method: 'POST',
      body: JSON.stringify(options),
    })

  const broadcastNotification = (options: RequestOptions) =>
    request('/api/notifications/broadcast', {
      method: 'POST',
      body: JSON.stringify(options),
    })

  const fetchLogs = (filters: NotificationFilters = {}) => {
    const params = new URLSearchParams()

    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all') params.set(key, value)
    })

    const query = params.toString()
    return request<any[]>(
      `/api/notifications/logs${query ? `?${query}` : ''}`
    )
  }

  const fetchPreferences = (userId?: string) => {
    if (!userId) return Promise.resolve<any>(null)
    return request<any>(`/api/notifications/preferences/${encodeURIComponent(userId)}`)
  }

  const updatePreferences = (userId: string | undefined, preferences: RequestOptions) =>
    request('/api/notifications/preferences', {
      method: 'POST',
      body: JSON.stringify({
        userId,
        ...preferences,
      }),
    })

  const testNotification = (options: RequestOptions = {}) =>
    request('/api/notifications/test', {
      method: 'POST',
      body: JSON.stringify(options),
    })

  return {
    fetchTemplates,
    createTemplate,
    sendNotification,
    broadcastNotification,
    fetchLogs,
    fetchPreferences,
    updatePreferences,
    testNotification,
  }
}