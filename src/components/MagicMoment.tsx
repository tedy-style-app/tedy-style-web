import type { ReactNode } from 'react'
import Reveal from './Reveal'
import { useLang } from '../i18n'

export default function MagicMoment() {
  const { t } = useLang()
  return (
    <section className="py-24" id="magic">
      <div className="mx-auto grid w-full max-w-[1140px] items-center gap-14 px-6 lg:grid-cols-2">
        <Reveal className="text-center lg:text-left">
          <span className="mb-4 inline-block text-xs font-extrabold tracking-[2.4px] text-orange-dark">
            {t.magic.eyebrow}
          </span>
          <h2 className="text-[clamp(28px,4vw,40px)]">{t.magic.title}</h2>
          <p className="mt-[18px] text-[17px] font-medium text-ink-2">{t.magic.body}</p>

          <ul className="mx-auto mt-[26px] inline-grid gap-[13px] text-left lg:mx-0">
            {t.magic.checks.map((c) => (
              <li key={c} className="relative pl-[34px] text-base font-bold text-ink">
                <span className="absolute left-0 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full bg-grad-primary text-[13px] font-black text-white shadow-glow-soft">
                  ✓
                </span>
                {c}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={1} className="relative flex justify-center">
          <div className="pointer-events-none absolute -inset-[10%] bg-grad-peach" />
          <div className="relative w-[360px] max-w-full rounded-5xl border border-hair bg-white p-[22px] shadow-float">
            <div className="mb-4 flex justify-end">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-orange/[0.12] px-3.5 py-[7px] text-[13px] font-extrabold text-orange-dark">
                <span className="h-[7px] w-[7px] animate-pulse rounded-full bg-orange" />
                Tedy yig'di
              </span>
            </div>

            <div className="grid grid-cols-3 grid-rows-2 gap-3">
              <Item className="row-span-2 text-[44px]">🧥</Item>
              <Item className="aspect-square">👕</Item>
              <Item className="aspect-square">👟</Item>
              <Item className="aspect-square">👖</Item>
              <Item className="aspect-square">🧣</Item>
            </div>

            <div className="mt-[18px] flex items-baseline justify-between">
              <div className="text-lg font-black">Kuzgi sayr uchun</div>
              <div className="text-xs font-extrabold text-orange-dark">AI ishonchi · 94%</div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function Item({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`grid place-items-center rounded-2xl border border-hair bg-grad-tile text-[40px] ${className}`}
    >
      {children}
    </div>
  )
}
