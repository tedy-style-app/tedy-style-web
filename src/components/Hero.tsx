import Reveal from './Reveal'
import StoreBadges from './StoreBadges'
import Phone, { HomeScreen } from './Phone'
import { useLang } from '../i18n'

export default function Hero() {
  const { t } = useLang()

  return (
    <section className="relative overflow-hidden pb-[88px] pt-[72px]" id="top">
      {/* warm beige / gold washes */}
      <div
        className="pointer-events-none absolute inset-x-0 -top-[20%] -z-20 h-[720px]"
        style={{
          background:
            'radial-gradient(900px 520px at 78% 8%, rgba(203,154,92,0.16), rgba(203,154,92,0) 60%), radial-gradient(700px 480px at 10% 30%, rgba(251,248,241,0.95), rgba(251,248,241,0) 60%)',
        }}
      />
      <span className="pointer-events-none absolute right-[4%] top-[8%] -z-10 h-[220px] w-[220px] rounded-full opacity-60 blur-lg [background:radial-gradient(circle_at_30%_30%,#EFE7D8,rgba(203,154,92,.1))]" />
      <span className="pointer-events-none absolute -left-10 bottom-[6%] -z-10 h-40 w-40 rounded-full opacity-50 blur-lg [background:radial-gradient(circle_at_30%_30%,rgba(203,154,92,.35),rgba(203,154,92,0))]" />

      <div className="mx-auto grid w-full max-w-[1140px] items-center gap-12 px-6 lg:grid-cols-[1.05fr_0.95fr]">
        <Reveal className="flex flex-col items-center text-center lg:items-start lg:text-left [&>*]:max-w-full">
          <span className="mb-4 inline-block text-xs font-extrabold tracking-[2.4px] text-gold">
            {t.hero.eyebrow}
          </span>
          <h1 className="text-[clamp(34px,5.2vw,56px)] leading-[1.08] -tracking-[0.02em]">
            {t.hero.title}
          </h1>
          <p className="mt-[22px] max-w-[520px] text-[clamp(16px,1.6vw,19px)] font-medium text-ink-2">
            {t.hero.sub}
          </p>

          <div className="mt-8 flex justify-center lg:justify-start">
            <StoreBadges />
          </div>

          <p className="mt-5 text-sm font-semibold text-ink-3">{t.hero.trust}</p>
        </Reveal>

        <Reveal delay={1} className="flex justify-center">
          <Phone nav="home">
            <HomeScreen />
          </Phone>
        </Reveal>
      </div>
    </section>
  )
}
