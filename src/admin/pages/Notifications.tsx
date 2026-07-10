import { useEffect, useState } from 'react'
import { api, type AdminNotification, type NotifAudience } from '../api'
import { PageHeader, Spinner, ErrorState, EmptyState, Card, Badge, Pager, fmtDate } from '../ui'

const PAGE_SIZE = 20
const AUDIENCES: { key: NotifAudience; label: string }[] = [
  { key: 'all', label: 'Все' },
  { key: 'free', label: 'Free' },
  { key: 'pro', label: 'PRO' },
  { key: 'max', label: 'MAX' },
]
const audienceLabel = (a: string) => AUDIENCES.find((x) => x.key === a)?.label ?? a

export default function Notifications() {
  const [page, setPage] = useState(1)
  const [rows, setRows] = useState<AdminNotification[]>([])
  const [total, setTotal] = useState(0)
  const [state, setState] = useState<'loading' | 'error' | 'ready'>('loading')

  const load = () => {
    setState('loading')
    api
      .notifications(page, PAGE_SIZE)
      .then((r) => {
        setRows(r.items)
        setTotal(r.total)
        setState('ready')
      })
      .catch(() => setState('error'))
  }
  useEffect(load, [page])

  return (
    <div>
      <PageHeader title="Уведомления" subtitle="Отправка push и in-app уведомлений пользователям" />

      <div className="grid gap-4 lg:grid-cols-[380px_1fr]">
        <Composer onSent={() => { setPage(1); load() }} />

        <div>
          <h3 className="mb-3 text-[15px] font-extrabold text-ink">История рассылок</h3>
          {state === 'loading' && <Spinner />}
          {state === 'error' && <ErrorState onRetry={load} />}
          {state === 'ready' &&
            (rows.length === 0 ? (
              <EmptyState icon="🔔" title="Пока ничего не отправлено" />
            ) : (
              <>
                <div className="flex flex-col gap-3">
                  {rows.map((n) => (
                    <div key={n.id} className="rounded-4xl border border-hair bg-white p-4 shadow-card">
                      <div className="flex items-center gap-2">
                        <Badge tone="espresso">{audienceLabel(n.audience)}</Badge>
                        <span className="text-[12px] font-semibold text-ink-3">📤 {n.sentCount}</span>
                        <span className="ml-auto text-[12px] font-semibold text-ink-3">{fmtDate(n.createdAt)}</span>
                      </div>
                      <div className="mt-2 text-[15px] font-extrabold text-ink">{n.title}</div>
                      <div className="mt-0.5 text-[13px] font-medium text-ink-2">{n.body}</div>
                      {n.deepLink && (
                        <div className="mt-1.5 text-[12px] font-semibold text-gold">↗ {n.deepLink}</div>
                      )}
                    </div>
                  ))}
                </div>
                <Pager page={page} total={total} pageSize={PAGE_SIZE} onPage={setPage} />
              </>
            ))}
        </div>
      </div>
    </div>
  )
}

function Composer({ onSent }: { onSent: () => void }) {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [deepLink, setDeepLink] = useState('')
  const [audience, setAudience] = useState<NotifAudience>('all')
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState('')
  const [error, setError] = useState('')

  const send = async () => {
    if (busy) return
    if (!title.trim() || !body.trim()) {
      setError('Заполните заголовок и текст')
      return
    }
    setError('')
    setDone('')
    setBusy(true)
    try {
      const n = await api.sendNotification({
        title: title.trim(),
        body: body.trim(),
        audience,
        deepLink: deepLink.trim() || undefined,
      })
      setTitle('')
      setBody('')
      setDeepLink('')
      setDone(`Отправлено ${n.sentCount} пользователям`)
      onSent()
      setTimeout(() => setDone(''), 4000)
    } catch {
      setError('Не удалось отправить')
    } finally {
      setBusy(false)
    }
  }

  return (
    <Card title="Новая рассылка" className="h-fit">
      <div className="flex flex-col gap-3">
        <Field label="Заголовок">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Например: Новая коллекция ✨"
            className="w-full bg-transparent text-[15px] font-semibold text-ink outline-none placeholder:text-ink-3"
          />
        </Field>
        <Field label="Текст">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={4}
            placeholder="Короткое сообщение для пользователей…"
            className="w-full resize-y bg-transparent text-[15px] font-medium leading-relaxed text-ink outline-none placeholder:text-ink-3"
          />
        </Field>
        <Field label="Ссылка (deep link, необязательно)">
          <input
            value={deepLink}
            onChange={(e) => setDeepLink(e.target.value)}
            placeholder="sevil://…"
            className="w-full bg-transparent text-[14px] font-semibold text-ink outline-none placeholder:text-ink-3"
          />
        </Field>

        <div>
          <div className="mb-2 text-[11px] font-bold uppercase tracking-wide text-ink-3">Аудитория</div>
          <div className="flex flex-wrap gap-2">
            {AUDIENCES.map((a) => (
              <button
                key={a.key}
                onClick={() => setAudience(a.key)}
                className={`rounded-full px-3.5 py-1.5 text-[13px] font-extrabold transition-colors ${
                  audience === a.key ? 'bg-espresso text-onEspresso' : 'border border-line bg-white text-ink-2'
                }`}
              >
                {a.label}
              </button>
            ))}
          </div>
        </div>

        {error && <div className="text-[13px] font-semibold text-like">{error}</div>}
        {done && <div className="text-[13px] font-extrabold text-online">{done} ✓</div>}

        <button
          onClick={send}
          disabled={busy}
          className="mt-1 w-full rounded-2xl bg-grad-espresso py-3 text-[15px] font-extrabold text-onEspresso shadow-glow disabled:opacity-50"
        >
          {busy ? 'Отправка…' : 'Отправить'}
        </button>
      </div>
    </Card>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col rounded-2xl border border-line bg-cream px-4 py-2.5 focus-within:border-gold-soft">
      <span className="mb-0.5 text-[11px] font-bold uppercase tracking-wide text-ink-3">{label}</span>
      {children}
    </label>
  )
}
