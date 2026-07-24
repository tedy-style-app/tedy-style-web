import { useEffect, useMemo, useState } from 'react'
import {
  api,
  resolveUrl,
  type AiUsageRow,
  type AiUsageDetail,
  type AiUsageFilters,
  type AiUsageSummary,
} from '../api'
import {
  PageHeader,
  StatCard,
  Card,
  Spinner,
  ErrorState,
  EmptyState,
  Table,
  Pager,
  Badge,
  fmtDateTime,
} from '../ui'
import { LineChart, Donut, BarList, DateRange, type DateRangeValue } from '../charts'
import { useAdminT, type AdminT } from '../i18n'

const PAGE_SIZE = 20

// Known enums (from the backend AiUsage recorder — see 01-backend-understanding).
const PROVIDERS = ['GoogleAI', 'Vertex', 'Groq', 'OpenRouter', 'OpenAI', 'Runware']
const OPERATIONS = [
  'clothing.analyze',
  'clothing.enhance',
  'stylist.chat',
  'wishlist.suggest',
  'outfit.match',
  'image.compose',
]
const STATUSES = [1, 2, 3]
const DONUT_COLORS = ['#3E322A', '#CB9A5C', '#8C6E52', '#5B9E5E', '#B4654A', '#6A7BA2']

const statusTone = (s: number) => (s === 1 ? 'green' : s === 2 ? 'red' : 'gold')
const statusKey = (s: number) => (s === 1 ? 'success' : s === 2 ? 'failed' : 'rejected')

const fmtCost = (n: number | null | undefined) => (n != null ? `$${n.toFixed(4)}` : '—')
const fmtNum = (n: number | null | undefined) => (n != null ? n.toLocaleString('ru-RU') : null)
const fmtTokens = (n: number | null | undefined) => (n != null ? n.toLocaleString('ru-RU') : '—')

const INPUT_CLASS =
  'rounded-full border border-line bg-white px-4 py-2 text-[14px] font-semibold text-ink outline-none focus:border-gold-soft'
const SELECT_CLASS =
  'rounded-full border border-line bg-white px-4 py-2 text-[13px] font-semibold text-ink outline-none focus:border-gold-soft'

