import Reveal from './Reveal'

export default function SectionHead({
  eyebrow,
  title,
  lead,
}: {
  eyebrow: string
  title: string
  lead?: string
}) {
  return (
    <Reveal className="mx-auto mb-14 max-w-[640px] text-center">
      <span className="mb-4 inline-block text-xs font-extrabold tracking-[2.4px] text-gold">
        {eyebrow}
      </span>
      <h2 className="text-[clamp(28px,4vw,40px)]">{title}</h2>
      {lead && <p className="mt-4 text-[17px] font-medium text-ink-2">{lead}</p>}
    </Reveal>
  )
}
