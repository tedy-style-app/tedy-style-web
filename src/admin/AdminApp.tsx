import { useEffect, useState } from 'react'
import { getToken, clearToken } from './api'
import { useLang, type Lang } from '../i18n'
import { useAdminT } from './i18n'
import Login from './Login'
import Dashboard from './pages/Dashboard'
import Users from './pages/Users'
import Transactions from './pages/Transactions'
import Support from './pages/Support'
import Notifications from './pages/Notifications'
import Cms from './pages/Cms'

type Section = 'dashboard' | 'users' | 'transactions' | 'support' | 'notifications' | 'cms'

const NAV: { key: Section; icon: string }[] = [
  { key: 'dashboard', icon: '▚' },
  { key: 'users', icon: '☺' },
  { key: 'transactions', icon: '▤' },
  { key: 'support', icon: '✉' },
  { key: 'notifications', icon: '🔔' },
  { key: 'cms', icon: '✎' },
]

/** Compact RU / UZ / EN segmented switcher, styled for the espresso chrome. */
function LangSwitch({ className = '' }: { className?: string }) {
  const { lang, setLang } = useLang()
  return (
    <div className={`inline-flex gap-1 rounded-full bg-white/[0.08] p-1 ${className}`}>
      {(['ru', 'uz', 'en'] as Lang[]).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`rounded-full px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wide transition-colors ${
            lang === l ? 'bg-white/[0.18] text-onEspresso' : 'text-onEspresso/50 hover:text-onEspresso'
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  )
}

const SECTION_KEYS = NAV.map((n) => n.key)
function sectionFromPath(): Section {
  const m = window.location.pathname.match(/^\/admin\/([^/]+)/)
  const s = m?.[1] as Section | undefined
  return s && (SECTION_KEYS as string[]).includes(s) ? s : 'dashboard'
}

export default function AdminApp() {
  const t = useAdminT()
  const [authed, setAuthed] = useState(!!getToken())
  const [section, setSectionState] = useState<Section>(sectionFromPath)

  // Keep the section in the URL so a refresh (and back/forward) preserves it.
  const go = (s: Section) => {
    setSectionState(s)
    window.history.pushState({}, '', s === 'dashboard' ? '/admin' : `/admin/${s}`)
  }

  useEffect(() => {
    const onLogout = () => setAuthed(false)
    const onPop = () => setSectionState(sectionFromPath())
    window.addEventListener('sevil-admin-logout', onLogout)
    window.addEventListener('popstate', onPop)
    return () => {
      window.removeEventListener('sevil-admin-logout', onLogout)
      window.removeEventListener('popstate', onPop)
    }
  }, [])

  if (!authed) return <Login onSuccess={() => setAuthed(true)} />

  const logout = () => {
    clearToken()
    setAuthed(false)
  }

  return (
    <div className="flex min-h-screen bg-page text-ink">
      {/* Sidebar (desktop) */}
      <aside className="sticky top-0 hidden h-screen w-[224px] shrink-0 flex-col bg-grad-espresso p-4 md:flex">
        <div className="mb-8 flex items-center gap-2.5 px-2 pt-2">
          <img src="/logo.svg" alt="Sevil" className="h-9 w-9 rounded-[10px]" />
          <div className="leading-tight">
            <div className="text-[16px] font-black text-onEspresso">Sevil</div>
            <div className="text-[10px] font-bold uppercase tracking-[1.5px] text-gold">Admin</div>
          </div>
        </div>

        <nav className="flex flex-col gap-1">
          {NAV.map((n) => (
            <button
              key={n.key}
              onClick={() => go(n.key)}
              className={`flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-[14px] font-bold transition-colors ${
                section === n.key
                  ? 'bg-white/[0.12] text-onEspresso'
                  : 'text-onEspresso/60 hover:bg-white/[0.06] hover:text-onEspresso'
              }`}
            >
              <span className="w-5 text-center text-[15px]">{n.icon}</span>
              {t('nav.' + n.key)}
            </button>
          ))}
        </nav>

        <div className="mt-auto flex flex-col gap-2">
          <LangSwitch className="w-full justify-between" />
          <button
            onClick={logout}
            className="flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-[14px] font-bold text-onEspresso/60 transition-colors hover:bg-white/[0.06] hover:text-onEspresso"
          >
            <span className="w-5 text-center text-[15px]">⇥</span>
            {t('nav.logout')}
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center gap-2 overflow-x-auto border-b border-hair bg-grad-espresso px-3 py-2.5 md:hidden">
          <img src="/logo.svg" alt="Sevil" className="h-7 w-7 shrink-0 rounded-lg" />
          {NAV.map((n) => (
            <button
              key={n.key}
              onClick={() => go(n.key)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-[13px] font-extrabold ${
                section === n.key ? 'bg-white/[0.16] text-onEspresso' : 'text-onEspresso/60'
              }`}
            >
              {t('nav.' + n.key)}
            </button>
          ))}
          <button onClick={logout} className="shrink-0 rounded-full px-3 py-1.5 text-[13px] font-extrabold text-onEspresso/60">
            {t('nav.logout')}
          </button>
          <LangSwitch className="ml-auto shrink-0" />
        </header>

        <main className="mx-auto w-full max-w-[1080px] flex-1 p-5 md:p-8">
          {section === 'dashboard' && <Dashboard />}
          {section === 'users' && <Users />}
          {section === 'transactions' && <Transactions />}
          {section === 'support' && <Support />}
          {section === 'notifications' && <Notifications />}
          {section === 'cms' && <Cms />}
        </main>
      </div>
    </div>
  )
}