export default function AiUsage() {
  const t = useAdminT()

  // Committed filter object — drives both the list and the summary.
  const [filters, setFilters] = useState<AiUsageFilters>({})
  const [page, setPage] = useState(1)

  // Draft text inputs (committed on submit); selects/date-range commit instantly.
  const [search, setSearch] = useState('')
  const [model, setModel] = useState('')
  const [userId, setUserId] = useState('')
  const [days, setDays] = useState(0)

  // List state.
  const [rows, setRows] = useState<AiUsageRow[]>([])
  const [total, setTotal] = useState(0)
  const [listState, setListState] = useState<'loading' | 'error' | 'ready'>('loading')

  // Summary (cards + charts) state.
  const [summary, setSummary] = useState<AiUsageSummary | null>(null)
  const [sumState, setSumState] = useState<'loading' | 'error' | 'ready'>('loading')

  const [selected, setSelected] = useState<string | null>(null)

  const loadList = () => {
    setListState('loading')
    api
      .aiUsage(page, filters, PAGE_SIZE)
      .then((r) => {
        setRows(r.items)
        setTotal(r.total)
        setListState('ready')
      })
      .catch(() => setListState('error'))
  }
  const loadSummary = () => {
    setSumState('loading')
    api
      .aiUsageSummary(filters)
      .then((s) => {
        setSummary(s)
        setSumState('ready')
      })
      .catch(() => setSumState('error'))
  }
  useEffect(loadList, [filters, page])
  useEffect(loadSummary, [filters])

  // Merge a filter patch and reset paging to the first page.
  const patch = (p: Partial<AiUsageFilters>) => {
    setPage(1)
    setFilters((f) => ({ ...f, ...p }))
  }

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault()
    patch({
      search: search.trim() || undefined,
      model: model.trim() || undefined,
      userId: userId.trim() || undefined,
    })
  }

  const onDateRange = (n: number, range: DateRangeValue) => {
    setDays(n)
    patch({ from: range.from, to: range.to })
  }

  return (
    <div>
      <PageHeader title={t('aiUsage.title')} subtitle={t('aiUsage.subtitle')} />

      {/* Stat cards + charts (filter-aware). */}
      {sumState === 'loading' && (
        <div className="mb-8">
          <Spinner />
        </div>
      )}
      {sumState === 'error' && (
        <div className="mb-8">
          <ErrorState onRetry={loadSummary} />
        </div>
      )}
      {sumState === 'ready' && summary && (
        <div className="mb-8 flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <StatCard label={t('aiUsage.stat.calls')} value={summary.totalCalls.toLocaleString('ru-RU')} />
            <StatCard label={t('aiUsage.stat.success')} value={summary.successCount.toLocaleString('ru-RU')} />
            <StatCard label={t('aiUsage.stat.failed')} value={summary.failedCount.toLocaleString('ru-RU')} />
            <StatCard label={t('aiUsage.stat.tokens')} value={summary.totalTokens.toLocaleString('ru-RU')} />
            <StatCard
              label={t('aiUsage.stat.cost')}
              value={fmtCost(summary.totalCostUsd)}
              spark={summary.costOverTime.map((p) => ({ date: p.date, value: p.cost }))}
            />
          </div>

          <Card title={t('aiUsage.chart.costOverTime')}>
            <LineChart
              data={summary.costOverTime.map((p) => ({ date: p.date, value: p.cost }))}
              formatValue={fmtCost}
            />
          </Card>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card title={t('aiUsage.chart.byProvider')}>
              {summary.byProvider.length === 0 ? (
                <EmptyState icon="🤖" title={t('chart.empty')} />
              ) : (
                <Donut
                  segments={summary.byProvider.map((s, i) => ({
                    label: s.provider,
                    value: s.calls,
                    color: DONUT_COLORS[i % DONUT_COLORS.length],
                  }))}
                />
              )}
            </Card>
            <Card title={t('aiUsage.chart.byOperation')}>
              <BarList data={summary.byOperation.map((s) => ({ label: s.operation, count: s.calls }))} />
            </Card>
          </div>
        </div>
      )}

      {/* Filters. */}
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <form onSubmit={onSearch} className="flex flex-wrap items-center gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('aiUsage.filter.searchPlaceholder')}
            className={`${INPUT_CLASS} w-[240px]`}
          />
          <input
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder={t('aiUsage.filter.modelPlaceholder')}
            className={`${INPUT_CLASS} w-[150px]`}
          />
          <input
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder={t('aiUsage.filter.userPlaceholder')}
            className={`${INPUT_CLASS} w-[170px]`}
          />
          <button className="rounded-full bg-grad-espresso px-4 py-2 text-[13px] font-extrabold text-onEspresso shadow-glow-soft">
            {t('aiUsage.filter.search')}
          </button>
        </form>

        <select
          value={filters.provider ?? ''}
          onChange={(e) => patch({ provider: e.target.value || undefined })}
          className={SELECT_CLASS}
        >
          <option value="">{t('aiUsage.filter.provider')}</option>
          {PROVIDERS.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>

        <select
          value={filters.operation ?? ''}
          onChange={(e) => patch({ operation: e.target.value || undefined })}
          className={SELECT_CLASS}
        >
          <option value="">{t('aiUsage.filter.operation')}</option>
          {OPERATIONS.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>

        <select
          value={filters.status ?? ''}
          onChange={(e) => patch({ status: e.target.value ? Number(e.target.value) : undefined })}
          className={SELECT_CLASS}
        >
          <option value="">{t('aiUsage.filter.status')}</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {t('aiUsage.status.' + statusKey(s))}
            </option>
          ))}
        </select>

        <DateRange days={days} onChange={onDateRange} />
      </div>

      {/* List. */}
      {listState === 'loading' && <Spinner />}
      {listState === 'error' && <ErrorState onRetry={loadList} />}
      {listState === 'ready' &&
        (rows.length === 0 ? (
          <EmptyState icon="🤖" title={t('aiUsage.empty')} />
        ) : (
          <>
            <Table<AiUsageRow>
              keyOf={(r) => r.id}
              onRow={(r) => setSelected(r.id)}
              columns={[
                {
                  key: 'time',
                  header: t('aiUsage.col.time'),
                  cell: (r) => <span className="whitespace-nowrap text-ink-2">{fmtDateTime(r.createdAt)}</span>,
                },
                {
                  key: 'operation',
                  header: t('aiUsage.col.operation'),
                  cell: (r) => (
                    <span className="font-bold text-ink">
                      {r.hasError && (
                        <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-like align-middle" />
                      )}
                      {r.operation}
                    </span>
                  ),
                },
                { key: 'provider', header: t('aiUsage.col.provider'), cell: (r) => r.provider || '—' },
                {
                  key: 'model',
                  header: t('aiUsage.col.model'),
                  cell: (r) => <span className="text-ink-3">{r.model || '—'}</span>,
                },
                {
                  key: 'status',
                  header: t('aiUsage.col.status'),
                  cell: (r) => <Badge tone={statusTone(r.status)}>{t('aiUsage.status.' + statusKey(r.status))}</Badge>,
                },
                { key: 'tokens', header: t('aiUsage.col.tokens'), cell: (r) => fmtTokens(r.totalTokens) },
                { key: 'cost', header: t('aiUsage.col.cost'), cell: (r) => fmtCost(r.estimatedCostUsd) },
                { key: 'duration', header: t('aiUsage.col.duration'), cell: (r) => `${r.durationMs} ms` },
                {
                  key: 'user',
                  header: t('aiUsage.col.user'),
                  cell: (r) => r.userName || (r.triggeredByUserId ? '—' : t('aiUsage.system')),
                },
              ]}
              rows={rows}
            />
            <Pager page={page} total={total} pageSize={PAGE_SIZE} onPage={setPage} />
          </>
        ))}

      {selected && <AiUsageDrawer id={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}

function AiUsageDrawer({ id, onClose }: { id: string; onClose: () => void }) {
  const t = useAdminT()
  const [data, setData] = useState<AiUsageDetail | null>(null)
  const [state, setState] = useState<'loading' | 'error' | 'ready'>('loading')

  useEffect(() => {
    setState('loading')
    api
      .aiUsageDetail(id)
      .then((d) => {
        setData(d)
        setState('ready')
      })
      .catch(() => setState('error'))
  }, [id])

  return (
    <div className="fixed inset-0 z-[200] flex justify-end bg-black/30" onClick={onClose}>
      <div
        className="h-full w-full max-w-[560px] overflow-y-auto bg-page p-6 shadow-float"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-[20px] font-black text-ink">{t('aiUsage.drawer.title')}</h2>
          <button
            onClick={onClose}
            className="rounded-full bg-white px-3 py-1.5 text-[14px] font-extrabold text-ink-2 shadow-soft"
          >
            ✕
          </button>
        </div>

        {state === 'loading' && <Spinner />}
        {state === 'error' && (
          <div className="text-[14px] font-semibold text-ink-3">{t('aiUsage.drawer.loadError')}</div>
        )}
        {state === 'ready' && data && <DrawerBody data={data} t={t} />}
      </div>
    </div>
  )
}

function DrawerBody({ data, t }: { data: AiUsageDetail; t: AdminT }) {
  return (
    <>
      <div className="rounded-4xl border border-hair bg-white p-5 shadow-card">
        <div className="flex items-center justify-between gap-3">
          <div className="text-[18px] font-black text-ink">{data.operation}</div>
          <Badge tone={statusTone(data.status)}>{t('aiUsage.status.' + statusKey(data.status))}</Badge>
        </div>
        <div className="mt-0.5 text-[13px] font-semibold text-ink-3">
          {data.provider} · {data.model}
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <Info label={t('aiUsage.info.created')} value={fmtDateTime(data.createdAt)} />
          <Info label={t('aiUsage.info.started')} value={fmtDateTime(data.startedAt)} />
          <Info label={t('aiUsage.info.finished')} value={fmtDateTime(data.finishedAt)} />
          <Info label={t('aiUsage.info.duration')} value={t('aiUsage.info.durationValue', { n: data.durationMs })} />
          <Info
            label={t('aiUsage.info.user')}
            value={data.userName || (data.triggeredByUserId ? '—' : t('aiUsage.system'))}
          />
          <Info label={t('aiUsage.info.context')} value={data.context} />
          <Info label={t('aiUsage.info.inputTokens')} value={fmtNum(data.inputTokens)} />
          <Info label={t('aiUsage.info.outputTokens')} value={fmtNum(data.outputTokens)} />
          <Info label={t('aiUsage.info.totalTokens')} value={fmtNum(data.totalTokens)} />
          <Info label={t('aiUsage.info.textTokens')} value={fmtNum(data.textTokens)} />
          <Info label={t('aiUsage.info.imageTokens')} value={fmtNum(data.imageTokens)} />
          <Info label={t('aiUsage.info.cost')} value={fmtCost(data.estimatedCostUsd)} />
        </div>
      </div>

      {data.error && (
        <Section title={t('aiUsage.section.error')}>
          <div className="whitespace-pre-wrap break-words rounded-2xl border border-like/30 bg-like/[0.08] p-3 text-[13px] font-semibold text-like">
            {data.error}
          </div>
        </Section>
      )}

      {data.prompt && (
        <Section title={t('aiUsage.section.prompt')}>
          <pre className="max-h-64 overflow-auto whitespace-pre-wrap break-words rounded-2xl border border-hair bg-white p-3 font-mono text-[12px] text-ink-2">
            {data.prompt}
          </pre>
        </Section>
      )}

      {data.requestParams && (
        <Collapsible title={t('aiUsage.section.requestParams')}>
          <JsonBlock raw={data.requestParams} />
        </Collapsible>
      )}
      {data.responsePayload && (
        <Collapsible title={t('aiUsage.section.responsePayload')}>
          <JsonBlock raw={data.responsePayload} />
        </Collapsible>
      )}

      {data.inputImageUrls.length > 0 && (
        <Section title={t('aiUsage.section.inputImages')}>
          <ImageGrid urls={data.inputImageUrls} />
        </Section>
      )}
      {data.outputImageUrls.length > 0 && (
        <Section title={t('aiUsage.section.outputImages')}>
          <ImageGrid urls={data.outputImageUrls} />
        </Section>
      )}
    </>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-6">
      <h3 className="mb-2 text-[15px] font-extrabold text-ink">{title}</h3>
      {children}
    </div>
  )
}

function Collapsible({ title, children }: { title: string; children: React.ReactNode }) {
  const t = useAdminT()
  const [open, setOpen] = useState(false)
  return (
    <div className="mt-6">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-[15px] font-extrabold text-ink">{title}</h3>
        <button
          onClick={() => setOpen((v) => !v)}
          className="rounded-full border border-line bg-white px-3 py-1 text-[12px] font-extrabold text-ink-2"
        >
          {open ? t('aiUsage.toggle.hide') : t('aiUsage.toggle.show')}
        </button>
      </div>
      {open && children}
    </div>
  )
}

function JsonBlock({ raw }: { raw: string }) {
  const pretty = useMemo(() => {
    try {
      return JSON.stringify(JSON.parse(raw), null, 2)
    } catch {
      return raw
    }
  }, [raw])
  return (
    <pre className="max-h-72 overflow-auto whitespace-pre-wrap break-words rounded-2xl border border-hair bg-white p-3 font-mono text-[12px] text-ink-2">
      {pretty}
    </pre>
  )
}

function ImageGrid({ urls }: { urls: string[] }) {
  return (
    <div className="grid grid-cols-3 gap-2.5">
      {urls.map((u, i) => {
        const img = resolveUrl(u)
        if (!img) return null
        return (
          <a
            key={i}
            href={img}
            target="_blank"
            rel="noreferrer"
            className="overflow-hidden rounded-2xl border border-hair bg-white shadow-soft"
          >
            <div className="flex aspect-square items-center justify-center bg-cream">
              <img src={img} alt="" className="h-full w-full object-cover" />
            </div>
          </a>
        )
      })}
    </div>
  )
}

function Info({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <div className="text-[11px] font-bold uppercase tracking-wide text-ink-3">{label}</div>
      <div className="break-words text-[14px] font-semibold text-ink">{value || '—'}</div>
    </div>
  )
}
