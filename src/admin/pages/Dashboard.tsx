import { useEffect, useState } from 'react'
import { api, type Stats } from '../api'
import { Card, StatCard, PageHeader, Spinner, ErrorState, fmtMoney } from '../ui'
import { LineChart, Donut, BarList } from '../charts'

export default function Dashboard() {
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

  if (state === 'loading') return <Spinner label="Загрузка статистики…" />
  if (state === 'error' || !data) return <ErrorState onRetry={load} />

  const s = data
  return (
    <div>
      <PageHeader title="Дашборд" subtitle="Обзор роста, транзакций и аудитории" />

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Пользователи"
          value={s.users.total.toLocaleString('ru-RU')}
          delta={`+${s.users.new30d} / 30д`}
          spark={s.users.growth}
        />
        <StatCard
          label="Доход"
          value={fmtMoney(s.revenue.total, s.revenue.currency)}
          delta={`${s.revenue.count} транз.`}
          spark={s.revenue.growth}
        />
        <StatCard
          label="Платные подписки"
          value={(s.plans.pro + s.plans.max).toLocaleString('ru-RU')}
          delta={`PRO ${s.plans.pro} · MAX ${s.plans.max}`}
        />
        <StatCard
          label="Free"
          value={s.plans.free.toLocaleString('ru-RU')}
        />
      </div>

      {/* Growth charts */}
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card title="Рост пользователей">
          <LineChart data={s.users.growth} />
        </Card>
        <Card title="Транзакции">
          <LineChart data={s.revenue.growth} stroke="#5B9E5E" fill="rgba(91,158,94,0.14)" />
        </Card>
      </div>

      {/* Plans + personalization */}
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card title="Подписки">
          <Donut
            segments={[
              { label: 'Free', value: s.plans.free, color: '#CBB597' },
              { label: 'PRO', value: s.plans.pro, color: '#3E322A' },
              { label: 'MAX', value: s.plans.max, color: '#CB9A5C' },
            ]}
          />
        </Card>
        <Card title="Пол аудитории">
          <BarList data={s.personalization.gender} color="#3E322A" />
        </Card>
        <Card title="Цветотип">
          <BarList data={s.personalization.colorType} color="#CB9A5C" />
        </Card>
        <Card title="Регионы">
          <BarList data={s.personalization.region} color="#8C6E52" />
        </Card>
        <Card title="Стили" className="lg:col-span-2">
          <BarList data={s.personalization.style} color="#3E322A" />
        </Card>
      </div>
    </div>
  )
}
