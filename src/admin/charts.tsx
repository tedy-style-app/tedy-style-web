import { useState } from 'react'
import type { Point, Slice } from './api'
import { useAdminT } from './i18n'

/** ISO (YYYY-MM-DD…) date -> compact tooltip label; passes non-dates through. */
function tooltipDate(d: string): string {
  if (/^\d{4}-\d{2}-\d{2}/.test(d)) {
    const parsed = new Date(d)
    if (!Number.isNaN(parsed.getTime()))
      return parsed.toLocaleDateString('ru-RU', { day: '2-digit', month: 'short' })
  }
  return d
}

/** Smooth-ish area + line chart drawn as inline SVG (no chart library).
 *  Hover anywhere over the chart to see a floating label with the nearest
 *  point's date + value and a marker dot on that point. Because the SVG is
 *  stretched (`preserveAspectRatio="none"`), the mouse is tracked on a
 *  `relative` HTML overlay and the nearest index is derived from the cursor's
 *  horizontal fraction of the wrapper width. */
export function LineChart({
  data,
  height = 160,
  stroke = '#3E322A',
  fill = 'rgba(203,154,92,0.16)',
  formatValue,
}: {
  data: Point[]
  height?: number
  stroke?: string
  fill?: string
  formatValue?: (n: number) => string
}) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)
  if (data.length === 0) return <ChartEmpty height={height} />
  const W = 600
  const H = height
  const pad = 8
  const max = Math.max(...data.map((d) => d.value), 1)
  const min = Math.min(...data.map((d) => d.value), 0)
  const range = max - min || 1
  const stepX = (W - pad * 2) / Math.max(data.length - 1, 1)
  const x = (i: number) => pad + i * stepX
  const y = (v: number) => H - pad - ((v - min) / range) * (H - pad * 2)

  const line = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${y(d.value)}`).join(' ')
  const area = `${line} L ${x(data.length - 1)} ${H - pad} L ${x(0)} ${H - pad} Z`

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const frac = Math.min(Math.max(e.nativeEvent.offsetX / e.currentTarget.clientWidth, 0), 1)
    setHoverIndex(Math.round(frac * (data.length - 1)))
  }

  const hv = hoverIndex != null ? data[hoverIndex] : null
  const markerLeft = hoverIndex != null ? (x(hoverIndex) / W) * 100 : 0
  const markerTop = hv ? (y(hv.value) / H) * 100 : 0
  // Flip the tooltip below the point when it sits near the top edge.
  const flip = markerTop < 26

  return (
    <div className="relative" onMouseMove={onMove} onMouseLeave={() => setHoverIndex(null)}>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" preserveAspectRatio="none">
        <path d={area} fill={fill} />
        <path d={line} fill="none" stroke={stroke} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
        {data.map((d, i) => (
          <circle key={i} cx={x(i)} cy={y(d.value)} r={i === data.length - 1 ? 4 : 0} fill={stroke} />
        ))}
      </svg>
      {hv && (
        <>
          <span
            className="pointer-events-none absolute z-10 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white"
            style={{ left: `${markerLeft}%`, top: `${markerTop}%`, background: stroke }}
          />
          <div
            className="pointer-events-none absolute z-10 whitespace-nowrap rounded-xl border border-hair bg-white px-2.5 py-1.5 text-center shadow-card"
            style={{
              left: `${Math.min(Math.max(markerLeft, 14), 86)}%`,
              top: `${markerTop}%`,
              transform: flip ? 'translate(-50%, 12px)' : 'translate(-50%, calc(-100% - 12px))',
            }}
          >
            <div className="text-[11px] font-bold text-ink-3">{tooltipDate(hv.date)}</div>
            <div className="text-[13px] font-extrabold text-ink">
              {formatValue ? formatValue(hv.value) : hv.value.toLocaleString('ru-RU')}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// ---- Date range -----------------------------------------------------------

export interface DateRangeValue {
  from: string
  to: string
}

const toISODate = (d: Date) => d.toISOString().slice(0, 10)

/** ISO {from,to} for the last `n` days ending today (to=today, from=today-(n-1)). */
export function rangeForDays(n: number): DateRangeValue {
  const to = new Date()
  const from = new Date()
  from.setDate(from.getDate() - (n - 1))
  return { from: toISODate(from), to: toISODate(to) }
}

/** Controlled preset-chip date-range selector, styled like the active-pill tabs. */
export function DateRange({
  days,
  onChange,
  presets = [7, 30, 90],
}: {
  days: number
  onChange: (days: number, range: DateRangeValue) => void
  presets?: number[]
}) {
  const t = useAdminT()
  return (
    <div className="inline-flex gap-1 rounded-full border border-line bg-white p-1">
      {presets.map((n) => (
        <button
          key={n}
          onClick={() => onChange(n, rangeForDays(n))}
          className={`rounded-full px-3 py-1 text-[12px] font-extrabold transition-colors ${
            days === n ? 'bg-espresso text-onEspresso' : 'text-ink-2 hover:text-ink'
          }`}
        >
          {t('daterange.days', { n })}
        </button>
      ))}
    </div>
  )
}

/** Compact sparkline for stat cards. */
export function Sparkline({ data, stroke = '#CB9A5C' }: { data: Point[]; stroke?: string }) {
  if (data.length < 2) return null
  const W = 120
  const H = 36
  const max = Math.max(...data.map((d) => d.value), 1)
  const min = Math.min(...data.map((d) => d.value), 0)
  const range = max - min || 1
  const step = W / (data.length - 1)
  const line = data
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${i * step} ${H - ((d.value - min) / range) * H}`)
    .join(' ')
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-9 w-full" preserveAspectRatio="none">
      <path d={line} fill="none" stroke={stroke} strokeWidth={2} strokeLinecap="round" />
    </svg>
  )
}

