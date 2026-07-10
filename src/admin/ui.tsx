import type { ReactNode } from 'react'
import { Sparkline } from './charts'
import type { Point } from './api'

export function Card({
  children,
  className = '',
  title,
  action,
}: {
  children: ReactNode
  className?: string
  title?: string
  action?: ReactNode
}) {
  return (
    <div className={`rounded-4xl border border-hair bg-white p-5 shadow-card ${className}`}>
      {(title || action) && (
        <div className="mb-4 flex items-center justify-between">
          {title && <h3 className="text-[15px] font-extrabold text-ink">{title}</h3>}
          {action}
        </div>
      )}
      {children}
    </div>
  )
}

export function StatCard({
  label,
  value,
  delta,
  spark,
}: {
  label: string
  value: string
  delta?: string
  spark?: Point[]
}) {
  return (
    <div className="rounded-4xl border border-hair bg-white p-5 shadow-card">
      <div className="text-[12px] font-bold uppercase tracking-wide text-ink-3">{label}</div>
      <div className="mt-1.5 flex items-end justify-between gap-2">
        <div className="text-[28px] font-black leading-none tracking-tight text-ink">{value}</div>
        {delta && (
          <span className="rounded-full bg-online/[0.14] px-2 py-0.5 text-[12px] font-extrabold text-online">
            {delta}
          </span>
        )}
      </div>
      {spark && spark.length > 1 && (
        <div className="mt-3">
          <Sparkline data={spark} />
        </div>
      )}
    </div>
  )
}

const BADGE_TONES: Record<string, string> = {
  green: 'bg-online/[0.14] text-online',
  gold: 'bg-gold/[0.18] text-espresso',
  espresso: 'bg-espresso text-onEspresso',
  red: 'bg-like/[0.14] text-like',
  neutral: 'bg-beige-soft text-ink-2',
}

export function Badge({ children, tone = 'neutral' }: { children: ReactNode; tone?: keyof typeof BADGE_TONES }) {
  return (
    <span className={`inline-block rounded-full px-2.5 py-1 text-[12px] font-extrabold ${BADGE_TONES[tone]}`}>
      {children}
    </span>
  )
}

export function Spinner({ label }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-16 text-ink-3">
      <span
        className="h-6 w-6 animate-spin rounded-full border-[3px] border-hair border-t-gold"
        aria-hidden="true"
      />
      {label && <span className="text-[14px] font-semibold">{label}</span>}
    </div>
  )
}

export function EmptyState({ icon = '📭', title, hint }: { icon?: string; title: string; hint?: string }) {
  return (
    <div className="flex flex-col items-center gap-2 py-16 text-center">
      <div className="text-4xl">{icon}</div>
      <div className="text-[16px] font-extrabold text-ink">{title}</div>
      {hint && <div className="max-w-[320px] text-[13px] font-medium text-ink-3">{hint}</div>}
    </div>
  )
}

export function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 py-16 text-center">
      <div className="text-4xl">⚠️</div>
      <div className="text-[16px] font-extrabold text-ink">Не удалось загрузить</div>
      <div className="max-w-[360px] text-[13px] font-medium text-ink-3">
        Проверьте, что бэкенд admin API запущен и вы авторизованы.
      </div>
      <button
        onClick={onRetry}
        className="mt-1 rounded-full bg-grad-espresso px-5 py-2 text-[13px] font-extrabold text-onEspresso shadow-glow"
      >
        Повторить
      </button>
    </div>
  )
}

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-[26px] font-black tracking-tight text-ink">{title}</h1>
        {subtitle && <p className="mt-0.5 text-[14px] font-medium text-ink-2">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

/** Minimal responsive table. Columns render header + a cell renderer. */
export function Table<T>({
  columns,
  rows,
  onRow,
  keyOf,
}: {
  columns: { key: string; header: string; cell: (row: T) => ReactNode; className?: string }[]
  rows: T[]
  onRow?: (row: T) => void
  keyOf: (row: T) => string
}) {
  return (
    <div className="overflow-x-auto rounded-4xl border border-hair bg-white shadow-card">
      <table className="w-full min-w-[640px] border-collapse text-left">
        <thead>
          <tr className="border-b border-hair">
            {columns.map((c) => (
              <th
                key={c.key}
                className={`px-4 py-3 text-[12px] font-extrabold uppercase tracking-wide text-ink-3 ${c.className ?? ''}`}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={keyOf(row)}
              onClick={onRow ? () => onRow(row) : undefined}
              className={`border-b border-hair last:border-0 ${
                onRow ? 'cursor-pointer transition-colors hover:bg-cream' : ''
              }`}
            >
              {columns.map((c) => (
                <td key={c.key} className={`px-4 py-3.5 text-[14px] text-ink ${c.className ?? ''}`}>
                  {c.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function Pager({
  page,
  total,
  pageSize,
  onPage,
}: {
  page: number
  total: number
  pageSize: number
  onPage: (p: number) => void
}) {
  const pages = Math.max(1, Math.ceil(total / pageSize))
  if (pages <= 1) return null
  return (
    <div className="mt-4 flex items-center justify-center gap-3 text-[13px] font-bold text-ink-2">
      <button
        disabled={page <= 1}
        onClick={() => onPage(page - 1)}
        className="rounded-full border border-line bg-white px-4 py-1.5 disabled:opacity-40"
      >
        ‹
      </button>
      <span>
        {page} / {pages}
      </span>
      <button
        disabled={page >= pages}
        onClick={() => onPage(page + 1)}
        className="rounded-full border border-line bg-white px-4 py-1.5 disabled:opacity-40"
      >
        ›
      </button>
    </div>
  )
}

/** ISO date -> short local string. */
export const fmtDate = (iso: string) => {
  try {
    return new Date(iso).toLocaleDateString('ru-RU', { day: '2-digit', month: 'short', year: 'numeric' })
  } catch {
    return iso
  }
}
export const fmtMoney = (n: number, currency = 'UZS') =>
  `${n.toLocaleString('ru-RU')} ${currency}`
