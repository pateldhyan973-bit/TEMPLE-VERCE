import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { IconRadio, IconX, IconAlert, IconUsers } from './Icons'

type ChatChannel = 'general' | 'security' | 'medical' | 'gates'

type ChatMessage = {
  id: string
  sender: string
  role: 'ADMIN' | 'PILGRIM' | 'STAFF' | 'SECURITY' | 'MEDICAL'
  channel: ChatChannel
  text: string
  timestamp: string
  urgent?: boolean
}

export default function StaffChat() {
  const { user, role } = useAuth()

  // Only render for ADMIN or staff members
  if (role !== 'ADMIN') return null

  const [open, setOpen] = useState(false)
  const [activeChannel, setActiveChannel] = useState<ChatChannel>('general')
  const [input, setInput] = useState('')
  const [urgent, setUrgent] = useState(false)

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_1',
      sender: 'Commander Sharma',
      role: 'ADMIN',
      channel: 'general',
      text: 'Morning briefing complete. Gate 3 expecting peak crowd at 10:30 AM.',
      timestamp: '09:15:00',
    },
    {
      id: 'msg_2',
      sender: 'Security Team Beta',
      role: 'SECURITY',
      channel: 'security',
      text: 'North exit corridor clear. Additional turnstile barriers positioned.',
      timestamp: '09:20:14',
    },
    {
      id: 'msg_3',
      sender: 'Dr. Anita (Medical)',
      role: 'MEDICAL',
      channel: 'medical',
      text: 'East Post 2 fully stocked. Hydration & glucose packets ready.',
      timestamp: '09:25:40',
    },
    {
      id: 'msg_4',
      sender: 'AI Queue Automation',
      role: 'ADMIN',
      channel: 'general',
      text: 'Density surge detected at Sanctum Corridor. Automated rerouting active.',
      timestamp: '09:30:10',
      urgent: true,
    },
  ])

  const chatBottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, open, activeChannel])

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      sender: user?.displayName || 'Control Officer',
      role: 'ADMIN',
      channel: activeChannel,
      text: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      urgent,
    }

    setMessages(prev => [...prev, newMsg])
    setInput('')
    setUrgent(false)
  }

  const channelMessages = messages.filter(m => m.channel === activeChannel)

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Trigger Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="btn-primary py-3 px-4 shadow-xl flex items-center gap-2.5 rounded-2xl border border-amber-400/30 text-xs font-bold"
        >
          <div className="relative">
            <IconRadio size={16} />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <span>Staff Intercom Radio</span>
        </button>
      )}

      {/* Floating Intercom Drawer */}
      {open && (
        <div className="w-80 sm:w-96 h-[460px] bg-[#181512] border border-amber-500/20 rounded-2xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-2xl animate-fade-in">
          {/* Header */}
          <div className="p-3.5 bg-[#141210] border-b border-white/[0.08] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center">
                <IconRadio size={15} />
              </div>
              <div>
                <p className="text-xs font-bold text-[#fbf9f5] font-display">Encrypted Intercom</p>
                <p className="text-[10px] text-emerald-400 font-mono">CHANNEL VHF-1 ACTIVE</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1 rounded-lg text-[#b8ae9f] hover:text-white hover:bg-white/5"
            >
              <IconX size={16} />
            </button>
          </div>

          {/* Channel Selector */}
          <div className="flex border-b border-white/[0.06] bg-[#12100e] p-1 gap-1 text-[11px]">
            {(['general', 'security', 'medical', 'gates'] as const).map(ch => (
              <button
                key={ch}
                onClick={() => setActiveChannel(ch)}
                className={`flex-1 py-1 rounded-lg font-semibold capitalize transition-all ${
                  activeChannel === ch
                    ? 'bg-amber-500 text-[#1a1612] font-bold shadow'
                    : 'text-[#b8ae9f] hover:text-[#fbf9f5]'
                }`}
              >
                {ch}
              </button>
            ))}
          </div>

          {/* Messages */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-2.5 text-xs">
            {channelMessages.map(msg => (
              <div
                key={msg.id}
                className={`p-2.5 rounded-xl border space-y-1 ${
                  msg.urgent
                    ? 'bg-rose-500/15 border-rose-500/30'
                    : 'bg-[#141210] border-white/[0.05]'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className={`font-bold ${msg.urgent ? 'text-rose-400' : 'text-amber-400'}`}>
                    {msg.sender}
                  </span>
                  <span className="text-[#a3998b]">{msg.timestamp}</span>
                </div>
                <p className="text-[#d6cebf] leading-snug">{msg.text}</p>
              </div>
            ))}
            <div ref={chatBottomRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="p-3 bg-[#141210] border-t border-white/[0.08] space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <label className="flex items-center gap-1.5 cursor-pointer text-[#d6cebf]">
                <input
                  type="checkbox"
                  checked={urgent}
                  onChange={e => setUrgent(e.target.checked)}
                  className="rounded text-rose-500 focus:ring-0"
                />
                <span className={urgent ? 'text-rose-400 font-bold' : 'text-[#a3998b]'}>Mark Urgent Priority</span>
              </label>
              <span className="font-mono text-[#a3998b] text-[10px]">#{activeChannel}</span>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Radio message..."
                value={input}
                onChange={e => setInput(e.target.value)}
                className="input-pro py-1.5 px-3 text-xs flex-1"
              />
              <button
                type="submit"
                className={`px-3 py-1.5 rounded-lg text-xs font-bold text-[#1a1612] transition-colors ${
                  urgent ? 'bg-rose-600 hover:bg-rose-500 text-white' : 'bg-amber-500 hover:bg-amber-400'
                }`}
              >
                Transmit
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
