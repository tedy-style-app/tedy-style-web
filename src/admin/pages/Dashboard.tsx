import { useEffect, useState } from 'react'
import { api, type Stats } from '../api'
import { Card, StatCard, PageHeader, Spinner, ErrorState, fmtMoney } from '../ui'
import { LineChart, Donut, BarList } from '../charts'
import { useAdminT } from '../i18n'

export default function Dashboard() {
  const t = useAdminT()
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

  if (state === 'loading') return <Spinner label={t('dashboard.loading')} />
  if (state === 'error' || !data) return <ErrorState onRetry={load} />

  const s = data
  // Defensive defaults — the admin must never white-screen if the deployed
  // backend is a step behind the frontend and omits a newer stats field.
  const activity = s.activity ?? { dau: 0, wau: 0, mau: 0 }
  const retention = s.retention ?? { daily: 0, weekly: 0, monthly: 0 }
  const age = s.age ?? []
  const transactions = s.transactions ?? []
  const buttonClicks = s.buttonClicks ?? []
  return (
    <div>
      <PageHeader title={t('dashboard.title')} subtitle={t('dashboard.subtitle')} />

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label={t('dashboard.stat.users')}
          value={s.users.total.toLocaleString('ru-RU')}
          delta={t('dashboard.new30dDelta', { n: s.users.new30d })}
          spark={s.users.growth}
        />
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
        <StatCard
          label={t('dashboard.stat.free')}
          value={s.plans.free.toLocaleString('ru-RU')}
        />
      </div>

      {/* Active users */}
      <div className="mt-4 grid grid-cols-3 gap-4">
        <StatCard label="DAU" value={activity.dau.toLocaleString('ru-RU')} delta={t('dashboard.dau.desc')} />
        <StatCard label="WAU" value={activity.wau.toLocaleString('ru-RU')} delta={t('dashboard.wau.desc')} />
        <StatCard label="MAU" value={activity.mau.toLocaleString('ru-RU')} delta={t('dashboard.mau.desc')} />
      </div>

      {/* Growth charts */}
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card title={t('dashboard.chart.userGrowth')}>
          <LineChart data={s.users.growth} />
        </Card>
        <Card title={t('dashboard.chart.transactions')}>
          <LineChart data={s.revenue.growth} stroke="#5B9E5E" fill="rgba(91,158,94,0.14)" />
        </Card>
      </div>

      {/* Plans + personalization */}
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
        <Card title={t('dashboard.chart.gender')}>
          <BarList data={s.personalization.gender} color="#3E322A" />
        </Card>
        <Card title={t('dashboard.chart.colorType')}>
          <BarList data={s.personalization.colorType} color="#CB9A5C" />
        </Card>
        <Card title={t('dashboard.chart.region')}>
          <BarList data={s.personalization.region} color="#8C6E52" />
        </Card>
        <Card title={t('dashboard.chart.age')}>
          <BarList data={age} color="#5B9E5E" />
        </Card>
        <Card title={t('dashboard.chart.retention')}>
          <div className="flex justify-between gap-3 py-3">
            {[
              { k: t('dashboard.retention.day'), v: retention.daily },
              { k: t('dashboard.retention.week'), v: retention.weekly },
              { k: t('dashboard.retention.month'), v: retention.monthly },
            ].map((r) => (
              <div key={r.k} className="flex-1 text-center">
                <div className="text-2xl font-bold text-[#3E322A]">{r.v}%</div>
                <div className="mt-1 text-xs text-neutral-500">{r.k}</div>
              </div>
            ))}
          </div>
        </Card>
        <Card title={t('dashboard.chart.txnByStatus')} className="lg:col-span-2">
          <div className="space-y-2">
            {transactions.length === 0 && (
              <div className="py-2 text-sm text-neutral-400">{t('dashboard.noTransactions')}</div>
            )}
            {transactions.map((t) => (
              <div key={t.status} className="flex items-center justify-between text-sm">
                <span className="capitalize text-neutral-700">{t.status}</span>
                <span className="text-neutral-500">
                  {t.count} · {fmtMoney(t.amount, s.revenue.currency)}
                </span>
              </div>
            ))}
          </div>
        </Card>
        <Card title={t('dashboard.chart.styles')} className="lg:col-span-2">
          <BarList data={s.personalization.style} color="#3E322A" />
        </Card>
        <Card title={t('dashboard.chart.buttonClicks')} className="lg:col-span-2">
          {buttonClicks.length === 0 ? (
            <div className="py-2 text-sm text-neutral-400">{t('dashboard.noEvents')}</div>
          ) : (
            <BarList data={buttonClicks} color="#CB9A5C" />
          )}
        </Card>
      </div>
    </div>
  )
}
