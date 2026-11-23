import express from 'express'
import cors from 'cors'
import http from 'http'
import path from 'path'
import fs from 'fs'
import { WebSocketServer, WebSocket } from 'ws'

import { overviewRouter } from './routes/overview.js'
import { crowdRouter } from './routes/crowd.js'
import { detectionRouter } from './routes/detection.js'
import { predictionRouter } from './routes/prediction.js'
import { routesRouter } from './routes/routes.js'
import { emergencyRouter } from './routes/emergency.js'
import { analyticsRouter } from './routes/analytics.js'
import { virtualQueueRouter } from './routes/virtualQueue.js'
import { templeRouter } from './routes/temple.js'
import { notificationsRouter } from './routes/notifications.js'
import { incidentsRouter } from './routes/incidents.js'
import { simulation } from './simulationManager.js'

const app = express()
const PORT = process.env.PORT_BACKEND || 5000

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'Pilgrim Crowd Management System Backend Engine',
    version: '4.2.0',
    timestamp: new Date().toISOString()
  })
})

// Mount REST API Routers
app.use('/api/overview', overviewRouter)
app.use('/api/crowd', crowdRouter)
app.use('/api/detection', detectionRouter)
app.use('/api/prediction', predictionRouter)
app.use('/api/routes', routesRouter)
app.use('/api/emergency', emergencyRouter)
app.use('/api/analytics', analyticsRouter)
app.use('/api/virtual-queue', virtualQueueRouter)
app.use('/api/temple', templeRouter)
app.use('/api/notifications', notificationsRouter)
app.use('/api/incidents', incidentsRouter)

// Serve production static assets from dist folder if available
const distPath = path.resolve(process.cwd(), 'dist')
app.use(express.static(distPath))
app.get('/{*splat}', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/ws')) return next()
  const indexPath = path.join(distPath, 'index.html')
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath)
  }
  next()
})

const clients = new Set<WebSocket>()

// Broadcast real-time simulation updates every 2 seconds to WebSocket clients
setInterval(() => {
  if (clients.size === 0) return
  const updatePayload = JSON.stringify({
    type: 'LIVE_UPDATE',
    overview: simulation.getOverview(),
    zones: simulation.getCrowdZones(),
    timestamp: new Date().toISOString()
  })

  for (const client of clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(updatePayload)
    }
  }
}, 2000)

function startServer(portToUse: number) {
  const currentServer = http.createServer(app)
  const currentWss = new WebSocketServer({ server: currentServer, path: '/ws/live' })

  currentWss.on('error', () => {})

  currentWss.on('connection', (ws) => {
    clients.add(ws)
    console.log(`[WS] Client connected. Active clients: ${clients.size}`)

    // Send initial snapshot immediately
    ws.send(JSON.stringify({ type: 'SNAPSHOT', data: simulation.getOverview() }))

    ws.on('close', () => {
      clients.delete(ws)
      console.log(`[WS] Client disconnected. Active clients: ${clients.size}`)
    })
  })

  currentServer.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`⚠️ Port ${portToUse} is in use. Trying port ${portToUse + 1}...`)
      currentServer.close()
      startServer(portToUse + 1)
    } else {
      console.error('❌ Server error:', err)
    }
  })

  currentServer.listen(portToUse, () => {
    console.log(`=======================================================`)
    console.log(`🚀 PILGRIM FLOW AI - BACKEND SERVER ACTIVE`)
    console.log(`📡 REST API & UI: http://localhost:${portToUse}`)
    console.log(`⚡ WebSocket:     ws://localhost:${portToUse}/ws/live`)
    console.log(`=======================================================`)
  })
}

startServer(Number(PORT))
