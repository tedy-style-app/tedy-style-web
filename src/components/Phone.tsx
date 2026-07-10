import type { ReactNode } from 'react'

/* ---------- Frame ---------- */

type NavKey = 'home' | 'secondhand'

interface PhoneProps {
  children: ReactNode
  nav: NavKey
  small?: boolean
}

// Mirrors the app's bottom bar: Home · Wardrobe · (AI sparkle FAB) · Secondhand · Profile.
const NAV_ICONS: { key: string; glyph: string; fab?: boolean }[] = [
  { key: 'home', glyph: '⌂' },
  { key: 'wardrobe', glyph: '❒' },
  { key: 'ai', glyph: '✦', fab: true },
  { key: 'secondhand', glyph: '🛍' },
  { key: 'profile', glyph: '◔' },
]

export default function Phone({ children, nav, small = false }: PhoneProps) {
  return (
    <div
      className={`relative rounded-[44px] border border-hair bg-[linear-gradient(160deg,#FBF8F1,#F1E9DA)] p-3 shadow-phone ${
        small ? 'h-[572px] w-[280px]' : 'h-[612px] w-[300px]'
      }`}
    >
      <div className="absolute left-1/2 top-3 z-[3] h-[26px] w-[120px] -translate-x-1/2 rounded-b-2xl bg-espresso" />
      <div className="relative h-full overflow-hidden rounded-[33px] bg-page px-4 pt-[18px]">
        {children}
      </div>

      <div className="absolute bottom-[22px] left-1/2 z-[4] flex -translate-x-1/2 items-center gap-[18px] rounded-full bg-white/95 px-5 py-[11px] shadow-float backdrop-blur">
        {NAV_ICONS.map((item) =>
          item.fab ? (
            <span
              key={item.key}
              className="-mt-[22px] flex h-10 w-10 items-center justify-center rounded-full bg-espresso text-[20px] text-onEspresso shadow-glow-soft ring-4 ring-white"
            >
              {item.glyph}
            </span>
          ) : (
            <span
              key={item.key}
              className={`text-[16px] leading-none ${
                item.key === nav ? 'text-espresso' : 'text-ink-3'
              }`}
            >
              {item.glyph}
            </span>
          ),
        )}
      </div>
    </div>
  )
}

/* ---------- Shared bits ---------- */

function StatusBar() {
  return (
    <div className="flex justify-between px-1 pb-2 text-xs font-extrabold text-ink">
      <span>9:41</span>
      <span className="text-[9px] tracking-widest opacity-70">●●● ⌁ ▮</span>
    </div>
  )
}

function AiPill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/[0.16] px-[11px] py-[5px] text-[11px] font-extrabold text-espresso">
      <span className="h-[7px] w-[7px] animate-pulse rounded-full bg-gold" />
      {children}
    </span>
  )
}

function Garment({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`grid aspect-square place-items-center rounded-xl border border-hair bg-grad-tile text-[34px] ${className}`}
    >
      {children}
    </div>
  )
}

/* ---------- Home screen ---------- */

export function HomeScreen() {
  return (
    <>
      <StatusBar />
      <div className="mt-2 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[11px] font-bold text-ink-3">Xush kelibsiz</span>
          <span className="text-[19px] font-black -tracking-[0.01em] text-ink">Salom, Aziz 👋</span>
        </div>
        <div className="grid h-10 w-10 place-items-center rounded-full bg-espresso text-base font-black text-onEspresso">
          A
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-2xl border border-hair bg-white px-3.5 py-[11px] text-[13px] font-extrabold text-ink shadow-card">
        <span className="text-base">☀️</span>
        <span>Toshkent · 24°</span>
        <span className="ml-auto text-[11px] font-bold text-ink-3">Quyoshli</span>
      </div>

      <div className="mx-0.5 mb-3 mt-5 flex items-center justify-between">
        <span className="text-base font-black text-ink">Bugungi obraz</span>
        <AiPill>AI tanlovi</AiPill>
      </div>

      <div className="rounded-[20px] border border-hair bg-white p-3.5 shadow-card">
        <div className="grid grid-cols-2 gap-[9px]">
          <Garment>🧥</Garment>
          <Garment>👕</Garment>
          <Garment>👖</Garment>
          <Garment>👟</Garment>
        </div>
        <button className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-full bg-espresso py-2.5 text-[13px] font-extrabold text-onEspresso">
          Obrazni ko‘rish →
        </button>
      </div>
    </>
  )
}

/* ---------- Secondhand screen ---------- */

export function SecondhandScreen() {
  return (
    <>
      <StatusBar />
      <div className="mx-0.5 mb-3 mt-1.5 flex items-center justify-between">
        <span className="text-base font-black text-ink">Secondhand</span>
        <AiPill>Bepul</AiPill>
      </div>

      <Listing emoji="🧥" title="Bej palto" meta="O‘lcham M · A’lo" />
      <Listing emoji="👗" title="Yozgi ko‘ylak" meta="O‘lcham S · Yangi" peek />
    </>
  )
}

function Listing({
  emoji,
  title,
  meta,
  peek = false,
}: {
  emoji: string
  title: string
  meta: string
  peek?: boolean
}) {
  return (
    <div
      className={`mt-3 flex items-center gap-3 rounded-[20px] border border-hair bg-white p-3 shadow-card ${
        peek ? 'opacity-55' : ''
      }`}
    >
      <div className="grid h-[62px] w-[62px] shrink-0 place-items-center rounded-2xl border border-hair bg-grad-tile text-[30px]">
        {emoji}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[13px] font-black text-ink">{title}</div>
        <div className="mt-0.5 text-[11px] font-bold text-ink-3">{meta}</div>
      </div>
      <span className="rounded-full bg-online/[0.14] px-2.5 py-1 text-[11px] font-extrabold text-online">
        Bepul
      </span>
    </div>
  )
}
