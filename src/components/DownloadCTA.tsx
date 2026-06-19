import Reveal from './Reveal'
import StoreBadges from './StoreBadges'
import { useLang } from '../i18n'

export default function DownloadCTA() {
  const { t } = useLang()
  return (
    <section className="py-24" id="download">
      <div className="mx-auto w-full max-w-[1140px] px-6">
        <Reveal className="relative mx-auto max-w-[860px] overflow-hidden rounded-5xl border border-hair bg-[linear-gradient(160deg,#FFF4EC,#FFF8F3)] px-8 py-16 text-center shadow-card">
          <div className="pointer-events-none absolute inset-x-[-10%] bottom-[-60%] h-80 bg-grad-peach" />
          <img
            src="/logo.svg"
            alt=""
            aria-hidden="true"
            className="relative z-10 mx-auto mb-[22px] h-16 w-16 rounded-2xl shadow-soft"
          />
          <h2 className="relative z-10 text-[clamp(28px,4vw,40px)]">{t.cta.title}</h2>
          <p className="relative z-10 mx-auto mt-4 max-w-[460px] text-[17px] font-medium text-ink-2">
            {t.cta.body}
          </p>
          <div className="relative z-10 mt-8 flex justify-center">
            <StoreBadges center />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
