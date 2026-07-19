import { useCallback, useEffect, useState } from 'react'
import { api, type ActivitySeries, type Point, type Stats } from '../api'
import { Card, StatCard, PageHeader, Spinner, ErrorState, fmtMoney } from '../ui'
import { LineChart, Donut, DateRange, rangeForDays, type DateRangeValue } from '../charts'
import { useAdminT, type AdminT } from '../i18n'

export default function Dashboard() {
  const t = useAdminT()
  const [days, setDays] = useState(30)
  const [range, setRange] = useState<DateRangeValue>(() => rangeForDays(30))
  const [data, setData] = useState<Stats | null>(null)
  const [state, setState] = useState<'loading' | 'error' | 'ready'>('loading')
  const [activityOpen, setActivityOpen] = useState(false)

  const load = useCallback(() => {
    setState('loading')
    api
      .stats(range.from, range.to)
      .then((s) => {
        setData(s)
        setState('ready')
      })
      .catch(() => setState('error'))
  }, [range])
  useEffect(load, [load])

  // Both section controls share one range so the whole stats object stays in sync.
  const changeRange = (n: number, r: DateRangeValue) => {
    setDays(n)
    setRange(r)
  }

  // Keep prior data visible while a range refetch is in flight (no full-page flash).
  if (state === 'loading' && !data) return <Spinner label={t('dashboard.loading')} />
  if (state === 'error' && !data) return <ErrorState onRetry={load} />
  if (!data) return null

  const s = data
  // Defensive defaults — the admin must never white-screen if the deployed
  // backend is a step behind the frontend and omits a newer stats field.
  const activity = s.activity ?? { dau: 0, wau: 0, mau: 0 }
  const retention = s.retention ?? { daily: 0, weekly: 0, monthly: 0 }
  const transactions = s.transactions ?? []

  return (
    <div>
      <PageHeader title={t('dashboard.title')} subtitle={t('dashboard.subtitle')} />

      {/* ── Section 1 — Users count · activity · retention ──────── */}
      <h2 className="mb-3 mt-2 text-[17px] font-black text-ink">{t('dashboard.section.audience')}</h2>
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Users count */}
        <Card title={t('dashboard.usersCount')}>
          <div className="flex items-baseline gap-2">
            <span className="text-[34px] font-black leading-none text-ink">
              {s.users.total.toLocaleString('ru-RU')}
            </span>
            <span className="text-[13px] font-bold text-ink-3">{t('dashboard.usersTotal')}</span>
          </div>
          <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-online/[0.14] px-3 py-1 text-[13px] font-extrabold text-online">
            +{s.users.new30d.toLocaleString('ru-RU')} · {t('dashboard.usersNew')}
          </div>
        </Card>

        {/* DAU / WAU / MAU — clickable → modal */}
        <button
          onClick={() => setActivityOpen(true)}
          className="rounded-4xl border border-hair bg-white p-5 text-left shadow-card transition-shadow hover:shadow-float"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-[15px] font-extrabold text-ink">{t('dashboard.activity.title')}</h3>
            <span className="text-ink-3">↗</span>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {[
              { k: 'DAU', v: activity.dau, d: t('dashboard.dau.desc') },
              { k: 'WAU', v: activity.wau, d: t('dashboard.wau.desc') },
              { k: 'MAU', v: activity.mau, d: t('dashboard.mau.desc') },
            ].map((a) => (
              <div key={a.k} className="text-center">
                <div className="text-[11px] font-extrabold uppercase tracking-wide text-ink-3">{a.k}</div>
                <div className="mt-0.5 text-[22px] font-black leading-none text-ink">
                  {a.v.toLocaleString('ru-RU')}
                </div>
                <div className="mt-1 text-[10px] font-semibold text-ink-3">{a.d}</div>
              </div>
            ))}
          </div>
          <div className="mt-3 text-[12px] font-bold text-gold">{t('dashboard.activity.open')}</div>
        </button>

        {/* Retention */}
        <Card title={t('dashboard.chart.retention')}>
          <div className="flex justify-between gap-3 py-2">
            {[
              { k: t('dashboard.retention.day'), v: retention.daily },
              { k: t('dashboard.retention.week'), v: retention.weekly },
              { k: t('dashboard.retention.month'), v: retention.monthly },
            ].map((r) => (
              <div key={r.k} className="flex-1 text-center">
                <div className="text-[26px] font-black text-espresso">{r.v}%</div>
                <div className="mt-1 text-[12px] font-semibold text-ink-3">{r.k}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ── Section 2 — User growth ─────────────────────────────── */}
      <h2 className="mb-3 mt-8 text-[17px] font-black text-ink">{t('dashboard.section.growth')}</h2>
      <Card
        title={t('dashboard.chart.userGrowth')}
        action={<DateRange days={days} onChange={changeRange} />}
      >
        <LineChart data={s.users.growth} height={200} />
      </Card>

      {/* ── Section 3 — Revenue · subscriptions · transactions ──── */}
      <h2 className="mb-3 mt-8 text-[17px] font-black text-ink">{t('dashboard.section.money')}</h2>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatCard
          label={t('dashboard.stat.revenue')}
          value={fmtMoney(s.revenue.total, s.revenue.currency)}
          delta={t('dashboard.txnCountDelta', { n: s.revenue.count })}
          spark={s.revenue.growth}
        />
        <StatCard
          label={t('dashboard.stat.paidSubs')}
          value={(s.plans.pro + s.plans.max).toLocaleString('ru-RU')}
          delta={`PRO ${s.plans.pro} · MAX ${s.plans.max}`}
        />
        <StatCard label={t('dashboard.stat.free')} value={s.plans.free.toLocaleString('ru-RU')} />
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card title={t('dashboard.chart.subscriptions')}>
          <Donut
            segments={[
              { label: 'Free', value: s.plans.free, color: '#CBB597' },
              { label: 'PRO', value: s.plans.pro, color: '#3E322A' },
              { label: 'MAX', value: s.plans.max, color: '#CB9A5C' },
            ]}
          />
        </Card>
        <Card
          title={t('dashboard.chart.transactions')}
          action={<DateRange days={days} onChange={changeRange} />}
        >
          <LineChart
            data={s.revenue.growth}
            stroke="#5B9E5E"
            fill="rgba(91,158,94,0.14)"
            formatValue={(n) => fmtMoney(n, s.revenue.currency)}
          />
        </Card>
        <Card title={t('dashboard.chart.txnByStatus')} className="lg:col-span-2">
          <div className="space-y-2">
            {transactions.length === 0 && (
              <div className="py-2 text-[13px] font-semibold text-ink-3">{t('dashboard.noTransactions')}</div>
            )}
            {transactions.map((tx) => (
              <div key={tx.status} className="flex items-center justify-between text-[14px]">
                <span className="font-semibold capitalize text-ink-2">{tx.status}</span>
                <span className="font-bold text-ink-3">
                  {tx.count} · {fmtMoney(tx.amount, s.revenue.currency)}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {activityOpen && (
        <ActivityModal range={range} onClose={() => setActivityOpen(false)} t={t} />
      )}
    </div>
  )
}

/** Centered modal with DAU / WAU / MAU time series over the current range. */
function ActivityModal({
  range,
  onClose,
  t,
}: {
  range: DateRangeValue
  onClose: () => void
  t: AdminT
}) {
  const [data, setData] = useState<ActivitySeries | null>(null)
  const [state, setState] = useState<'loading' | 'error' | 'ready'>('loading')

  useEffect(() => {
    setState('loading')
    api
      .activitySeries(range.from, range.to)
      .then((d) => {
        setData(d)
        setState('ready')
      })
      .catch(() => setState('error'))
  }, [range])

  const series: { k: string; d: string; data: Point[]; stroke: string }[] = data
    ? [
        { k: 'DAU', d: t('dashboard.dau.desc'), data: data.dau, stroke: '#3E322A' },
        { k: 'WAU', d: t('dashboard.wau.desc'), data: data.wau, stroke: '#CB9A5C' },
        { k: 'MAU', d: t('dashboard.mau.desc'), data: data.mau, stroke: '#5B9E5E' },
      ]
    : []

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/30 p-4" onClick={onClose}>
      <div
        className="max-h-[90vh] w-full max-w-[720px] overflow-y-auto rounded-4xl bg-page p-6 shadow-float"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-[20px] font-black text-ink">{t('dashboard.activity.title')}</h2>
          <button
            onClick={onClose}
            className="rounded-full bg-white px-3 py-1.5 text-[14px] font-extrabold text-ink-2 shadow-soft"
          >
            ✕
          </button>
        </div>

        {state === 'loading' && <Spinner />}
        {state === 'error' && (
          <div className="text-[14px] font-semibold text-ink-3">{t('common.error.body')}</div>
        )}
        {state === 'ready' && (
          <div className="flex flex-col gap-4">
            {series.map((sv) => (
              <div key={sv.k} className="rounded-4xl border border-hair bg-white p-5 shadow-card">
                <div className="mb-2 flex items-baseline justify-between">
                  <h3 className="text-[15px] font-extrabold text-ink">{sv.k}</h3>
                  <span className="text-[12px] font-semibold text-ink-3">{sv.d}</span>
                </div>
                <LineChart data={sv.data} height={140} stroke={sv.stroke} />
              </div>
            ))}
            <p className="text-[12px] font-medium text-ink-3">{t('dashboard.activity.note')}</p>
          </div>
        )}
      </div>
    </div>
  )
}
