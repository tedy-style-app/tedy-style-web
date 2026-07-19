import { useEffect, useState } from 'react'
import { api, type Stats } from '../api'
import { Card, PageHeader, Spinner, ErrorState, EmptyState } from '../ui'
import { BarList } from '../charts'
import { useAdminT } from '../i18n'

/** "Click buttons" — how often each tracked in-app button is tapped. */
export default function Clicks() {
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

  if (state === 'loading') return <Spinner />
  if (state === 'error' || !data) return <ErrorState onRetry={load} />

  const clicks = data.buttonClicks ?? []

  return (
    <div>
      <PageHeader title={t('clicks.title')} subtitle={t('clicks.subtitle')} />
      <Card title={t('dashboard.chart.buttonClicks')}>
        {clicks.length === 0 ? (
          <EmptyState icon="🖱" title={t('dashboard.noEvents')} />
        ) : (
          <BarList data={clicks} color="#CB9A5C" />
        )}
      </Card>
    </div>
  )
}
