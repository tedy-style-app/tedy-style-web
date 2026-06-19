import Reveal from './Reveal'
import Phone, { CommunityScreen } from './Phone'
import { useLang } from '../i18n'

export default function Community() {
  const { t } = useLang()
  return (
    <section className="bg-peach-tint py-24" id="community">
      <div className="mx-auto grid w-full max-w-[1140px] items-center gap-14 px-6 lg:grid-cols-2">
        <Reveal className="flex justify-center">
          <Phone nav="community" small>
            <CommunityScreen />
          </Phone>
        </Reveal>

        <Reveal delay={1} className="text-center lg:text-left">
          <span className="mb-4 inline-block text-xs font-extrabold tracking-[2.4px] text-orange-dark">
            {t.community.eyebrow}
          </span>
          <h2 className="text-[clamp(28px,4vw,40px)]">{t.community.title}</h2>
          <p className="mt-[18px] text-[17px] font-medium text-ink-2">{t.community.body}</p>

          <div className="mt-[30px] flex flex-wrap justify-center gap-7 lg:justify-start">
            {t.community.stats.map((s) => (
              <div key={s.label} className="flex flex-col gap-1">
                <strong className="text-2xl text-orange">{s.icon}</strong>
                <span className="text-[13px] font-bold text-ink-2">{s.label}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
