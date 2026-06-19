import type { ReactNode } from 'react'

/* ---------- Frame ---------- */

interface PhoneProps {
  children: ReactNode
  nav: NavKey
  small?: boolean
}

type NavKey = 'home' | 'community'

const NAV_ICONS: { key: string; glyph: string; fab?: boolean }[] = [
  { key: 'home', glyph: '⌂' },
  { key: 'wardrobe', glyph: '▦' },
  { key: 'add', glyph: '＋', fab: true },
  { key: 'community', glyph: '❤' },
  { key: 'profile', glyph: '◔' },
]

export default function Phone({ children, nav, small = false }: PhoneProps) {
  const active = nav === 'home' ? 'home' : 'community'
  return (
    <div
      className={`relative rounded-[44px] border border-hair bg-[linear-gradient(160deg,#fff,#fdf6f0)] p-3 shadow-phone ${
        small ? 'h-[572px] w-[280px]' : 'h-[612px] w-[300px]'
      }`}
    >
      <div className="absolute left-1/2 top-3 z-[3] h-[26px] w-[120px] -translate-x-1/2 rounded-b-2xl bg-ink" />
      <div className="relative h-full overflow-hidden rounded-[33px] bg-peach-whisper px-4 pt-[18px]">
        {children}
      </div>

      <div className="absolute bottom-[22px] left-1/2 z-[4] flex -translate-x-1/2 items-center gap-[18px] rounded-full bg-white/90 px-5 py-[11px] shadow-float backdrop-blur">
        {NAV_ICONS.map((item) =>
          item.fab ? (
            <span
              key={item.key}
              className="-mt-[22px] flex h-10 w-10 items-center justify-center rounded-full bg-grad-primary text-[22px] text-white shadow-glow-soft"
            >
              {item.glyph}
            </span>
          ) : (
            <span
              key={item.key}
              className={`text-[17px] leading-none ${
                item.key === active ? 'text-orange' : 'text-ink-3'
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

function AiPill({ children, large = false }: { children: ReactNode; large?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full bg-orange/[0.12] font-extrabold text-orange-dark ${
        large ? 'px-3.5 py-[7px] text-[13px]' : 'px-[11px] py-[5px] text-[11px]'
      }`}
    >
      <span className="h-[7px] w-[7px] animate-pulse rounded-full bg-orange" />
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
        <div className="grid h-10 w-10 place-items-center rounded-full bg-grad-primary text-base font-black text-white shadow-glow-soft">
          A
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-2xl border border-hair bg-white px-3.5 py-[11px] text-[13px] font-extrabold text-ink shadow-card">
        <span className="text-base">☀️</span>
        <span>Toshkent · 24°</span>
        <span className="ml-auto text-[11px] font-bold text-ink-3">Quyoshli</span>
      </div>

      <div className="mx-0.5 mb-3 mt-5 flex items-center justify-between">
        <span className="text-base font-black text-ink">Bugungi look</span>
        <AiPill>AI tanlovi</AiPill>
      </div>

      <div className="rounded-[20px] border border-hair bg-white p-3.5 shadow-card">
        <div className="grid grid-cols-2 gap-[9px]">
          <Garment>🧥</Garment>
          <Garment>👕</Garment>
          <Garment>👖</Garment>
          <Garment>👟</Garment>
        </div>
        <div className="mt-[13px] flex items-center justify-between">
          <div>
            <div className="text-sm font-black text-ink">Salqin kunga yengil</div>
            <div className="mt-0.5 text-[11px] font-bold text-ink-3">4 ta kiyim · ob-havoga mos</div>
          </div>
          <button
            aria-label="Yoqdi"
            className="grid h-[34px] w-[34px] place-items-center rounded-full bg-like/10 text-base text-like"
          >
            ♥
          </button>
        </div>
      </div>
    </>
  )
}

/* ---------- Community screen ---------- */

export function CommunityScreen() {
  return (
    <>
      <StatusBar />
      <div className="mx-0.5 mb-3 mt-1.5 flex items-center justify-between">
        <span className="text-base font-black text-ink">Jamiyat</span>
        <AiPill>Trend</AiPill>
      </div>

      <Post
        user="malika_uz"
        avatar="M"
        time="2 soat oldin"
        emojis={['👗', '🧥', '👜']}
        likes="128"
        comments="24"
      />
      <Post user="sardor.style" avatar="S" time="5 soat oldin" emojis={['👔', '👖']} peek />
    </>
  )
}

function Post({
  user,
  avatar,
  time,
  emojis,
  likes,
  comments,
  peek = false,
}: {
  user: string
  avatar: string
  time: string
  emojis: string[]
  likes?: string
  comments?: string
  peek?: boolean
}) {
  return (
    <div
      className={`mt-3 rounded-[20px] border border-hair bg-white p-3 shadow-card ${
        peek ? 'opacity-55' : ''
      }`}
    >
      <div className="flex items-center gap-[9px]">
        <div className="grid h-8 w-8 place-items-center rounded-full bg-grad-primary text-[13px] font-black text-white">
          {avatar}
        </div>
        <div>
          <div className="text-[13px] font-black text-ink">{user}</div>
          <div className="text-[10px] font-bold text-ink-3">{time}</div>
        </div>
      </div>
      <div className="mt-[11px] flex justify-center gap-2 rounded-2xl border border-hair bg-grad-tile p-[18px] text-[40px]">
        {emojis.map((e, i) => (
          <span key={i}>{e}</span>
        ))}
      </div>
      {!peek && (
        <div className="mt-[11px] flex items-center gap-3.5 text-xs font-extrabold text-ink-2">
          <span className="text-like">♥ {likes}</span>
          <span>💬 {comments}</span>
          <span className="ml-auto rounded-full bg-orange/[0.12] px-2.5 py-1 text-[11px] text-orange-dark">
            ＋ Kuzatish
          </span>
        </div>
      )}
    </div>
  )
}
