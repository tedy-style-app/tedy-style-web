import { useEffect, useState } from 'react'
import { useLang, type Lang } from '../i18n'

function Brand({ className = '' }: { className?: string }) {
  return (
    <a href="#top" aria-label="Tedy Style" className={`inline-flex items-center gap-2.5 ${className}`}>
      <img src="/logo.png" alt="Tedy Style" className="h-[38px] w-[38px] rounded-[10px] shadow-soft" />
      <span className="brand-word text-[21px] font-black -tracking-[0.02em] text-orange-dark">
        Tedy<span className="ml-px font-bold italic text-orange">style</span>
      </span>
    </a>
  )
}

function LangToggle() {
  const { lang, setLang } = useLang()
  const langs: Lang[] = ['uz', 'en']
  return (
    <div
      role="group"
      aria-label="Til / Language"
      className="inline-flex gap-0.5 rounded-full border border-hair bg-peach-tint p-[3px]"
    >
      {langs.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          className={`rounded-full px-[11px] py-[5px] text-xs font-extrabold uppercase tracking-[0.5px] transition-all duration-200 ease-out ${
            lang === l ? 'bg-white text-orange-dark shadow-soft' : 'text-ink-3'
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  )
}

export default function Nav() {
  const { t } = useLang()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { href: '#features', label: t.nav.features },
    { href: '#how', label: t.nav.how },
    { href: '#community', label: t.nav.community },
  ]

  return (
    <header
      className={`sticky top-0 z-[100] border-b bg-page/[0.72] backdrop-blur-[18px] backdrop-saturate-[180%] transition-[border-color,box-shadow] duration-300 ${
        scrolled ? 'border-hair shadow-soft' : 'border-transparent'
      }`}
    >
      <div className="mx-auto flex h-[72px] w-full max-w-[1140px] items-center justify-between gap-3 px-6">
        {/* Hide the wordmark on very small screens — the logo mark carries it */}
        <Brand className="[&_.brand-word]:hidden sm:[&_.brand-word]:inline" />

        <nav aria-label="Asosiy menyu" className="hidden gap-[30px] md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[15px] font-bold text-ink-2 transition-colors hover:text-orange-dark"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3.5">
          <LangToggle />
          <a
            href="#download"
            className="inline-flex items-center justify-center rounded-full bg-grad-primary px-5 py-2.5 text-sm font-extrabold text-white shadow-glow transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-0.5"
          >
            {t.nav.download}
          </a>
        </div>
      </div>
    </header>
  )
}
