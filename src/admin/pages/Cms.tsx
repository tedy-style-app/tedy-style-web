import { useEffect, useState } from 'react'
import { api } from '../api'
import { PageHeader, Spinner, ErrorState, Card } from '../ui'

export default function Cms() {
  const [value, setValue] = useState('')
  const [initial, setInitial] = useState('')
  const [state, setState] = useState<'loading' | 'error' | 'ready'>('loading')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const load = () => {
    setState('loading')
    api
      .cms()
      .then((c) => {
        setValue(c.systemPrompt ?? '')
        setInitial(c.systemPrompt ?? '')
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
      const c = await api.saveCms(value)
      setInitial(c.systemPrompt ?? value)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch {
      /* keep editor state */
    } finally {
      setSaving(false)
    }
  }

  const dirty = value !== initial

  return (
    <div>
      <PageHeader
        title="CMS"
        subtitle="Системный промпт AI-стилиста и контент"
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
        <Card title="Системный промпт (AI-стилист)">
          <p className="mb-3 text-[13px] font-medium text-ink-2">
            Этот текст задаёт поведение Sevil (Tedy) в чате: тон, язык, формат ответов. Изменения
            применяются к новым сообщениям.
          </p>
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
