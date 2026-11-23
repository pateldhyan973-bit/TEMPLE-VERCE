import { useState, useEffect, useRef } from 'react'
import {
  IconCamera,
  IconBrain,
  IconCheck,
  IconAlert,
  IconActivity,
  IconSparkles,
  IconChevronRight
} from '../components/Icons'

interface BBox { id: number; x: number; y: number; w: number; h: number; label: string; conf: number; life: number }
interface CamStats { id: string; name: string; count: number; density: number; status: string }

const CAMS: CamStats[] = [
  { id: 'CAM-01', name: 'South Gate Entrance', count: 124, density: 0.62, status: 'active' },
  { id: 'CAM-02', name: 'East Courtyard',      count: 89,  density: 0.45, status: 'active' },
  { id: 'CAM-03', name: 'Temple Plaza',        count: 312, density: 0.91, status: 'alert' },
  { id: 'CAM-04', name: 'North Corridor',      count: 44,  density: 0.22, status: 'active' },
  { id: 'CAM-05', name: 'West Gate',           count: 156, density: 0.78, status: 'warning' },
  { id: 'CAM-06', name: 'Medical Zone East',   count: 12,  density: 0.06, status: 'active' },
]

const PIPELINE = [
  { label: 'CCTV Stream', sublabel: '128 RTSP Feeds', icon: IconCamera },
  { label: 'YOLOv9 Engine', sublabel: 'Object & Pose', icon: IconBrain },
  { label: 'Density Map', sublabel: 'Matrix Grid', icon: IconActivity },
  { label: 'Risk Analysis', sublabel: 'LSTM Horizon', icon: IconSparkles },
  { label: 'Flow Action', sublabel: 'Auto Gates', icon: IconAlert },
]

