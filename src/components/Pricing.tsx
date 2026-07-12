import Reveal from './Reveal'
import SectionHead from './SectionHead'
import { APP_STORE_URL } from '../constants'
import { useLang } from '../i18n'
import type { Plan } from '../i18n'

export default function Pricing() {
  const { t } = useLang()
  return (
    <section className="bg-page py-24" id="pricing">
      <div className="mx-auto w-full max-w-[1140px] px-6">
        <SectionHead eyebrow={t.pricing.eyebrow} title={t.pricing.title} lead={t.pricing.lead} />

        <div className="mx-auto grid max-w-[980px] items-stretch gap-[22px] md:grid-cols-3">
          {t.pricing.plans.map((plan, i) => (
            <Reveal key={plan.name} delay={(i % 3) as 0 | 1 | 2}>
              <PlanCard plan={plan} cta={t.pricing.cta} />
            </Reveal>
          ))}
        </div>

        <p className="mt-8 text-center text-[13px] font-semibold text-ink-3">{t.pricing.note}</p>
      </div>
    </section>
  )
}

function PlanCard({ plan, cta }: { plan: Plan; cta: string }) {
  const hi = plan.highlight
  return (
    <div
      className={`flex h-full flex-col rounded-5xl border p-7 transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 ${
        hi
          ? 'border-transparent bg-grad-espresso shadow-float'
          : 'border-hair bg-white shadow-card hover:shadow-float'
      }`}
    >
      <div className="flex items-center gap-2.5">
        <h3 className={`text-2xl ${hi ? 'text-onEspresso' : 'text-ink'}`}>{plan.name}</h3>
        {plan.badge && (
          <span className="rounded-full bg-grad-gold px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wide text-espresso-dark">
            {plan.badge}
          </span>
        )}
      </div>
      <p className={`mt-1.5 text-[14px] font-semibold ${hi ? 'text-onEspresso/70' : 'text-ink-2'}`}>
        {plan.tagline}
      </p>

      <div className="mt-5 flex items-baseline gap-1.5">
        <span className={`text-[30px] font-black leading-none ${hi ? 'text-onEspresso' : 'text-ink'}`}>
          {plan.price}
        </span>
        {plan.priceUnit && (
          <span className={`text-[13px] font-semibold ${hi ? 'text-onEspresso/55' : 'text-ink-3'}`}>
            {plan.priceUnit}
          </span>
        )}
      </div>
      {plan.priceNote && (
        <p className={`mt-1.5 text-[12px] font-semibold ${hi ? 'text-gold-soft' : 'text-ink-3'}`}>
          {plan.priceNote}
        </p>
      )}

      <ul className="mt-6 flex flex-1 flex-col gap-3">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2.5">
            <span
              className={`mt-px grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full text-[11px] font-black ${
                hi ? 'bg-gold text-espresso-dark' : 'bg-espresso text-onEspresso'
              }`}
            >
              ✓
            </span>
            <span className={`text-[14px] font-medium ${hi ? 'text-onEspresso/90' : 'text-ink-2'}`}>
              {f}
            </span>
          </li>
        ))}
      </ul>

      <a
        href={APP_STORE_URL}
        target="_blank"
        rel="noopener"
        className={`mt-7 inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-extrabold transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-0.5 ${
          hi
            ? 'bg-white text-espresso shadow-glow-soft'
            : 'bg-grad-espresso text-onEspresso shadow-glow'
        }`}
      >
        {cta}
      </a>
    </div>
  )
}
