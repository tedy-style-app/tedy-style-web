import { useEffect, useState } from 'react'
import { api, type Txn } from '../api'
import { PageHeader, Spinner, ErrorState, EmptyState, Table, Pager, Badge, fmtDate, fmtMoney } from '../ui'

const PAGE_SIZE = 20
const statusTone = (s: string) => {
  const v = s?.toLowerCase()
  if (v === 'paid' || v === 'success' || v === 'completed') return 'green'
  if (v === 'failed' || v === 'canceled' || v === 'cancelled') return 'red'
  return 'neutral'
}

export default function Transactions() {
  const [page, setPage] = useState(1)
  const [rows, setRows] = useState<Txn[]>([])
  const [total, setTotal] = useState(0)
  const [state, setState] = useState<'loading' | 'error' | 'ready'>('loading')

  const load = () => {
    setState('loading')
    api
      .transactions(page, PAGE_SIZE)
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
      <PageHeader title="Транзакции" subtitle={`Всего: ${total.toLocaleString('ru-RU')}`} />

      {state === 'loading' && <Spinner />}
      {state === 'error' && <ErrorState onRetry={load} />}
      {state === 'ready' &&
        (rows.length === 0 ? (
          <EmptyState icon="💳" title="Транзакций пока нет" />
        ) : (
          <>
            <Table<Txn>
              keyOf={(r) => r.id}
              columns={[
                { key: 'user', header: 'Пользователь', cell: (r) => <span className="font-bold text-ink">{r.userName || '—'}</span> },
                { key: 'amount', header: 'Сумма', cell: (r) => <span className="font-extrabold text-ink">{fmtMoney(r.amount, r.currency)}</span> },
                { key: 'plan', header: 'План', cell: (r) => <Badge tone="gold">{r.plan || '—'}</Badge> },
                { key: 'provider', header: 'Провайдер', cell: (r) => r.provider || '—' },
                { key: 'status', header: 'Статус', cell: (r) => <Badge tone={statusTone(r.status)}>{r.status || '—'}</Badge> },
                { key: 'date', header: 'Дата', cell: (r) => fmtDate(r.createdAt) },
              ]}
              rows={rows}
            />
            <Pager page={page} total={total} pageSize={PAGE_SIZE} onPage={setPage} />
          </>
        ))}
    </div>
  )
}