/** Horizontal bar list for categorical distributions. */
export function BarList({ data, color = '#3E322A' }: { data: Slice[]; color?: string }) {
  if (data.length === 0) return <ChartEmpty height={120} />
  const max = Math.max(...data.map((d) => d.count), 1)
  return (
    <div className="flex flex-col gap-3">
      {data.map((d) => (
        <div key={d.label} className="flex items-center gap-3">
          <span className="w-28 shrink-0 truncate text-[13px] font-semibold text-ink-2" title={d.label}>
            {d.label}
          </span>
          <div className="h-3 flex-1 overflow-hidden rounded-full bg-beige-soft">
            <div
              className="h-full rounded-full"
              style={{ width: `${(d.count / max) * 100}%`, background: color }}
            />
          </div>
          <span className="w-10 shrink-0 text-right text-[13px] font-extrabold text-ink">{d.count}</span>
        </div>
      ))}
    </div>
  )
}

/** Donut chart for a small set of segments. */
export function Donut({
  segments,
}: {
  segments: { label: string; value: number; color: string }[]
}) {
  const total = segments.reduce((s, x) => s + x.value, 0)
  const R = 60
  const C = 2 * Math.PI * R
  let offset = 0
  return (
    <div className="flex items-center gap-6">
      <svg viewBox="0 0 160 160" className="h-36 w-36 shrink-0 -rotate-90">
        <circle cx={80} cy={80} r={R} fill="none" stroke="#F0EADF" strokeWidth={20} />
        {total > 0 &&
          segments.map((s, i) => {
            const len = (s.value / total) * C
            const el = (
              <circle
                key={i}
                cx={80}
                cy={80}
                r={R}
                fill="none"
                stroke={s.color}
                strokeWidth={20}
                strokeDasharray={`${len} ${C - len}`}
                strokeDashoffset={-offset}
              />
            )
            offset += len
            return el
          })}
      </svg>
      <div className="flex flex-col gap-2">
        {segments.map((s) => (
          <div key={s.label} className="flex items-center gap-2 text-[13px]">
            <span className="h-3 w-3 rounded-full" style={{ background: s.color }} />
            <span className="font-semibold text-ink-2">{s.label}</span>
            <span className="font-extrabold text-ink">{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ChartEmpty({ height }: { height: number }) {
  const t = useAdminT()
  return (
    <div
      className="flex items-center justify-center rounded-2xl bg-beige-soft text-[13px] font-semibold text-ink-3"
      style={{ height }}
    >
      {t('chart.empty')}
    </div>
  )
}
