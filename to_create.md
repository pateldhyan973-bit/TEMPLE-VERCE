# Files to Create for Feature 1 Frontend (Multi-Channel Alert System)

## Frontend Files

### 1. `src/pages/NotificationCenter.tsx`
**Admin dashboard for notification management**
- Template management (list, create, edit, delete)
- Send/broadcast forms (template or custom, channel selection, recipients)
- Delivery logs table with filters (channel, status, date range)
- Test notification button
- Uses existing UI classes: `.glass`, `.glass-hi`, `.badge-*`, `.orbitron`, `.mono`

### 2. `src/components/NotificationPreferences.tsx`
**Pilgrim notification preference settings**
- Toggle switches for: SMS, Email, Push, WhatsApp
- Quiet hours selector (start/end time)
- Emergency-only mode checkbox
- Language preference dropdown
- Save button calling `/api/notifications/preferences`

## Modified Files

### 3. `src/App.tsx`
**Add route for NotificationCenter**
```tsx
import NotificationCenter from './pages/NotificationCenter'
// In renderPage() switch:
case 'notifications': return <NotificationCenter />
```

### 4. `src/components/NavBar.tsx`
**Add notifications nav item (admin only)**
```tsx
const NAV_ITEMS = [
  // ... existing items
  { id: 'notifications', icon: '📢', label: 'Notifications' },
]
// Filter: only show if role === 'admin' || role === 'ADMIN'
```

## Optional Reusable Hook

### 5. `src/hooks/useNotifications.ts`
**Shared hook for notification API calls**
- `fetchTemplates()`
- `createTemplate(data)`
- `sendNotification(options)`
- `broadcastNotification(options)`
- `fetchLogs(filters)`
- `fetchPreferences(userId)`
- `updatePreferences(userId, preferences)`

---

## Backend API Already Available

All endpoints implemented in `server/routes/notifications.ts`:
- `GET /api/notifications/templates`
- `POST /api/notifications/templates`
- `POST /api/notifications/send`
- `POST /api/notifications/broadcast`
- `GET /api/notifications/logs`
- `POST /api/notifications/preferences`
- `GET /api/notifications/preferences/:userId`
- `POST /api/notifications/test`

---

## Quick Test

```bash
# Terminal 1
npm run server

# Terminal 2  
npm run dev

# Visit http://localhost:8443, sign in as ADMIN (secret: ADMIN2026)
# Navigate to Notifications in sidebar
```