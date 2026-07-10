import { useEffect, useRef, useState } from 'react'
import { API_BASE, APP_STORE_URL, PLAY_STORE_URL } from '../constants'

/**
 * Public shape returned by GET /api/secondhand/{id}/public.
 * NOTE: there is deliberately NO contact/owner field — contacts live in the
 * app only, so this page can never render them.
 */
interface Listing {
  id: string
  name: string
  brand: string | null
  category: string
  gender: string
  size: string
  condition: string
  description: string | null
  imageUrl: string | null
  createdAt: string
}

type Status = 'loading' | 'error' | 'ready'

// Slug → Russian label maps. Fall back to the raw slug if unknown.
const CONDITION: Record<string, string> = {
  new: 'Новое',
  excellent: 'Отличное',
  good: 'Хорошее',
}
const CATEGORY: Record<string, string> = {
  outerwear: 'Верхняя одежда',
  top: 'Верх',
  bottom: 'Низ',
  footwear: 'Обувь',
  bag: 'Сумки',
  accessory: 'Аксессуары',
}
const GENDER: Record<string, string> = {
  female: 'Женское',
  male: 'Мужское',
  unisex: 'Унисекс',
}

const label = (map: Record<string, string>, slug: string | null | undefined) =>
  (slug && map[slug]) || slug || ''

const deepLink = (id: string) => `sevil://s/${id}`

