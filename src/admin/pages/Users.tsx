import { useEffect, useState } from 'react'
import { api, resolveUrl, type UserRow, type UserDetail } from '../api'
import { PageHeader, Spinner, ErrorState, EmptyState, Table, Pager, Badge, fmtDate } from '../ui'

const PAGE_SIZE = 20
const planTone = (p: string) =>
  p?.toUpperCase() === 'MAX' ? 'gold' : p?.toUpperCase() === 'PRO' ? 'espresso' : 'neutral'

export default function Users() {
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
      <PageHeader
        title="Пользователи"
        subtitle={`Всего: ${total.toLocaleString('ru-RU')}`}
        action={
          <form onSubmit={onSearch} className="flex items-center gap-2">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск по имени / @username"
              className="w-[240px] rounded-full border border-line bg-white px-4 py-2 text-[14px] font-semibold text-ink outline-none focus:border-gold-soft"
            />
            <button className="rounded-full bg-grad-espresso px-4 py-2 text-[13px] font-extrabold text-onEspresso shadow-glow-soft">
              Найти
            </button>
          </form>
        }
      />

      {state === 'loading' && <Spinner />}
      {state === 'error' && <ErrorState onRetry={load} />}
      {state === 'ready' &&
        (rows.length === 0 ? (
          <EmptyState icon="👤" title="Пользователи не найдены" />
        ) : (
          <>
            <Table<UserRow>
              keyOf={(r) => r.id}
              onRow={(r) => setSelected(r.id)}
              columns={[
                {
                  key: 'name',
                  header: 'Пользователь',
                  cell: (r) => (
                    <div>
                      <div className="font-bold text-ink">{r.fullName || '—'}</div>
                      <div className="text-[12px] font-semibold text-ink-3">@{r.username || '—'}</div>
                    </div>
                  ),
                },
                { key: 'plan', header: 'План', cell: (r) => <Badge tone={planTone(r.plan)}>{r.plan || 'FREE'}</Badge> },
                { key: 'gender', header: 'Пол', cell: (r) => r.gender || '—' },
                { key: 'region', header: 'Регион', cell: (r) => r.region || '—' },
                { key: 'created', header: 'Регистрация', cell: (r) => fmtDate(r.createdAt) },
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

function UserDrawer({ id, onClose }: { id: string; onClose: () => void }) {
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
          <h2 className="text-[20px] font-black text-ink">Профиль</h2>
          <button onClick={onClose} className="rounded-full bg-white px-3 py-1.5 text-[14px] font-extrabold text-ink-2 shadow-soft">
            ✕
          </button>
        </div>

        {state === 'loading' && <Spinner />}
        {state === 'error' && <div className="text-[14px] font-semibold text-ink-3">Не удалось загрузить профиль.</div>}
        {state === 'ready' && data && (
          <>
            <div className="rounded-4xl border border-hair bg-white p-5 shadow-card">
              <div className="text-[18px] font-black text-ink">{data.fullName || '—'}</div>
              <div className="text-[13px] font-semibold text-ink-3">@{data.username || '—'}</div>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <Info label="План" value={data.plan || 'FREE'} />
                <Info label="Пол" value={data.gender} />
                <Info label="Регион" value={data.region} />
                <Info label="Цветотип" value={data.colorSeason} />
                <Info label="Тип фигуры" value={data.bodyShape} />
                <Info label="Рост" value={data.heightCm ? `${data.heightCm} см` : null} />
                <Info label="Год рождения" value={data.birthYear ? String(data.birthYear) : null} />
                <Info label="Регистрация" value={fmtDate(data.createdAt)} />
              </div>
              {data.favoriteColors && <Info label="Любимые цвета" value={data.favoriteColors} full />}
              {data.bio && <Info label="О себе" value={data.bio} full />}
            </div>

            <h3 className="mb-3 mt-6 text-[15px] font-extrabold text-ink">
              Сгенерированные образы · {data.stylesCount}
            </h3>
            {data.styles.length === 0 ? (
              <EmptyState icon="🎨" title="Пока нет образов" />
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
