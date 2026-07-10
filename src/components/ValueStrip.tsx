import { useLang } from '../i18n'

const EMOJIS = ['✦', '☀️', '🌐', '🎁']

export default function ValueStrip() {
  const { t } = useLang()
  return (
    <section className="border-y border-hair bg-cream">
      <div className="mx-auto flex w-full max-w-[1140px] flex-wrap justify-around gap-x-6 gap-y-3.5 px-6 py-[26px]">
        {t.strip.map((label, i) => (
          <div key={i} className="inline-flex items-center gap-2.5 text-[15px] font-extrabold text-ink">
            <span className="text-xl">{EMOJIS[i]}</span>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