/** Resolve a possibly-relative image path against the API host. */
function resolveImage(url: string | null): string | null {
  if (!url) return null
  if (/^https?:\/\//i.test(url)) return url
  return `${API_BASE}${url.startsWith('/') ? '' : '/'}${url}`
}

/**
 * Silent app-open attempt via a hidden iframe: opens the app if the custom
 * scheme is registered, and quietly no-ops otherwise (no store redirect).
 */
function tryOpenAppSilently(id: string) {
  const iframe = document.createElement('iframe')
  iframe.style.display = 'none'
  iframe.src = deepLink(id)
  document.body.appendChild(iframe)
  window.setTimeout(() => iframe.remove(), 1200)
}

export default function ShareItem({ id }: { id: string }) {
  const [status, setStatus] = useState<Status>('loading')
  const [item, setItem] = useState<Listing | null>(null)
  const autoOpened = useRef(false)

  // Fetch the public listing.
  useEffect(() => {
    let cancelled = false
    setStatus('loading')
    fetch(`${API_BASE}/api/secondhand/${id}/public`)
      .then((res) => {
        if (!res.ok) throw new Error(String(res.status))
        return res.json() as Promise<Listing>
      })
      .then((data) => {
        if (cancelled) return
        setItem(data)
        setStatus('ready')
      })
      .catch(() => {
        if (!cancelled) setStatus('error')
      })
    return () => {
      cancelled = true
    }
  }, [id])

  // Reflect the item name in the tab title.
  useEffect(() => {
    if (item?.name) document.title = `${item.name} — Sevil`
  }, [item])

  // Attempt a silent deep-link once on first load (no store fallback here —
  // we don't want to hijack someone who intentionally opened the web view).
  useEffect(() => {
    if (autoOpened.current) return
    autoOpened.current = true
    tryOpenAppSilently(id)
  }, [id])

  // Explicit "open in app" — try the app, then fall back to the App Store.
  // If the app actually opens, the tab is backgrounded and we cancel the
  // fallback so returning users aren't bounced to the store.
  const openInApp = () => {
    window.location.href = deepLink(id)
    const timer = window.setTimeout(() => {
      window.location.href = APP_STORE_URL
    }, 1200)
    const onHide = () => {
      if (document.visibilityState === 'hidden') window.clearTimeout(timer)
    }
    document.addEventListener('visibilitychange', onHide, { once: true })
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-page px-5 py-10">
      {/* peach wash, echoing the marketing hero */}
      <div
        className="pointer-events-none absolute inset-x-0 -top-[10%] -z-10 h-[520px]"
        style={{
          background:
            'radial-gradient(760px 460px at 80% 0%, rgba(255,217,190,0.55), rgba(255,217,190,0) 62%), radial-gradient(620px 420px at 8% 12%, rgba(255,244,236,0.9), rgba(255,244,236,0) 60%)',
        }}
      />

      {/* brand bar */}
      <a
        href="/"
        className="mx-auto mb-8 flex w-full max-w-[460px] items-center gap-2.5"
      >
        <img
          src="/logo.svg"
          alt="Sevil"
          className="h-9 w-9 rounded-[10px] shadow-soft"
        />
        <span className="text-[19px] font-black -tracking-[0.02em] text-orange-dark">
          Sevil
        </span>
      </a>

      <main className="mx-auto w-full max-w-[460px]">
        {status === 'loading' && <LoadingCard />}
        {status === 'error' && <ErrorCard onOpenApp={openInApp} />}
        {status === 'ready' && item && (
          <ItemCard item={item} onOpenInApp={openInApp} />
        )}
      </main>
    </div>
  )
}

function LoadingCard() {
  return (
    <div className="overflow-hidden rounded-5xl border border-hair bg-white shadow-card">
      <div className="aspect-[4/5] w-full animate-pulse bg-peach-whisper" />
      <div className="flex flex-col gap-4 p-6">
        <div className="h-6 w-3/4 animate-pulse rounded-full bg-peach-whisper" />
        <div className="h-4 w-2/5 animate-pulse rounded-full bg-peach-whisper" />
        <div className="mt-2 flex items-center gap-3">
          <span
            className="h-8 w-8 animate-spin rounded-full border-[3px] border-hair border-t-orange"
            aria-hidden="true"
          />
          <span className="text-[15px] font-semibold text-ink-3">
            Загрузка…
          </span>
        </div>
      </div>
    </div>
  )
}

function ErrorCard({ onOpenApp }: { onOpenApp: () => void }) {
  return (
    <div className="rounded-5xl border border-hair bg-white px-7 py-12 text-center shadow-card">
      <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-peach-whisper text-[34px]">
        🤷
      </div>
      <h1 className="text-[24px] font-extrabold text-ink">
        Объявление не найдено
      </h1>
      <p className="mx-auto mt-3 max-w-[320px] text-[15px] font-medium text-ink-2">
        Возможно, вещь уже отдали или ссылка устарела. Загляните в приложение
        Sevil — там всегда есть свежие вещи даром.
      </p>
      <div className="mt-7 flex flex-col gap-3">
        <button
          type="button"
          onClick={onOpenApp}
          className="w-full rounded-2xl bg-grad-primary py-3.5 text-[16px] font-extrabold text-white shadow-glow transition-transform duration-200 ease-out hover:-translate-y-0.5"
        >
          Открыть приложение
        </button>
        <a
          href="/"
          className="w-full rounded-2xl border border-line bg-white py-3.5 text-center text-[16px] font-extrabold text-ink transition-colors hover:border-orange-light"
        >
          На главную
        </a>
      </div>
    </div>
  )
}

function Chip({ title, value }: { title: string; value: string }) {
  return (
    <div className="flex flex-col rounded-2xl bg-peach-whisper px-4 py-2.5">
      <span className="text-[11px] font-bold uppercase tracking-wide text-ink-3">
        {title}
      </span>
      <span className="text-[15px] font-extrabold text-ink">{value}</span>
    </div>
  )
}

function ItemCard({
  item,
  onOpenInApp,
}: {
  item: Listing
  onOpenInApp: () => void
}) {
  const image = resolveImage(item.imageUrl)
  const meta = [label(CATEGORY, item.category), label(GENDER, item.gender)]
    .filter(Boolean)
    .join(' · ')
  const conditionLabel = label(CONDITION, item.condition)

  return (
    <div className="overflow-hidden rounded-5xl border border-hair bg-white shadow-card">
      {/* image */}
      <div className="relative aspect-[4/5] w-full bg-peach-whisper">
        {image ? (
          <img
            src={image}
            alt={item.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="flex h-28 w-28 items-center justify-center rounded-full bg-peach-mid text-[52px]">
              👗
            </span>
          </div>
        )}
        <span className="absolute left-4 top-4 rounded-full bg-emerald-500 px-3.5 py-1.5 text-[13px] font-extrabold text-white shadow-soft">
          Бесплатно
        </span>
      </div>

      {/* body */}
      <div className="p-6">
        {meta && (
          <span className="text-[12px] font-bold uppercase tracking-[1.4px] text-orange-dark">
            {meta}
          </span>
        )}
        <h1 className="mt-1.5 text-[26px] font-extrabold leading-[1.15] text-ink">
          {item.name}
        </h1>
        {item.brand && (
          <p className="mt-1 text-[16px] font-semibold text-ink-2">
            {item.brand}
          </p>
        )}

        <div className="mt-5 grid grid-cols-2 gap-3">
          <Chip title="Размер" value={item.size || '—'} />
          <Chip title="Состояние" value={conditionLabel || '—'} />
        </div>

        {item.description && (
          <p className="mt-5 whitespace-pre-line text-[15px] font-medium leading-relaxed text-ink-2">
            {item.description}
          </p>
        )}

        {/* contacts-only-in-app callout */}
        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-hair bg-peach-tint px-4 py-3.5">
          <span className="text-[20px] leading-none" aria-hidden="true">
            🔒
          </span>
          <p className="text-[14px] font-semibold text-ink-2">
            Контакты владельца доступны только в приложении Sevil — откройте
            вещь там, чтобы договориться.
          </p>
        </div>

        {/* actions */}
        <div className="mt-6 flex flex-col gap-3">
          <button
            type="button"
            onClick={onOpenInApp}
            className="w-full rounded-2xl bg-grad-primary py-3.5 text-[16px] font-extrabold text-white shadow-glow transition-transform duration-200 ease-out hover:-translate-y-0.5"
          >
            Открыть в приложении
          </button>
          <a
            href={APP_STORE_URL}
            target="_blank"
            rel="noopener"
            className="w-full rounded-2xl border border-line bg-white py-3.5 text-center text-[16px] font-extrabold text-ink transition-colors hover:border-orange-light"
          >
            Установить приложение
          </a>
          <a
            href={PLAY_STORE_URL}
            target="_blank"
            rel="noopener"
            className="mt-0.5 text-center text-[13px] font-semibold text-ink-3 underline decoration-hair underline-offset-2 transition-colors hover:text-orange-dark"
          >
            Или установите из Google Play
          </a>
        </div>
      </div>
    </div>
  )
}
