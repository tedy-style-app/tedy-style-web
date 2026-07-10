import Reveal from './Reveal'
import Phone, { SecondhandScreen } from './Phone'
import { useLang } from '../i18n'

export default function Secondhand() {
  const { t } = useLang()
  return (
    <section className="bg-cream py-24" id="secondhand">
      <div className="mx-auto grid w-full max-w-[1140px] items-center gap-14 px-6 lg:grid-cols-2">
        <Reveal className="flex justify-center">
          <Phone nav="secondhand" small>
            <SecondhandScreen />
          </Phone>
        </Reveal>

        <Reveal delay={1} className="text-center lg:text-left">
          <span className="mb-4 inline-block text-xs font-extrabold tracking-[2.4px] text-gold">
            {t.secondhand.eyebrow}
          </span>
          <h2 className="text-[clamp(28px,4vw,40px)]">{t.secondhand.title}</h2>
          <p className="mt-[18px] text-[17px] font-medium text-ink-2">{t.secondhand.body}</p>

          <div className="mt-[30px] flex flex-col gap-3.5">
            {t.secondhand.points.map((p) => (
              <div key={p.label} className="flex items-center gap-3.5">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white text-xl shadow-soft">
                  {p.icon}
                </span>
                <span className="text-[15px] font-bold text-ink">{p.label}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
