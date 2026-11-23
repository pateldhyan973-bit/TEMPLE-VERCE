import {
  IconBookOpen,
  IconCheck,
  IconX,
  IconSparkles,
  IconTemple,
  IconShield,
  IconClock
} from '../components/Icons'

export default function DevoteeTraditions() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#0e1628] border border-amber-500/20 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-2 max-w-2xl">
          <span className="badge-pill bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 font-semibold">
            <IconBookOpen size={12} />
            TEMPLE TRADITIONS & PROTOCOL
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-display">
            Sanctum Etiquette, Dress Code & Sacred Rituals
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Essential guidelines for pilgrims entering the holy sanctum sanctorum. Learn about the traditional dress code, Swami Pushkarini bath, and Kalyana Katta hair offerings.
          </p>
        </div>
      </div>

      {/* Mandatory Dress Code Section */}
      <div className="card-pro p-6 sm:p-8 space-y-6 border border-white/[0.08]">
        <div className="space-y-1">
          <span className="text-[10px] font-mono font-bold tracking-widest text-amber-400 uppercase">
            MANDATORY REQUIREMENT
          </span>
          <h2 className="text-xl font-bold text-white font-display">
            Traditional Indian Attire for Sanctum Entry
          </h2>
          <p className="text-xs text-slate-300">
            Per ancient temple tradition and High Court mandate, all pilgrims entering the Sanctum Darshan queue must adhere to the traditional dress code.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Approved Attire */}
          <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-4">
            <div className="flex items-center gap-2 text-emerald-400 font-display font-bold text-sm">
              <IconCheck size={18} />
              <span>PERMITTED ATTIRE</span>
            </div>

            <div className="space-y-3 text-xs text-slate-200">
              <div className="p-3 rounded-xl bg-black/30 border border-white/[0.04]">
                <strong className="text-white block mb-0.5">For Male Devotees:</strong>
                Traditional Dhoti (Veshti) with white shirt or Uttariyam (Upper cloth), or Kurta Pyjama.
              </div>
              <div className="p-3 rounded-xl bg-black/30 border border-white/[0.04]">
                <strong className="text-white block mb-0.5">For Female Devotees:</strong>
                Traditional Saree, Half-Saree (Langa Voni), or Punjabi Churidar with Dupatta (Upper veil).
              </div>
              <div className="p-3 rounded-xl bg-black/30 border border-white/[0.04]">
                <strong className="text-white block mb-0.5">For Children (Under 12):</strong>
                Traditional ethnic attire, Pattu Pavada, or modest casual trousers and shirts.
              </div>
            </div>
          </div>

          {/* Prohibited Attire */}
          <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-4">
            <div className="flex items-center gap-2 text-rose-400 font-display font-bold text-sm">
              <IconX size={18} />
              <span>STRICTLY PROHIBITED</span>
            </div>

            <div className="space-y-3 text-xs text-slate-200">
              <div className="p-3 rounded-xl bg-black/30 border border-white/[0.04]">
                <strong className="text-rose-300 block mb-0.5">Western Casuals:</strong>
                Jeans, denim pants, bermudas, shorts, mini-skirts, sleeveless tops, and t-shirts with printed slogans.
              </div>
              <div className="p-3 rounded-xl bg-black/30 border border-white/[0.04]">
                <strong className="text-rose-300 block mb-0.5">Electronic Gadgets:</strong>
                Mobile phones, digital smartwatches, video cameras, bluetooth earphones, and power banks.
              </div>
              <div className="p-3 rounded-xl bg-black/30 border border-white/[0.04]">
                <strong className="text-rose-300 block mb-0.5">Footwear & Leather:</strong>
                Shoes, sandals, socks, and leather belts/wallets are strictly prohibited past the outer Gopuram.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sacred Rituals & Practices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pushkarini Bath */}
        <div className="card-pro p-6 space-y-3 border border-white/[0.08]">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center font-bold">
            01
          </div>
          <h3 className="text-base font-bold text-white font-display">
            Swami Pushkarini Holy Bath
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Taking a holy dip in the sacred Swami Pushkarini lake adjacent to the temple before darshan is believed to cleanse all impurities. Changing rooms and lockers are available.
          </p>
        </div>

        {/* Kalyana Katta Hair Offering */}
        <div className="card-pro p-6 space-y-3 border border-white/[0.08]">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center font-bold">
            02
          </div>
          <h3 className="text-base font-bold text-white font-display">
            Mottai / Tonsuring Offering
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            The sacred ritual of surrendering one&apos;s hair (Mokkubadi) signifies shedding false ego. Over 40 computerized Kalyana Katta centers operate with sterile single-use surgical blades.
          </p>
        </div>

        {/* Parikrama & Sanctum Silence */}
        <div className="card-pro p-6 space-y-3 border border-white/[0.08]">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-bold">
            03
          </div>
          <h3 className="text-base font-bold text-white font-display">
            Sanctum Floor Discipline
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Maintain solemn silence inside the Anandha Nilayam vimana corridor. Walk clockwise along the bronze railings, chant &apos;Govinda Govinda&apos; softly, and keep queue moving peacefully.
          </p>
        </div>
      </div>
    </div>
  )
}
