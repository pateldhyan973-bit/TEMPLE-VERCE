import { useEffect, useRef, useCallback } from 'react'

interface Props {
  emergency?: boolean
  onStats?: (stats: { total: number; gates: number[] }) => void
}

interface Point { x: number; y: number }
interface Pilgrim {
  id: number; x: number; y: number
  path: Point[]; seg: number; t: number
  speed: number; alpha: number; done: boolean
  pathKey: string; hue: number
}

// Logical canvas space
const LW = 900, LH = 500

// Temple complex layout
const OUTER  = { x: 135, y: 65,  w: 630, h: 390 }
const INNER  = { x: 205, y: 125, w: 490, h: 270 }
const TEMPLE = { x: 340, y: 180, w: 220, h: 140 }
const SANCTUM= { x: 382, y: 205, w: 136, h: 90  }

// Paths
const PATHS: Record<string, Point[]> = {
  south: [{x:450,y:510},{x:450,y:465},{x:450,y:400},{x:450,y:340},{x:450,y:265},{x:450,y:238}],
  west:  [{x:80,y:267},{x:135,y:267},{x:205,y:258},{x:295,y:250},{x:360,y:244},{x:450,y:238}],
  east:  [{x:820,y:267},{x:765,y:267},{x:695,y:258},{x:610,y:250},{x:540,y:244},{x:450,y:238}],
  east_div: [{x:820,y:267},{x:765,y:267},{x:820,y:145},{x:700,y:82},{x:550,y:68},{x:452,y:68},{x:450,y:128},{x:450,y:205},{x:450,y:238}],
  north: [{x:450,y:28},{x:450,y:65},{x:450,y:128},{x:450,y:200},{x:450,y:238}],
  exit_west: [{x:450,y:238},{x:300,y:250},{x:205,y:260},{x:135,y:280},{x:60,y:300}],
  exit_south:[{x:450,y:238},{x:450,y:320},{x:450,y:400},{x:450,y:470},{x:450,y:520}],
}

const ZONES = [
  {id:'south',  x:392, y:310, w:116, h:200, cap:45,  label:'South Corridor'},
  {id:'west',   x:125, y:228, w:250, h:86,  cap:38,  label:'West Corridor'},
  {id:'east',   x:525, y:228, w:250, h:86,  cap:38,  label:'East Corridor'},
  {id:'north',  x:394, y:58,  w:112, h:200, cap:30,  label:'North Corridor'},
  {id:'plaza',  x:196, y:116, w:508, h:290, cap:170, label:'Temple Plaza'},
]

function densityRGB(d: number): [number, number, number] {
  if (d < 0.35) return [16, 185, 129]  // Emerald
  if (d < 0.6)  return [245, 158, 11]  // Amber
  if (d < 0.82) return [249, 115, 22]  // Orange
  return [244, 63, 94]                 // Rose
}

function lerp(a: number, b: number, t: number) { return a + (b - a) * t }

let _uid = 0

