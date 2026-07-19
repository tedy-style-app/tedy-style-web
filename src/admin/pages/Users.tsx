import { useEffect, useState } from 'react'
import { api, resolveUrl, type Stats, type UserRow, type UserDetail } from '../api'
import { Card, PageHeader, Spinner, ErrorState, EmptyState, Table, Pager, Badge, fmtDate } from '../ui'
import { BarList } from '../charts'
import { useAdminT, type AdminT } from '../i18n'

const PAGE_SIZE = 20
const planTone = (p: string) =>
  p?.toUpperCase() === 'MAX' ? 'gold' : p?.toUpperCase() === 'PRO' ? 'espresso' : 'neutral'

type Tab = 'list' | 'auditory'

export default function Users() {
  const t = useAdminT()
  const [tab, setTab] = useState<Tab>('list')

  return (
    <div>
      <PageHeader title={t('users.title')} subtitle={t('users.subtitle')} />

      {/* Tab strip (active-pill) */}
      <div className="mb-5 inline-flex gap-1 rounded-full border border-line bg-white p-1">
        {(['list', 'auditory'] as Tab[]).map((k) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={`rounded-full px-4 py-1.5 text-[13px] font-extrabold transition-colors ${
              tab === k ? 'bg-espresso text-onEspresso' : 'text-ink-2 hover:text-ink'
            }`}
          >
            {t('users.tab.' + k)}
          </button>
        ))}
      </div>

      {tab === 'list' ? <UsersList t={t} /> : <Auditory t={t} />}
    </div>
  )
}

