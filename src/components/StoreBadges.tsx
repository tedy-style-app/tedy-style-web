import type { ReactNode } from 'react'
import { APP_STORE_URL, PLAY_STORE_URL } from '../constants'
import { useLang } from '../i18n'

function AppleGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-[26px] w-[26px] shrink-0 fill-white" aria-hidden="true">
      <path d="M16.365 1.43c0 1.14-.42 2.2-1.12 2.99-.84.95-2.2 1.68-3.32 1.6-.14-1.1.42-2.27 1.05-3 .73-.85 2.02-1.5 3.1-1.59.07.33.29.66.29 1zM21.5 17.2c-.54 1.25-.8 1.8-1.5 2.9-.97 1.55-2.34 3.48-4.04 3.5-1.5.02-1.9-.98-3.93-.97-2.03.01-2.46.99-3.97.96-1.7-.03-2.99-1.78-3.96-3.32C1.36 16.9 1.07 12.1 2.74 9.55c1.18-1.8 3.04-2.85 4.79-2.85 1.78 0 2.9 1 4.37 1 1.43 0 2.3-1 4.37-1 1.55 0 3.2.84 4.37 2.3-3.84 2.1-3.22 7.6.86 9.2z" />
    </svg>
  )
}

function PlayGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-[26px] w-[26px] shrink-0" aria-hidden="true">
      <path d="M3.6 2.1c-.3.3-.5.8-.5 1.4v17c0 .6.2 1.1.5 1.4l.1.1L13 12.6v-.2L3.7 2z" fill="#34A853" />
      <path d="M16.4 15.7l-3.4-3.3v-.2l3.4-3.4.1.1 4 2.3c1.2.6 1.2 1.7 0 2.4l-4 2.3z" fill="#FBBC04" />
      <path d="M16.5 15.6L13 12.1 3.6 21.9c.4.4 1 .5 1.8.1l11.1-6.4" fill="#EA4335" />
      <path d="M16.5 8.6L5.4 2.2C4.6 1.8 4 1.9 3.6 2.3L13 12.1z" fill="#4285F4" />
    </svg>
  )
}

function Badge({
  href,
  label,
  small,
  strong,
  glyph,
}: {
  href: string
  label: string
  small: string
  strong: string
  glyph: ReactNode
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      aria-label={label}
      className="inline-flex items-center gap-[11px] rounded-[15px] bg-ink py-[11px] pl-[18px] pr-5 text-white shadow-soft transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-float"
    >
      {glyph}
      <span className="flex flex-col leading-[1.15]">
        <span className="text-[10px] font-semibold tracking-[0.2px] opacity-80">{small}</span>
        <span className="text-[17px] font-extrabold -tracking-[0.01em]">{strong}</span>
      </span>
    </a>
  )
}

export default function StoreBadges({ center = false }: { center?: boolean }) {
  const { t } = useLang()
  return (
    <div className={`flex flex-wrap gap-3.5 ${center ? 'justify-center' : ''}`}>
      <Badge
        href={APP_STORE_URL}
        label="Download on the App Store"
        small={t.store.appStoreSmall}
        strong={t.store.appStore}
        glyph={<AppleGlyph />}
      />
      <Badge
        href={PLAY_STORE_URL}
        label="Get it on Google Play"
        small={t.store.playSmall}
        strong={t.store.play}
        glyph={<PlayGlyph />}
      />
    </div>
  )
}
