import Reveal from './Reveal'
import { useLang } from '../i18n'

export default function MagicMoment() {
  const { t } = useLang()
  return (
    <section className="py-24" id="ai">
      <div className="mx-auto grid w-full max-w-[1140px] items-center gap-14 px-6 lg:grid-cols-2">
        <Reveal className="text-center lg:text-left">
          <span className="mb-4 inline-block text-xs font-extrabold tracking-[2.4px] text-gold">
            {t.ai.eyebrow}
          </span>
          <h2 className="text-[clamp(28px,4vw,40px)]">{t.ai.title}</h2>
          <p className="mt-[18px] text-[17px] font-medium text-ink-2">{t.ai.body}</p>

          <ul className="mx-auto mt-[26px] inline-grid gap-[13px] text-left lg:mx-0">
            {t.ai.checks.map((c) => (
              <li key={c} className="relative pl-[34px] text-base font-bold text-ink">
                <span className="absolute left-0 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full bg-grad-espresso text-[13px] font-black text-onEspresso shadow-glow-soft">
                  ✓
                </span>
                {c}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={1} className="relative flex justify-center">
          <div className="pointer-events-none absolute -inset-[10%] bg-grad-beige" />
          <div className="relative w-[380px] max-w-full rounded-5xl border border-hair bg-white p-[22px] shadow-float">
            {/* Chat header */}
            <div className="mb-4 flex items-center gap-3 border-b border-hair pb-4">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-espresso text-lg text-onEspresso">
                ✦
              </span>
              <div className="leading-tight">
                <div className="text-[15px] font-black text-ink">Tedy</div>
                <div className="text-[12px] font-bold text-online">● online</div>
              </div>
            </div>

            {/* User bubble */}
            <div className="mb-3 flex justify-end">
              <div className="max-w-[80%] rounded-[20px] rounded-tr-md bg-espresso px-4 py-2.5 text-[14px] font-semibold text-onEspresso">
                {t.ai.chatUser}
              </div>
            </div>

            {/* Tedy reply */}
            <div className="flex justify-start">
              <div className="max-w-[86%] rounded-[20px] rounded-tl-md bg-beige-soft px-4 py-3 text-[14px] font-medium leading-relaxed text-ink">
                {t.ai.chatReply}
              </div>
            </div>

            <div className="mt-4 flex items-center gap-1.5 pl-1">
              <span className="h-[7px] w-[7px] animate-pulse rounded-full bg-gold" />
              <span className="text-[12px] font-bold text-ink-3">{t.ai.chatBadge}</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
