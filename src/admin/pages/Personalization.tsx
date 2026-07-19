import { useEffect, useState } from 'react'
import { api, type PersonalizationRow, type Stats } from '../api'
import { Card, PageHeader, Spinner, ErrorState, EmptyState, Table, Pager, fmtDate } from '../ui'
import { BarList } from '../charts'
import { useAdminT, type AdminT } from '../i18n'

const PAGE_SIZE = 20

/** Personalization overview: style/color-type distributions + a per-user
 *  "who submitted what" table with a full-answers drawer. */
export default function Personalization() {
  const t = useAdminT()
  return (
    <div>
      <PageHeader title={t('personalization.title')} subtitle={t('personalization.subtitle')} />
      <Distributions t={t} />
      <UserTable t={t} />
    </div>
  )
}

/** Styles/looks + color-type BarLists (moved off the dashboard). */
function Distributions({ t }: { t: AdminT }) {
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
    <div className="mb-6 grid gap-4 lg:grid-cols-2">
      <Card title={t('dashboard.chart.styles')}>
        <BarList data={data.personalization?.style ?? []} color="#3E322A" />
      </Card>
      <Card title={t('dashboard.chart.colorType')}>
        <BarList data={data.personalization?.colorType ?? []} color="#CB9A5C" />
      </Card>
    </div>
  )
}

function UserTable({ t }: { t: AdminT }) {
  const [search, setSearch] = useState('')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [rows, setRows] = useState<PersonalizationRow[]>([])
  const [total, setTotal] = useState(0)
  const [state, setState] = useState<'loading' | 'error' | 'ready'>('loading')
  const [selected, setSelected] = useState<PersonalizationRow | null>(null)

  const load = () => {
    setState('loading')
    api
      .personalization(query, page, PAGE_SIZE)
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
          placeholder={t('personalization.searchPlaceholder')}
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
          <EmptyState icon="🎨" title={t('personalization.empty')} />
        ) : (
          <>
            <Table<PersonalizationRow>
              keyOf={(r) => r.id}
              onRow={(r) => setSelected(r)}
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
                { key: 'gender', header: t('users.col.gender'), cell: (r) => r.gender || '—' },
                { key: 'country', header: t('personalization.col.country'), cell: (r) => r.country || '—' },
                { key: 'colorSeason', header: t('users.info.colorType'), cell: (r) => r.colorSeason || '—' },
                { key: 'bodyShape', header: t('users.info.bodyShape'), cell: (r) => r.bodyShape || '—' },
                {
                  key: 'styles',
                  header: t('dashboard.chart.styles'),
                  cell: (r) => (r.stylePersonas.length ? r.stylePersonas.join(', ') : '—'),
                },
                { key: 'created', header: t('users.col.created'), cell: (r) => fmtDate(r.createdAt) },
              ]}
              rows={rows}
            />
            <Pager page={page} total={total} pageSize={PAGE_SIZE} onPage={setPage} />
          </>
        ))}

      {selected && <AnswersDrawer row={selected} t={t} onClose={() => setSelected(null)} />}
    </div>
  )
}

/** Right slide-over showing every personalization answer for one user. */
function AnswersDrawer({ row, t, onClose }: { row: PersonalizationRow; t: AdminT; onClose: () => void }) {
  const hijab =
    row.hijab == null ? null : row.hijab ? t('personalization.value.yes') : t('personalization.value.no')

  return (
    <div className="fixed inset-0 z-[200] flex justify-end bg-black/30" onClick={onClose}>
      <div
        className="h-full w-full max-w-[480px] overflow-y-auto bg-page p-6 shadow-float"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-[20px] font-black text-ink">{t('personalization.drawer.title')}</h2>
          <button onClick={onClose} className="rounded-full bg-white px-3 py-1.5 text-[14px] font-extrabold text-ink-2 shadow-soft">
            ✕
          </button>
        </div>

        <div className="rounded-4xl border border-hair bg-white p-5 shadow-card">
          <div className="text-[18px] font-black text-ink">{row.fullName || '—'}</div>
          <div className="text-[13px] font-semibold text-ink-3">@{row.username || '—'}</div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <Info label={t('users.info.gender')} value={row.gender} />
            <Info label={t('personalization.info.country')} value={row.country} />
            <Info label={t('personalization.info.city')} value={row.city} />
            <Info label={t('users.info.region')} value={row.region} />
            <Info label={t('users.info.colorType')} value={row.colorSeason} />
            <Info label={t('users.info.bodyShape')} value={row.bodyShape} />
            <Info label={t('users.info.birthYear')} value={row.birthYear ? String(row.birthYear) : null} />
            <Info label={t('users.info.height')} value={row.heightCm ? t('users.info.heightValue', { n: row.heightCm }) : null} />
            <Info label={t('personalization.info.weight')} value={row.weightKg ? t('personalization.info.weightValue', { n: row.weightKg }) : null} />
            <Info label={t('personalization.info.hijab')} value={hijab} />
            <Info label={t('users.info.created')} value={fmtDate(row.createdAt)} />
          </div>

          <Info label={t('users.info.favoriteColors')} value={joinOrNull(row.favoriteColors)} full />
          <Info label={t('personalization.info.styles')} value={joinOrNull(row.stylePersonas)} full />
          <Info label={t('personalization.info.painPoints')} value={joinOrNull(row.painPoints)} full />
        </div>
      </div>
    </div>
  )
}

const joinOrNull = (arr: string[]) => (arr && arr.length ? arr.join(', ') : null)

function Info({ label, value, full }: { label: string; value: string | null; full?: boolean }) {
  return (
    <div className={full ? 'col-span-2 mt-3' : ''}>
      <div className="text-[11px] font-bold uppercase tracking-wide text-ink-3">{label}</div>
      <div className="text-[14px] font-semibold text-ink">{value || '—'}</div>
    </div>
  )
}
