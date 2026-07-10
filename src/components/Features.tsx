import Reveal from './Reveal'
import SectionHead from './SectionHead'
import { useLang } from '../i18n'

export default function Features() {
  const { t } = useLang()
  return (
    <section className="py-24" id="features">
      <div className="mx-auto w-full max-w-[1140px] px-6">
        <SectionHead eyebrow={t.features.eyebrow} title={t.features.title} lead={t.features.lead} />

        <div className="grid gap-[22px] sm:grid-cols-2 lg:grid-cols-3">
          {t.features.items.map((f, i) => (
            <Reveal
              key={f.title}
              delay={(i % 3) as 0 | 1 | 2}
              className="group rounded-4xl border border-hair bg-white p-[30px_26px] shadow-card transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1.5 hover:shadow-float"
            >
              <div className="mb-5 grid h-[60px] w-[60px] place-items-center rounded-2xl bg-grad-tile text-3xl text-espresso shadow-[inset_0_0_0_1px_#EEE8DD]">
                {f.icon}
              </div>
              <h3 className="mb-2.5 text-[19px]">{f.title}</h3>
              <p className="text-[15px] font-medium text-ink-2">{f.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