export default function PilgrimCanvas({ emergency = false, onStats }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stateRef = useRef({
    pilgrims: [] as Pilgrim[],
    tick: 0,
    phase: 'normal' as 'normal' | 'congested' | 'emergency',
    phaseTimer: 0,
    densities: {} as Record<string, number>,
    smoothDensities: {} as Record<string, number>,
    bboxes: [] as { x: number; y: number; w: number; h: number; life: number }[],
    bboxTimer: 0,
    rafId: 0,
  })

  const spawn = useCallback((pathKey: string) => {
    const path = PATHS[pathKey]
    if (!path) return
    const p: Pilgrim = {
      id: _uid++, x: path[0].x, y: path[0].y,
      path, seg: 0, t: 0,
      speed: 0.013 + Math.random() * 0.007,
      alpha: 1, done: false, pathKey,
      hue: 35 + Math.random() * 20, // Warm golden ochre/amber
    }
    stateRef.current.pilgrims.push(p)
  }, [])

  const drawScene = useCallback((ctx: CanvasRenderingContext2D, scale: number, tick: number) => {
    const s = stateRef.current
    const W = LW * scale, H = LH * scale
    const sc = (n: number) => n * scale

    ctx.clearRect(0, 0, W, H)

    // Deep Sandalwood Canvas Floor
    ctx.fillStyle = '#0c0b0a'
    ctx.fillRect(0, 0, W, H)

    // Subtle Architectural Grid
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.04)'
    ctx.lineWidth = 1
    const gs = sc(40)
    for (let x = 0; x < W; x += gs) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke() }
    for (let y = 0; y < H; y += gs) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke() }

    // Zone Heatmap Fills
    for (const z of ZONES) {
      const d = s.smoothDensities[z.id] ?? 0
      const [r, g, b] = densityRGB(d)
      const alpha = 0.06 + d * 0.18
      ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`
      ctx.strokeStyle = `rgba(${r},${g},${b},${0.15 + d * 0.3})`
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.roundRect(sc(z.x), sc(z.y), sc(z.w), sc(z.h), sc(8))
      ctx.fill(); ctx.stroke()
    }

    // Outer Perimeter Wall
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.2)'
    ctx.lineWidth = sc(1.5)
    ctx.fillStyle = 'rgba(24, 21, 18, 0.6)'
    ctx.beginPath()
    ctx.roundRect(sc(OUTER.x), sc(OUTER.y), sc(OUTER.w), sc(OUTER.h), sc(12))
    ctx.fill(); ctx.stroke()

    // Inner Courtyard Wall
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.12)'
    ctx.lineWidth = sc(1)
    ctx.fillStyle = 'rgba(36, 32, 28, 0.4)'
    ctx.beginPath()
    ctx.roundRect(sc(INNER.x), sc(INNER.y), sc(INNER.w), sc(INNER.h), sc(8))
    ctx.fill(); ctx.stroke()

    // Temple Main Structure (Sacred Warm Stone)
    ctx.fillStyle = '#181512'
    ctx.strokeStyle = '#f59e0b'
    ctx.lineWidth = sc(2)
    ctx.beginPath()
    ctx.roundRect(sc(TEMPLE.x), sc(TEMPLE.y), sc(TEMPLE.w), sc(TEMPLE.h), sc(8))
    ctx.fill(); ctx.stroke()

    // Inner Sanctum (Garbhagriha Bronze Core)
    ctx.fillStyle = 'rgba(245, 158, 11, 0.08)'
    ctx.strokeStyle = '#fbbf24'
    ctx.lineWidth = sc(1.5)
    ctx.beginPath()
    ctx.roundRect(sc(SANCTUM.x), sc(SANCTUM.y), sc(SANCTUM.w), sc(SANCTUM.h), sc(6))
    ctx.fill(); ctx.stroke()

    // Temple Core Typography
    ctx.fillStyle = '#f8fafc'
    ctx.font = `bold ${sc(11)}px Plus Jakarta Sans, sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('GARBHAGRIHA', sc(450), sc(244))
    ctx.font = `600 ${sc(8)}px JetBrains Mono, monospace`
    ctx.fillStyle = '#f59e0b'
    ctx.fillText('INNER SANCTUM', sc(450), sc(260))

    // Paths
    const pathsToDraw = s.phase === 'emergency'
      ? [['south', 'exit_south'], ['west', 'exit_west']] as const
      : s.phase === 'congested'
        ? [['south', 'south'], ['west', 'west'], ['east', 'east_div'], ['north', 'north']] as const
        : [['south', 'south'], ['west', 'west'], ['east', 'east'], ['north', 'north']] as const

    for (const [, pk] of pathsToDraw) {
      const pts = PATHS[pk]
      if (!pts || pts.length < 2) continue
      const isDiv = pk === 'east_div'
      const isEmg = pk.startsWith('exit')

      let strokeCol = 'rgba(245, 158, 11, 0.6)' // Sacred Amber nominal
      if (isDiv) strokeCol = 'rgba(16, 185, 129, 0.7)' // Green diversion
      else if (isEmg) strokeCol = 'rgba(244, 63, 94, 0.8)' // Emergency red

      ctx.setLineDash([sc(6), sc(4)])
      ctx.lineDashOffset = -(tick * 0.4) % sc(10)
      ctx.strokeStyle = strokeCol
      ctx.lineWidth = sc(1.5)
      ctx.beginPath()
      ctx.moveTo(sc(pts[0].x), sc(pts[0].y))
      for (let i = 1; i < pts.length; i++) ctx.lineTo(sc(pts[i].x), sc(pts[i].y))
      ctx.stroke()
      ctx.setLineDash([])
    }

    // Gate Hub Circles
    const gateConfig = [
      { x: 135, y: 267, label: 'Gate 1 (W)', id: 'west',  side: 'left'   },
      { x: 765, y: 267, label: 'Gate 2 (E)', id: 'east',  side: 'right'  },
      { x: 450, y: 465, label: 'Gate 3 (S)', id: 'south', side: 'bottom' },
      { x: 450, y: 65,  label: 'Gate 4 (N)', id: 'north', side: 'top'    },
    ]

    for (const g of gateConfig) {
      const d = s.smoothDensities[g.id] ?? 0
      const [r, gg, b] = densityRGB(d)
      const pct = Math.round(d * 100)

      ctx.beginPath()
      ctx.arc(sc(g.x), sc(g.y), sc(6), 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${r},${gg},${b},0.3)`
      ctx.fill()
      ctx.strokeStyle = `rgba(${r},${gg},${b},0.9)`
      ctx.lineWidth = sc(1.5)
      ctx.stroke()

      const lx = g.side === 'left' ? sc(g.x - 12) : g.side === 'right' ? sc(g.x + 12) : sc(g.x)
      const ly = g.side === 'top' ? sc(g.y - 12) : g.side === 'bottom' ? sc(g.y + 14) : sc(g.y)
      ctx.font = `600 ${sc(9)}px Plus Jakarta Sans, sans-serif`
      ctx.textAlign = g.side === 'left' ? 'right' : g.side === 'right' ? 'left' : 'center'
      ctx.textBaseline = g.side === 'top' ? 'bottom' : g.side === 'bottom' ? 'top' : 'middle'
      ctx.fillStyle = '#e2e8f0'
      ctx.fillText(`${g.label} ${pct}%`, lx, ly)
    }

    // Pilgrims Flowing Particles
    for (const p of s.pilgrims) {
      if (p.done && p.alpha <= 0) continue
      ctx.globalAlpha = p.alpha

      // Subtle shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)'
      ctx.beginPath()
      ctx.ellipse(sc(p.x), sc(p.y) + sc(3), sc(3), sc(1), 0, 0, Math.PI * 2)
      ctx.fill()

      // Devotee Dot (Sacred Ochre Gold)
      ctx.fillStyle = '#fbbf24'
      ctx.beginPath()
      ctx.arc(sc(p.x), sc(p.y), sc(2.5), 0, Math.PI * 2)
      ctx.fill()

      ctx.globalAlpha = 1
    }

    // AI Bounding Boxes (Warm Amber Surveillance Vector)
    for (const bb of s.bboxes) {
      if (bb.life <= 0) continue
      const bbAlpha = Math.min(1, bb.life / 20) * 0.75
      ctx.strokeStyle = `rgba(245, 158, 11, ${bbAlpha})`
      ctx.lineWidth = sc(1)
      ctx.strokeRect(sc(bb.x), sc(bb.y), sc(bb.w), sc(bb.h))

      ctx.fillStyle = `rgba(245, 158, 11, ${bbAlpha})`
      ctx.font = `bold ${sc(8)}px Plus Jakarta Sans`
      ctx.textAlign = 'left'
      ctx.textBaseline = 'bottom'
      ctx.fillText(`CLUSTER DETECTED`, sc(bb.x) + 2, sc(bb.y) - 2)
    }

    // Emergency Status Banner
    if (s.phase === 'emergency') {
      ctx.fillStyle = 'rgba(244, 63, 94, 0.08)'
      ctx.fillRect(0, 0, W, H)
      ctx.fillStyle = '#f43f5e'
      ctx.font = `bold ${sc(12)}px Plus Jakarta Sans`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'top'
      ctx.fillText('EVACUATION WAYFINDING ACTIVE — FOLLOW WEST & SOUTH SIGNAGE', W / 2, sc(10))
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rawCtx = canvas.getContext('2d')
    if (!rawCtx) return
    const ctx: CanvasRenderingContext2D = rawCtx
    const s = stateRef.current

    const resize = () => {
      const container = canvas.parentElement
      if (!container) return
      const dpr = window.devicePixelRatio || 1
      const cw = container.clientWidth
      const ch = Math.round(cw * LH / LW)
      canvas.width  = cw * dpr
      canvas.height = ch * dpr
      canvas.style.width  = cw + 'px'
      canvas.style.height = ch + 'px'
      ctx.scale(dpr, dpr)
    }
    resize()
    const ro = new ResizeObserver(resize)
    if (canvas.parentElement) ro.observe(canvas.parentElement)

    const spawnSchedule: Record<string, number> = { south: 0, west: 0, east: 0, north: 0 }

    function tick() {
      s.tick++
      const t = s.tick

      s.phaseTimer++
      if (!emergency) {
        if (s.phase === 'normal' && s.phaseTimer > 350) { s.phase = 'congested'; s.phaseTimer = 0 }
        if (s.phase === 'congested' && s.phaseTimer > 220) { s.phase = 'normal'; s.phaseTimer = 0 }
      } else {
        s.phase = 'emergency'
      }

      const gateInterval = s.phase === 'emergency' ? 999 : 16
      for (const [gid, pathKey] of [['south', 'south'], ['west', 'west'], ['north', 'north']] as const) {
        spawnSchedule[gid] = (spawnSchedule[gid] ?? 0) + 1
        if (spawnSchedule[gid] >= gateInterval && s.pilgrims.filter(p => p.pathKey.startsWith(gid)).length < 35) {
          spawn(pathKey)
          if (Math.random() < 0.35) spawn(pathKey)
          spawnSchedule[gid] = 0
        }
      }

      spawnSchedule['east'] = (spawnSchedule['east'] ?? 0) + 1
      if (spawnSchedule['east'] >= gateInterval) {
        const pk = s.phase === 'congested' ? 'east_div' : 'east'
        if (s.pilgrims.filter(p => p.pathKey.startsWith('east')).length < 40) {
          spawn(pk)
          if (Math.random() < 0.35) spawn(pk)
        }
        spawnSchedule['east'] = 0
      }

      if (s.phase === 'emergency' && t % 20 === 0) {
        spawn('exit_south')
        spawn('exit_west')
      }

      for (const p of s.pilgrims) {
        if (p.done) { p.alpha -= 0.04; continue }
        p.t += p.speed
        while (p.t >= 1 && p.seg < p.path.length - 2) { p.t -= 1; p.seg++ }
        if (p.seg >= p.path.length - 2) {
          const last = p.path[p.path.length - 1]
          const prev = p.path[p.path.length - 2]
          p.x = lerp(prev.x, last.x, Math.min(1, p.t))
          p.y = lerp(prev.y, last.y, Math.min(1, p.t))
          if (p.t >= 1) p.done = true
        } else {
          p.x = lerp(p.path[p.seg].x, p.path[p.seg + 1].x, p.t)
          p.y = lerp(p.path[p.seg].y, p.path[p.seg + 1].y, p.t)
        }
      }
      s.pilgrims = s.pilgrims.filter(p => !(p.done && p.alpha <= 0))

      for (const z of ZONES) {
        const count = s.pilgrims.filter(p => p.x >= z.x && p.x <= z.x + z.w && p.y >= z.y && p.y <= z.y + z.h).length
        s.densities[z.id] = count / z.cap
      }
      for (const z of ZONES) {
        const target = s.densities[z.id] ?? 0
        const current = s.smoothDensities[z.id] ?? 0
        s.smoothDensities[z.id] = lerp(current, target, 0.08)
      }

      s.bboxTimer++
      if (s.bboxTimer >= 90) {
        s.bboxTimer = 0
        const zone = ZONES[Math.floor(Math.random() * ZONES.length)]
        if ((s.smoothDensities[zone.id] ?? 0) > 0.1) {
          const padding = 15
          s.bboxes.push({
            x: zone.x + padding, y: zone.y + padding,
            w: zone.w - padding * 2, h: zone.h - padding * 2,
            life: 60
          })
        }
      }
      for (const bb of s.bboxes) bb.life--
      s.bboxes = s.bboxes.filter(bb => bb.life > 0)

      if (t % 20 === 0 && onStats) {
        const total = s.pilgrims.length * 120 + 8000
        const gates = ZONES.map(z => Math.round((s.smoothDensities[z.id] ?? 0) * 100))
        onStats({ total, gates })
      }

      const container = canvasRef.current?.parentElement
      if (!container) return
      const scale = container.clientWidth / LW
      drawScene(ctx, scale, t)

      s.rafId = requestAnimationFrame(tick)
    }

    s.rafId = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(s.rafId)
      ro.disconnect()
    }
  }, [emergency, spawn, drawScene, onStats])

  return (
    <canvas
      ref={canvasRef}
      className="block w-full rounded-xl"
    />
  )
}
