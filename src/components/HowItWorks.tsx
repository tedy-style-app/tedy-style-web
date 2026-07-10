import { Fragment } from 'react'
import Reveal from './Reveal'
import SectionHead from './SectionHead'
import { useLang } from '../i18n'

export default function HowItWorks() {
  const { t } = useLang()
  return (
    <section className="bg-cream py-24" id="how">
      <div className="mx-auto w-full max-w-[1140px] px-6">
        <SectionHead eyebrow={t.how.eyebrow} title={t.how.title} />

        <div className="mx-auto grid max-w-[980px] items-start gap-x-2 gap-y-8 lg:grid-cols-[1fr_auto_1fr_auto_1fr]">
          {t.how.steps.map((step, i) => (
            <Fragment key={step.title}>
              <Reveal delay={(i % 3) as 0 | 1 | 2} className="px-3.5 text-center">
                <div className="mx-auto mb-[22px] grid h-[60px] w-[60px] place-items-center rounded-full bg-grad-espresso text-2xl font-black text-white shadow-glow">
                  {i + 1}
                </div>
                <h3 className="mb-2.5 text-[19px]">{step.title}</h3>
                <p className="text-[15px] font-medium text-ink-2">{step.body}</p>
              </Reveal>

              {i < t.how.steps.length - 1 && (
                <div
                  aria-hidden="true"
                  className="mt-[29px] hidden h-0.5 min-w-[40px] rounded opacity-60 lg:block"
                  style={{
                    background:
                      'repeating-linear-gradient(90deg,#CB9A5C 0 7px,transparent 7px 14px)',
                  }}
                />
              )}
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  )
}
