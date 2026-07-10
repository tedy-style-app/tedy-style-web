import type { ReactNode } from 'react'
import {
  CONTACT_EMAIL,
  DELETE_ACCOUNT_URL,
  PRIVACY_URL,
} from '../constants'
import { useLang } from '../i18n'

const PRODUCT_HREFS = ['#features', '#how', '#pricing', '#download']

export default function Footer() {
  const { t } = useLang()
  return (
    <footer className="border-t border-hair bg-cream pb-8 pt-16">
      <div className="mx-auto grid w-full max-w-[1140px] gap-8 px-6 grid-cols-2 md:grid-cols-[2fr_1fr_1fr_1fr]">
        <div className="col-span-2 md:col-span-1">
          <a href="#top" className="mb-3.5 inline-flex items-center gap-2.5">
            <img src="/logo.svg" alt="Tedy" className="h-[38px] w-[38px] rounded-[11px] shadow-soft" />
            <span className="text-[21px] font-black -tracking-[0.02em] text-espresso">
              Tedy
            </span>
          </a>
          <p className="max-w-[240px] text-[15px] font-semibold text-ink-2">{t.footer.tag}</p>
        </div>

        <FooterCol title={t.footer.productH}>
          {t.footer.product.map((label, i) => (
            <FooterLink key={label} href={PRODUCT_HREFS[i]}>
              {label}
            </FooterLink>
          ))}
        </FooterCol>

        <FooterCol title={t.footer.legalH}>
          <FooterLink href={PRIVACY_URL} external>
            {t.footer.privacy}
          </FooterLink>
          <FooterLink href={DELETE_ACCOUNT_URL} external>
            {t.footer.delete}
          </FooterLink>
        </FooterCol>

        <FooterCol title={t.footer.contactH}>
          <FooterLink href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</FooterLink>
        </FooterCol>
      </div>

      <div className="mx-auto mt-12 flex w-full max-w-[1140px] flex-wrap items-center justify-between gap-2.5 border-t border-hair px-6 pt-6 text-[13px] font-semibold text-ink-3">
        <span>{t.footer.rights}</span>
        <span>{t.footer.madeIn}</span>
      </div>
    </footer>
  )
}

function FooterCol({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h4 className="mb-4 text-[13px] font-extrabold uppercase tracking-wide text-ink-3">{title}</h4>
      {children}
    </div>
  )
}

function FooterLink({
  href,
  children,
  external = false,
}: {
  href: string
  children: ReactNode
  external?: boolean
}) {
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener' } : {})}
      className="mb-[11px] block text-[15px] font-semibold text-ink-2 transition-colors hover:text-espresso"
    >
      {children}
    </a>
  )
}
