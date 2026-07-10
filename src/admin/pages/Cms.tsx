import { useEffect, useState } from 'react'
import { api } from '../api'
import { PageHeader, Spinner, ErrorState, Card } from '../ui'

type Tab = 'chat' | 'outfit'

const TABS: { key: Tab; label: string; title: string; hint: string }[] = [
  {
    key: 'chat',
    label: 'AI-стилист (чат)',
    title: 'Системный промпт — чат',
    hint: 'Задаёт поведение Sevil в чате: тон, язык, формат ответов. Применяется к новым сообщениям.',
  },
  {
    key: 'outfit',
    label: 'Генерация образа',
    title: 'Промпт генерации образа',
    hint: 'Управляет тем, как AI собирает ежедневный образ из гардероба пользователя.',
  },
]

export default function Cms() {
  const [tab, setTab] = useState<Tab>('chat')
  const [system, setSystem] = useState('')
  const [outfit, setOutfit] = useState('')
  const [initial, setInitial] = useState({ system: '', outfit: '' })
  const [state, setState] = useState<'loading' | 'error' | 'ready'>('loading')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const load = () => {
    setState('loading')
    api
      .cms()
      .then((c) => {
        setSystem(c.systemPrompt ?? '')
        setOutfit(c.outfitPrompt ?? '')
        setInitial({ system: c.systemPrompt ?? '', outfit: c.outfitPrompt ?? '' })
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
      const c = await api.saveCms(system, outfit)
      setInitial({ system: c.systemPrompt ?? system, outfit: c.outfitPrompt ?? outfit })
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch {
      /* keep editor state */
    } finally {
      setSaving(false)
    }
  }

  const dirty = system !== initial.system || outfit !== initial.outfit
  const active = TABS.find((t) => t.key === tab)!
  const value = tab === 'chat' ? system : outfit
  const setValue = tab === 'chat' ? setSystem : setOutfit
  const tabDirty = (t: Tab) =>
    t === 'chat' ? system !== initial.system : outfit !== initial.outfit

  return (
    <div>
      <PageHeader
        title="CMS"
        subtitle="Промпты AI и контент"
        action={
          <div className="flex items-center gap-3">
            {saved && <span className="text-[13px] font-extrabold text-online">Сохранено ✓</span>}
            <button
              onClick={save}
              disabled={!dirty || saving}
              className="rounded-full bg-grad-espresso px-5 py-2.5 text-[14px] font-extrabold text-onEspresso shadow-glow disabled:opacity-40"
            >
              {saving ? 'Сохранение…' : 'Сохранить'}
            </button>
          </div>
        }
      />

      {state === 'loading' && <Spinner />}
      {state === 'error' && <ErrorState onRetry={load} />}
      {state === 'ready' && (
        <Card>
          {/* Tabs */}
          <div className="mb-4 flex gap-2">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[13.5px] font-extrabold transition-colors ${
                  tab === t.key ? 'bg-espresso text-onEspresso' : 'border border-line bg-white text-ink-2'
                }`}
              >
                {t.label}
                {tabDirty(t.key) && (
                  <span className="h-1.5 w-1.5 rounded-full bg-gold" title="Есть несохранённые изменения" />
                )}
              </button>
            ))}
          </div>

          <h3 className="text-[15px] font-extrabold text-ink">{active.title}</h3>
          <p className="mb-3 mt-1 text-[13px] font-medium text-ink-2">{active.hint}</p>
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            spellCheck={false}
            className="min-h-[420px] w-full resize-y rounded-2xl border border-line bg-cream p-4 font-mono text-[13px] leading-relaxed text-ink outline-none focus:border-gold-soft"
          />
          <div className="mt-2 text-right text-[12px] font-semibold text-ink-3">{value.length} символов</div>
        </Card>
      )}
    </div>
  )
}