export default function AIDetection() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stateRef = useRef({ bboxes: [] as BBox[], dots: [] as { x: number; y: number; vx: number; vy: number }[], tick: 0, rafId: 0, uid: 0 })
  const [selected, setSelected] = useState<CamStats>(CAMS[0])
  const [liveCams, setLiveCams] = useState(CAMS)
  const [detCount, setDetCount] = useState(124)
  const [pipeStep, setPipeStep] = useState(0)
  const [filterMode, setFilterMode] = useState<'ALL' | 'PERSONS' | 'GROUPS'>('ALL')

  useEffect(() => {
    const t = setInterval(() => setPipeStep(s => (s + 1) % PIPELINE.length), 1000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    async function fetchCameras() {
      try {
        const res = await fetch('/api/detection/cameras')
        if (res.ok) {
          const json = await res.json()
          if (json.success && json.data?.cameras) {
            setLiveCams(json.data.cameras)
          }
        }
      } catch {
        setLiveCams(prev => prev.map(c => ({
          ...c,
          count: Math.max(1, c.count + Math.round((Math.random() - 0.45) * 6)),
          density: Math.max(0.02, Math.min(0.99, c.density + (Math.random() - 0.48) * 0.04)),
        })))
      }
      setDetCount(prev => Math.max(80, prev + Math.round((Math.random() - 0.4) * 8)))
    }

    fetchCameras()
    const t = setInterval(fetchCameras, 2000)
    return () => clearInterval(t)
  }, [])

  // Realistic Video Feed & YOLO Bounding Box Simulation
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const s = stateRef.current

    const W = canvas.width = 640
    const H = canvas.height = 380

    s.dots = Array.from({ length: 85 }, () => ({
      x: 40 + Math.random() * (W - 80),
      y: 40 + Math.random() * (H - 80),
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
    }))

    function spawnBBox() {
      if (s.bboxes.length >= 8) return
      const x = 30 + Math.random() * (W - 120)
      const y = 30 + Math.random() * (H - 100)
      const w = 45 + Math.random() * 85
      const h = 50 + Math.random() * 70
      s.bboxes.push({
        id: s.uid++, x, y, w, h,
        label: Math.random() < 0.35 ? 'GROUP' : 'PERSON',
        conf: 0.88 + Math.random() * 0.11,
        life: 70 + Math.random() * 80,
      })
    }

    let bboxTimer = 0

    function draw() {
      if (!ctx) return
      s.tick++
      const t = s.tick

      // Background obsidian tarmac
      ctx.fillStyle = '#080d1a'
      ctx.fillRect(0, 0, W, H)

      // Perspective corridor lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)'
      ctx.lineWidth = 1
      for (let i = 0; i < W; i += 60) {
        ctx.beginPath()
        ctx.moveTo(i, 0)
        ctx.lineTo(i * 1.2, H)
        ctx.stroke()
      }

      // Move & draw pilgrims
      for (const d of s.dots) {
        d.x += d.vx
        d.y += d.vy
        if (d.x < 20 || d.x > W - 20) d.vx *= -1
        if (d.y < 20 || d.y > H - 20) d.vy *= -1
        d.vx += (Math.random() - 0.5) * 0.05
        d.vy += (Math.random() - 0.5) * 0.05
        d.vx = Math.max(-1, Math.min(1, d.vx))
        d.vy = Math.max(-1, Math.min(1, d.vy))

        // Soft drop shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)'
        ctx.beginPath()
        ctx.ellipse(d.x, d.y + 6, 4, 1.5, 0, 0, Math.PI * 2)
        ctx.fill()

        // Person figure
        ctx.fillStyle = '#94a3b8'
        ctx.beginPath()
        ctx.arc(d.x, d.y, 3, 0, Math.PI * 2)
        ctx.fill()
      }

      // Bounding Boxes
      bboxTimer++
      if (bboxTimer >= 22) { spawnBBox(); bboxTimer = 0 }

      for (const bb of s.bboxes) {
        if (bb.life <= 0) continue
        const alpha = Math.min(1, bb.life / 20)
        const isGroup = bb.label === 'GROUP'
        const color = isGroup ? '#f59e0b' : '#22c55e'

        // Modern clean bounding box
        ctx.strokeStyle = color
        ctx.globalAlpha = alpha * 0.7
        ctx.lineWidth = 1.5
        ctx.strokeRect(bb.x, bb.y, bb.w, bb.h)

        // Box header label pill
        ctx.fillStyle = color
        ctx.globalAlpha = alpha * 0.9
        ctx.fillRect(bb.x, bb.y - 15, 74, 14)

        ctx.fillStyle = '#100e0c'
        ctx.globalAlpha = 1
        ctx.font = 'bold 9px Plus Jakarta Sans, sans-serif'
        ctx.fillText(`${bb.label} ${Math.round(bb.conf * 100)}%`, bb.x + 4, bb.y - 4)

        bb.life--
      }
      ctx.globalAlpha = 1
      s.bboxes = s.bboxes.filter(b => b.life > 0)

      s.rafId = requestAnimationFrame(draw)
    }

    s.rafId = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(s.rafId)
  }, [selected, detCount])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="badge-pill badge-amber">
              <IconCamera size={13} />
              CCTV NEURAL VISION
            </span>
            <span className="text-xs text-slate-400 font-mono">YOLOv9-LARGE ACCELERATED</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
            AI Vision Surveillance & Density Detection
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl mt-1">
            Edge-computed person tracking, group clustering, and automated bottleneck detection across 128 multi-spectrum CCTV feeds.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-xs font-mono text-emerald-400 flex items-center gap-2">
            <span className="status-dot status-dot-emerald pulse-live" />
            <span>GPU INFERENCE: 12.8ms</span>
          </div>
        </div>
      </div>

      {/* Pipeline Status Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {PIPELINE.map((p, i) => {
          const Icon = p.icon
          const isActive = pipeStep === i
          return (
            <div
              key={p.label}
              className={`p-3.5 rounded-xl border transition-all ${
                isActive
                  ? 'bg-amber-500/15 border-amber-500/40 shadow-md shadow-amber-500/10'
                  : 'bg-slate-900/40 border-white/[0.06]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon size={18} className={isActive ? 'text-amber-400' : 'text-slate-400'} />
                <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                  isActive ? 'bg-amber-500/30 text-amber-200' : 'bg-slate-800 text-slate-300'
                }`}>
                  STEP 0{i + 1}
                </span>
              </div>
              <p className="text-xs font-bold text-white font-display truncate">{p.label}</p>
              <p className="text-[11px] text-slate-400 truncate">{p.sublabel}</p>
            </div>
          )
        })}
      </div>

      {/* Main Video Viewport & Cameras Rail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Live Video Canvas (8 cols) */}
        <div className="lg:col-span-8 card-pro overflow-hidden flex flex-col justify-between">
          {/* Viewport Top Bar */}
          <div className="p-4 bg-[#181512] border-b border-white/[0.08] flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <span className="badge-pill badge-rose text-[10px]">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                LIVE 4K STREAM
              </span>
              <span className="text-sm font-bold text-[#fbf9f5] font-mono">{selected.id}</span>
              <span className="text-xs text-[#a89f91] font-medium">({selected.name})</span>
            </div>

            <div className="flex items-center gap-2">
              {(['ALL', 'PERSONS', 'GROUPS'] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => setFilterMode(mode)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                    filterMode === mode
                      ? 'bg-amber-500 text-[#1a1612] font-bold'
                      : 'bg-[#25201b] text-[#a89f91] hover:text-[#fbf9f5]'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Canvas */}
          <div className="relative bg-[#100e0c] flex items-center justify-center">
            <canvas
              ref={canvasRef}
              className="w-full h-auto aspect-[16/10] block"
            />
          </div>

          {/* Telemetry Footer Bar */}
          <div className="p-4 bg-[#181512] border-t border-white/[0.08] grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-[#a89f91] block text-[11px]">Detected Density</span>
              <span className="font-bold text-emerald-400 font-mono text-sm">{detCount} Devotees</span>
            </div>
            <div>
              <span className="text-[#a89f91] block text-[11px]">Corridor Saturation</span>
              <span className="font-bold text-amber-400 font-mono text-sm">{Math.round(selected.density * 100)}%</span>
            </div>
            <div>
              <span className="text-[#a89f91] block text-[11px]">Flow Speed</span>
              <span className="font-bold text-emerald-400 font-mono text-sm">1.1 m/s (Nominal)</span>
            </div>
            <div>
              <span className="text-[#a89f91] block text-[11px]">Camera Latency</span>
              <span className="font-bold text-[#d6cebf] font-mono text-sm">14ms RTSP</span>
            </div>
          </div>
        </div>

        {/* Camera Selector Rail (4 cols) */}
        <div className="lg:col-span-4 card-pro p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] mb-3">
              <h3 className="text-sm font-bold text-white font-display">Active CCTV Nodes</h3>
              <span className="text-xs text-slate-400 font-mono">128 Total</span>
            </div>

            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {liveCams.map(cam => {
                const isSelected = selected.id === cam.id
                return (
                  <button
                    key={cam.id}
                    onClick={() => setSelected(cam)}
                    className={`w-full p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500/40 shadow-sm'
                        : 'bg-[#141210] border-white/[0.05] hover:border-amber-500/30'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className={`font-mono font-bold ${isSelected ? 'text-amber-300' : 'text-[#d6cebf]'}`}>
                        {cam.id}
                      </span>
                      <span className="text-xs font-mono font-semibold text-white">
                        {cam.count} devotees
                      </span>
                    </div>
                    <p className="text-xs text-[#a89f91] truncate mb-2">{cam.name}</p>

                    <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          cam.density > 0.8 ? 'bg-rose-500' : cam.density > 0.6 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${cam.density * 100}%` }}
                      />
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Model Health Pill */}
          <div className="mt-4 p-3 rounded-xl bg-slate-900/80 border border-white/[0.06] text-xs space-y-1.5">
            <div className="flex items-center justify-between text-slate-300">
              <span>Model Architecture</span>
              <span className="font-mono font-semibold text-white">YOLOv9 + DeepSORT</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span>mAP@0.5 Detection</span>
              <span className="font-mono font-semibold text-emerald-400">98.6%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