function UsersList({ t }: { t: AdminT }) {
  const [search, setSearch] = useState('')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [rows, setRows] = useState<UserRow[]>([])
  const [total, setTotal] = useState(0)
  const [state, setState] = useState<'loading' | 'error' | 'ready'>('loading')
  const [selected, setSelected] = useState<string | null>(null)

  const load = () => {
    setState('loading')
    api
      .users(query, page, PAGE_SIZE)
      .then((r) => {
        setRows(r.items)
        setTotal(r.total)
        setState('ready')
      })
      .catch(() => setState('error'))
  }
  useEffect(load, [query, page])

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    setQuery(search.trim())
  }

  return (
    <div>
      <form onSubmit={onSearch} className="mb-5 flex items-center gap-2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('users.searchPlaceholder')}
          className="w-[240px] rounded-full border border-line bg-white px-4 py-2 text-[14px] font-semibold text-ink outline-none focus:border-gold-soft"
        />
        <button className="rounded-full bg-grad-espresso px-4 py-2 text-[13px] font-extrabold text-onEspresso shadow-glow-soft">
          {t('users.searchButton')}
        </button>
        <span className="text-[13px] font-bold text-ink-3">{t('common.total', { n: total.toLocaleString('ru-RU') })}</span>
      </form>

      {state === 'loading' && <Spinner />}
      {state === 'error' && <ErrorState onRetry={load} />}
      {state === 'ready' &&
        (rows.length === 0 ? (
          <EmptyState icon="👤" title={t('users.empty')} />
        ) : (
          <>
            <Table<UserRow>
              keyOf={(r) => r.id}
              onRow={(r) => setSelected(r.id)}
              columns={[
                {
                  key: 'name',
                  header: t('users.col.user'),
                  cell: (r) => (
                    <div>
                      <div className="font-bold text-ink">{r.fullName || '—'}</div>
                      <div className="text-[12px] font-semibold text-ink-3">@{r.username || '—'}</div>
                    </div>
                  ),
                },
                { key: 'plan', header: t('users.col.plan'), cell: (r) => <Badge tone={planTone(r.plan)}>{r.plan || 'FREE'}</Badge> },
                { key: 'gender', header: t('users.col.gender'), cell: (r) => r.gender || '—' },
                { key: 'region', header: t('users.col.region'), cell: (r) => r.region || '—' },
                { key: 'created', header: t('users.col.created'), cell: (r) => fmtDate(r.createdAt) },
              ]}
              rows={rows}
            />
            <Pager page={page} total={total} pageSize={PAGE_SIZE} onPage={setPage} />
          </>
        ))}

      {selected && <UserDrawer id={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}

/** Audience breakdown: gender, region and age distributions from /stats. */
function Auditory({ t }: { t: AdminT }) {
  const [data, setData] = useState<Stats | null>(null)
  const [state, setState] = useState<'loading' | 'error' | 'ready'>('loading')

  const load = () => {
    setState('loading')
    api
      .stats()
      .then((s) => {
        setData(s)
        setState('ready')
      })
      .catch(() => setState('error'))
  }
  useEffect(load, [])

  if (state === 'loading') return <Spinner />
  if (state === 'error' || !data) return <ErrorState onRetry={load} />

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card title={t('dashboard.chart.gender')}>
        <BarList data={data.personalization?.gender ?? []} color="#3E322A" />
      </Card>
      <Card title={t('dashboard.chart.region')}>
        <BarList data={data.personalization?.region ?? []} color="#8C6E52" />
      </Card>
      <Card title={t('dashboard.chart.age')} className="lg:col-span-2">
        <BarList data={data.age ?? []} color="#5B9E5E" />
      </Card>
    </div>
  )
}

function UserDrawer({ id, onClose }: { id: string; onClose: () => void }) {
  const t = useAdminT()
  const [data, setData] = useState<UserDetail | null>(null)
  const [state, setState] = useState<'loading' | 'error' | 'ready'>('loading')

  useEffect(() => {
    setState('loading')
    api
      .user(id)
      .then((d) => {
        setData(d)
        setState('ready')
      })
      .catch(() => setState('error'))
  }, [id])

  return (
    <div className="fixed inset-0 z-[200] flex justify-end bg-black/30" onClick={onClose}>
      <div
        className="h-full w-full max-w-[480px] overflow-y-auto bg-page p-6 shadow-float"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-[20px] font-black text-ink">{t('users.drawer.profile')}</h2>
          <button onClick={onClose} className="rounded-full bg-white px-3 py-1.5 text-[14px] font-extrabold text-ink-2 shadow-soft">
            ✕
          </button>
        </div>

        {state === 'loading' && <Spinner />}
        {state === 'error' && <div className="text-[14px] font-semibold text-ink-3">{t('users.drawer.loadError')}</div>}
        {state === 'ready' && data && (
          <>
            <div className="rounded-4xl border border-hair bg-white p-5 shadow-card">
              <div className="text-[18px] font-black text-ink">{data.fullName || '—'}</div>
              <div className="text-[13px] font-semibold text-ink-3">@{data.username || '—'}</div>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <Info label={t('users.info.plan')} value={data.plan || 'FREE'} />
                <Info label={t('users.info.gender')} value={data.gender} />
                <Info label={t('users.info.region')} value={data.region} />
                <Info label={t('users.info.colorType')} value={data.colorSeason} />
                <Info label={t('users.info.bodyShape')} value={data.bodyShape} />
                <Info label={t('users.info.height')} value={data.heightCm ? t('users.info.heightValue', { n: data.heightCm }) : null} />
                <Info label={t('users.info.birthYear')} value={data.birthYear ? String(data.birthYear) : null} />
                <Info label={t('users.info.created')} value={fmtDate(data.createdAt)} />
              </div>
              {data.favoriteColors && <Info label={t('users.info.favoriteColors')} value={data.favoriteColors} full />}
              {data.bio && <Info label={t('users.info.bio')} value={data.bio} full />}
            </div>

            <h3 className="mb-3 mt-6 text-[15px] font-extrabold text-ink">
              {t('users.styles.heading', { n: data.stylesCount })}
            </h3>
            {data.styles.length === 0 ? (
              <EmptyState icon="🎨" title={t('users.styles.empty')} />
            ) : (
              <div className="grid grid-cols-3 gap-2.5">
                {data.styles.map((st) => {
                  const img = resolveUrl(st.imageUrl)
                  return (
                    <div key={st.id} className="overflow-hidden rounded-2xl border border-hair bg-white shadow-soft">
                      <div className="flex aspect-square items-center justify-center bg-cream">
                        {img ? (
                          <img src={img} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <span className="text-3xl">👗</span>
                        )}
                      </div>
                      <div className="px-2 py-1.5 text-[10px] font-bold text-ink-3">{fmtDate(st.createdAt)}</div>
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function Info({ label, value, full }: { label: string; value: string | null; full?: boolean }) {
  return (
    <div className={full ? 'col-span-2 mt-3' : ''}>
      <div className="text-[11px] font-bold uppercase tracking-wide text-ink-3">{label}</div>
      <div className="text-[14px] font-semibold text-ink">{value || '—'}</div>
    </div>
  )
}
