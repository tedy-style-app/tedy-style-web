import { useEffect, useState } from 'react'
import { api } from '../api'
import { PageHeader, Spinner, ErrorState, Card } from '../ui'
import { useAdminT } from '../i18n'

type Tab = 'chat' | 'outfit' | 'enhance'

const TAB_KEYS: Tab[] = ['chat', 'outfit', 'enhance']

export default function Cms() {
  const t = useAdminT()
  const TABS = TAB_KEYS.map((key) => ({
    key,
    label: t('cms.tab.' + key),
    title: t('cms.title.' + key),
    hint: t('cms.hint.' + key),
  }))
  const [tab, setTab] = useState<Tab>('chat')
  const [system, setSystem] = useState('')
  const [outfit, setOutfit] = useState('')
  const [enhance, setEnhance] = useState('')
  const [initial, setInitial] = useState({ system: '', outfit: '', enhance: '' })
  const [state, setState] = useState<'loading' | 'error' | 'ready'>('loading')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const load = () => {
    setState('loading')
    api
      .cms()
      .then((c) => {
        const next = {
          system: c.systemPrompt ?? '',
          outfit: c.outfitPrompt ?? '',
          enhance: c.enhancePrompt ?? '',
        }
        setSystem(next.system)
        setOutfit(next.outfit)
        setEnhance(next.enhance)
        setInitial(next)
        setState('ready')
      })
      .catch(() => setState('error'))
  }
  useEffect(load, [])

  const save = async () => {
    if (saving) return
    setSaving(true)
    setSaved(false)
    try {
      const c = await api.saveCms(system, outfit, enhance)
      setInitial({
        system: c.systemPrompt ?? system,
        outfit: c.outfitPrompt ?? outfit,
        enhance: c.enhancePrompt ?? enhance,
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch {
      /* keep editor state */
    } finally {
      setSaving(false)
    }
  }

  const values: Record<Tab, string> = { chat: system, outfit, enhance }
  const setters: Record<Tab, (v: string) => void> = {
    chat: setSystem,
    outfit: setOutfit,
    enhance: setEnhance,
  }
  const initials: Record<Tab, string> = {
    chat: initial.system,
    outfit: initial.outfit,
    enhance: initial.enhance,
  }
  const dirty = (Object.keys(values) as Tab[]).some((k) => values[k] !== initials[k])
  const active = TABS.find((tb) => tb.key === tab)!
  const value = values[tab]

  return (
    <div>
      <PageHeader
        title={t('cms.title')}
        subtitle={t('cms.subtitle')}
        action={
          <div className="flex items-center gap-3">
            {saved && <span className="text-[13px] font-extrabold text-online">{t('cms.saved')}</span>}
            <button
              onClick={save}
              disabled={!dirty || saving}
              className="rounded-full bg-grad-espresso px-5 py-2.5 text-[14px] font-extrabold text-onEspresso shadow-glow disabled:opacity-40"
            >
              {saving ? t('cms.saving') : t('cms.save')}
            </button>
          </div>
        }
      />

      {state === 'loading' && <Spinner />}
      {state === 'error' && <ErrorState onRetry={load} />}
      {state === 'ready' && (
        <Card>
          {/* Tabs */}
          <div className="mb-4 flex flex-wrap gap-2">
            {TABS.map((tb) => (
              <button
                key={tb.key}
                onClick={() => setTab(tb.key)}
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[13.5px] font-extrabold transition-colors ${
                  tab === tb.key ? 'bg-espresso text-onEspresso' : 'border border-line bg-white text-ink-2'
                }`}
              >
                {tb.label}
                {values[tb.key] !== initials[tb.key] && (
                  <span className="h-1.5 w-1.5 rounded-full bg-gold" title={t('cms.unsavedDot')} />
                )}
              </button>
            ))}
          </div>

          <h3 className="text-[15px] font-extrabold text-ink">{active.title}</h3>
          <p className="mb-3 mt-1 text-[13px] font-medium text-ink-2">{active.hint}</p>
          <textarea
            value={value}
            onChange={(e) => setters[tab](e.target.value)}
            spellCheck={false}
            className="min-h-[420px] w-full resize-y rounded-2xl border border-line bg-cream p-4 font-mono text-[13px] leading-relaxed text-ink outline-none focus:border-gold-soft"
          />
          <div className="mt-2 text-right text-[12px] font-semibold text-ink-3">{t('cms.charCount', { n: value.length })}</div>
        </Card>
      )}
    </div>
  )
}
