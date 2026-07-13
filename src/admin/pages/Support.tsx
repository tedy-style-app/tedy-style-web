import { useEffect, useState } from 'react'
import { api, resolveUrl, type Feedback } from '../api'
import { PageHeader, Spinner, ErrorState, EmptyState, Pager, Badge, fmtDate } from '../ui'
import { useAdminT } from '../i18n'

const PAGE_SIZE = 20
const STATUSES = ['new', 'in_progress', 'resolved']
const typeTone = (t: string) => (t === 'bug' ? 'red' : t === 'suggestion' ? 'gold' : 'neutral')

export default function Support() {
  const t = useAdminT()
  const [page, setPage] = useState(1)
  const [filter, setFilter] = useState('')
  const [rows, setRows] = useState<Feedback[]>([])
  const [total, setTotal] = useState(0)
  const [state, setState] = useState<'loading' | 'error' | 'ready'>('loading')
  const [open, setOpen] = useState<Feedback | null>(null)

  const load = () => {
    setState('loading')
    api
      .feedback(page, filter, PAGE_SIZE)
      .then((r) => {
        setRows(r.items)
        setTotal(r.total)
        setState('ready')
      })
      .catch(() => setState('error'))
  }
  useEffect(load, [page, filter])

  const updateStatus = async (f: Feedback, status: string) => {
    try {
      const updated = await api.updateFeedback(f.id, status)
      setRows((rs) => rs.map((x) => (x.id === f.id ? updated : x)))
      setOpen((o) => (o && o.id === f.id ? updated : o))
    } catch {
      /* ignore — keep UI as-is */
    }
  }

  return (
    <div>
      <PageHeader
        title={t('support.title')}
        subtitle={t('support.subtitle', { n: total.toLocaleString('ru-RU') })}
        action={
          <div className="flex gap-1.5">
            <FilterChip active={filter === ''} onClick={() => { setPage(1); setFilter('') }}>
              {t('support.filter.all')}
            </FilterChip>
            {STATUSES.map((s) => (
              <FilterChip key={s} active={filter === s} onClick={() => { setPage(1); setFilter(s) }}>
                {t('support.status.' + s)}
              </FilterChip>
            ))}
          </div>
        }
      />

      {state === 'loading' && <Spinner />}
      {state === 'error' && <ErrorState onRetry={load} />}
      {state === 'ready' &&
        (rows.length === 0 ? (
          <EmptyState icon="📨" title={t('support.empty.title')} hint={t('support.empty.hint')} />
        ) : (
          <>
            <div className="flex flex-col gap-3">
              {rows.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setOpen(f)}
                  className="rounded-4xl border border-hair bg-white p-4 text-left shadow-card transition-colors hover:bg-cream"
                >
                  <div className="flex items-center gap-2">
                    <Badge tone={typeTone(f.type)}>{t('support.type.' + f.type)}</Badge>
                    <Badge tone={f.status === 'resolved' ? 'green' : f.status === 'new' ? 'espresso' : 'neutral'}>
                      {t('support.status.' + f.status)}
                    </Badge>
                    <span className="ml-auto text-[12px] font-semibold text-ink-3">{fmtDate(f.createdAt)}</span>
                  </div>
                  <div className="mt-2 text-[15px] font-extrabold text-ink">{f.title}</div>
                  <div className="mt-0.5 line-clamp-2 text-[13px] font-medium text-ink-2">{f.description}</div>
                  <div className="mt-1.5 text-[12px] font-semibold text-ink-3">
                    {f.userName || t('support.userFallback')}
                    {f.attachmentUrl ? ' · ' + t('support.attachment') : ''}
                  </div>
                </button>
              ))}
            </div>
            <Pager page={page} total={total} pageSize={PAGE_SIZE} onPage={setPage} />
          </>
        ))}

      {open && <FeedbackDrawer f={open} onClose={() => setOpen(null)} onStatus={updateStatus} />}
    </div>
  )
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3.5 py-1.5 text-[13px] font-extrabold transition-colors ${
        active ? 'bg-espresso text-onEspresso' : 'bg-white text-ink-2 border border-line'
      }`}
    >
      {children}
    </button>
  )
}

function FeedbackDrawer({
  f,
  onClose,
  onStatus,
}: {
  f: Feedback
  onClose: () => void
  onStatus: (f: Feedback, status: string) => void
}) {
  const t = useAdminT()
  const img = resolveUrl(f.attachmentUrl)
  return (
    <div className="fixed inset-0 z-[200] flex justify-end bg-black/30" onClick={onClose}>
      <div className="h-full w-full max-w-[480px] overflow-y-auto bg-page p-6 shadow-float" onClick={(e) => e.stopPropagation()}>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-[20px] font-black text-ink">{t('support.drawer.title')}</h2>
          <button onClick={onClose} className="rounded-full bg-white px-3 py-1.5 text-[14px] font-extrabold text-ink-2 shadow-soft">
            ✕
          </button>
        </div>

        <div className="rounded-4xl border border-hair bg-white p-5 shadow-card">
          <div className="flex items-center gap-2">
            <Badge tone={typeTone(f.type)}>{t('support.type.' + f.type)}</Badge>
            <span className="ml-auto text-[12px] font-semibold text-ink-3">{fmtDate(f.createdAt)}</span>
          </div>
          <div className="mt-3 text-[18px] font-black text-ink">{f.title}</div>
          <div className="mt-1 text-[12px] font-semibold text-ink-3">{f.userName || t('support.userFallback')}</div>
          <p className="mt-4 whitespace-pre-line text-[14px] font-medium leading-relaxed text-ink-2">{f.description}</p>
          {img && (
            <img src={img} alt={t('support.attachmentAlt')} className="mt-4 w-full rounded-2xl border border-hair object-cover" />
          )}
        </div>

        <h3 className="mb-2 mt-6 text-[13px] font-extrabold uppercase tracking-wide text-ink-3">{t('support.statusHeading')}</h3>
        <div className="flex gap-2">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => onStatus(f, s)}
              className={`flex-1 rounded-2xl px-3 py-2.5 text-[13px] font-extrabold transition-colors ${
                f.status === s ? 'bg-grad-espresso text-onEspresso shadow-glow-soft' : 'border border-line bg-white text-ink-2'
              }`}
            >
              {t('support.status.' + s)}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
