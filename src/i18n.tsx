import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export type Lang = 'uz' | 'en'

export interface Feature {
  icon: string
  title: string
  body: string
}

export interface Step {
  title: string
  body: string
}

export interface Translation {
  nav: { features: string; how: string; community: string; download: string }
  hero: { eyebrow: string; title: string; sub: string; trust: string }
  store: { appStoreSmall: string; appStore: string; playSmall: string; play: string }
  strip: string[]
  features: { eyebrow: string; title: string; lead: string; items: Feature[] }
  how: { eyebrow: string; title: string; steps: Step[] }
  magic: { eyebrow: string; title: string; body: string; checks: string[] }
  community: {
    eyebrow: string
    title: string
    body: string
    stats: { icon: string; label: string }[]
  }
  cta: { title: string; body: string }
  footer: {
    tag: string
    productH: string
    legalH: string
    contactH: string
    product: string[]
    privacy: string
    delete: string
    rights: string
    madeIn: string
  }
}

const uz: Translation = {
  nav: {
    features: 'Imkoniyatlar',
    how: 'Qanday ishlaydi',
    community: 'Jamiyat',
    download: 'Yuklab olish',
  },
  hero: {
    eyebrow: 'AI STILIST',
    title: 'Bugun nima kiyishni Tedy hal qiladi.',
    sub: "Kiyimlaringizni suratga oling — Tedy ob-havo va uslubingizga mos mukammal lookni yig'adi. Har kuni, bir lahzada.",
    trust: 'Bepul · Google yoki Apple bilan kiring',
  },
  store: {
    appStoreSmall: 'Yuklab olish:',
    appStore: 'App Store',
    playSmall: 'Yuklab olish:',
    play: 'Google Play',
  },
  strip: ['AI bilan ishlaydi', 'Ob-havoga mos', "O'zbekcha", 'Bepul boshlang'],
  features: {
    eyebrow: 'IMKONIYATLAR',
    title: 'Shkafingiz uchun aqlli yordamchi',
    lead: 'Kiyimni tanlash, uslubni topish va looklarni ulashish — barchasi bitta ilovada.',
    items: [
      {
        icon: '📸',
        title: 'Aqlli shkaf',
        body: 'Kiyimni suratga oling — AI uni avtomatik turkumlaydi: rang, kategoriya, mavsum.',
      },
      {
        icon: '🧠',
        title: 'Kunlik look',
        body: 'Har tongda ob-havo va shkafingizga mos tayyor outfit sizni kutadi.',
      },
      {
        icon: '🌤️',
        title: 'Ob-havoga mos',
        body: 'Toshkentdan Xivagacha — har bir viloyat ob-havosiga moslashadi.',
      },
      {
        icon: '🪄',
        title: "Vizual ko'rinish",
        body: 'AI lookni yagona rasmga jamlaydi — kiyishdan oldin ko’ring.',
      },
      {
        icon: '💬',
        title: 'Jamiyat va suhbat',
        body: 'Looklaringizni ulashing, boshqalarni kuzating, real vaqtda yozishing.',
      },
      {
        icon: '🛍️',
        title: 'Xarid maslahati',
        body: "Shkafingizda nima yetishmayotganini AI aytadi va xohish ro'yxatini tuzadi.",
      },
    ],
  },
  how: {
    eyebrow: 'QANDAY ISHLAYDI',
    title: 'Uch oddiy qadam',
    steps: [
      {
        title: "Shkafingizni to'ldiring",
        body: "Kiyimlaringizni suratga oling. AI ularni o'zi tartiblaydi.",
      },
      {
        title: 'Tedy uslub tanlaydi',
        body: "AI ob-havo va didingizga qarab mukammal lookni yig'adi.",
      },
      {
        title: 'Kiying va ulashing',
        body: 'Tayyor lookni kiying va jamiyat bilan bo’lishing.',
      },
    ],
  },
  magic: {
    eyebrow: 'AI SEHRI',
    title: "Bir tugma — to'liq look.",
    body: 'Tedy shkafingizdagi bir-biriga mos kiyimlarni tanlaydi, ularni birlashtiradi va sizga tayyor outfitni ko’rsatadi. Yoqmadimi? Bitta tegish bilan yangisini oling.',
    checks: [
      'Ob-havo va mavsumni hisobga oladi',
      'Sizning uslubingizga moslashadi',
      'Haftalik reja tuzadi',
    ],
  },
  community: {
    eyebrow: 'JAMIYAT',
    title: 'Uslub — birga chiroyli.',
    body: "Looklaringizni ulashing, sevimli stilistlaringizni kuzating, layk va izoh qoldiring. Yoqqan inson bilan to'g'ridan-to'g'ri yozishing.",
    stats: [
      { icon: '♥', label: 'Layk va izohlar' },
      { icon: '＋', label: 'Kuzatish' },
      { icon: '💬', label: 'Jonli suhbat' },
    ],
  },
  cta: {
    title: "Tedy bilan har kuni o'zingizcha",
    body: 'iOS va Android uchun. Bepul yuklab oling va birinchi lookingizni bugun oling.',
  },
  footer: {
    tag: 'Aqlli shkaf. Mukammal look.',
    productH: 'Mahsulot',
    legalH: 'Huquqiy',
    contactH: 'Aloqa',
    product: ['Imkoniyatlar', 'Qanday ishlaydi', 'Jamiyat', 'Yuklab olish'],
    privacy: 'Maxfiylik siyosati',
    delete: "Hisobni o'chirish",
    rights: '© 2026 Tedy Style',
    madeIn: "O'zbekistonda mehr bilan yaratildi 🇺🇿",
  },
}

const en: Translation = {
  nav: {
    features: 'Features',
    how: 'How it works',
    community: 'Community',
    download: 'Download',
  },
  hero: {
    eyebrow: 'AI STYLIST',
    title: 'Tedy decides what you wear today.',
    sub: 'Snap your clothes — Tedy builds the perfect outfit for your weather and your style. Every day, in a single tap.',
    trust: 'Free · Sign in with Google or Apple',
  },
  store: {
    appStoreSmall: 'Download on the',
    appStore: 'App Store',
    playSmall: 'Get it on',
    play: 'Google Play',
  },
  strip: ['AI-powered', 'Weather-aware', 'Built for Uzbekistan', 'Free to start'],
  features: {
    eyebrow: 'FEATURES',
    title: 'A smart companion for your wardrobe',
    lead: 'Choosing what to wear, finding your style, and sharing your looks — all in one app.',
    items: [
      {
        icon: '📸',
        title: 'Smart wardrobe',
        body: 'Snap a clothing item and AI tags it automatically: color, category, season.',
      },
      {
        icon: '🧠',
        title: 'Daily looks',
        body: 'A ready-made outfit waits for you each morning, matched to the weather and your closet.',
      },
      {
        icon: '🌤️',
        title: 'Weather-aware',
        body: "From Tashkent to Khiva — it adapts to your region's forecast.",
      },
      {
        icon: '🪄',
        title: 'See it first',
        body: 'AI composes your look into a single image — see it before you wear it.',
      },
      {
        icon: '💬',
        title: 'Community & chat',
        body: 'Share your looks, follow others, and message friends in real time.',
      },
      {
        icon: '🛍️',
        title: 'Shopping tips',
        body: "AI tells you what's missing from your closet and builds your wishlist.",
      },
    ],
  },
  how: {
    eyebrow: 'HOW IT WORKS',
    title: 'Three simple steps',
    steps: [
      {
        title: 'Fill your wardrobe',
        body: 'Take photos of your clothes. AI organizes them for you.',
      },
      {
        title: 'Tedy styles you',
        body: 'AI assembles the perfect look from the weather and your taste.',
      },
      {
        title: 'Wear it & share',
        body: 'Wear your outfit and share it with the community.',
      },
    ],
  },
  magic: {
    eyebrow: 'THE MAGIC MOMENT',
    title: 'One tap — a complete look.',
    body: 'Tedy picks what goes together from your closet, composes it, and shows you the finished outfit. Not feeling it? One tap brings a fresh one.',
    checks: [
      'Accounts for weather and season',
      'Learns your personal style',
      'Plans your whole week',
    ],
  },
  community: {
    eyebrow: 'COMMUNITY',
    title: 'Style is better together.',
    body: 'Share your looks, follow the stylists you love, like and comment. Message anyone who inspires you, directly.',
    stats: [
      { icon: '♥', label: 'Likes & comments' },
      { icon: '＋', label: 'Follow people' },
      { icon: '💬', label: 'Live chat' },
    ],
  },
  cta: {
    title: 'Be effortlessly you, every day',
    body: 'For iOS and Android. Download free and get your first look today.',
  },
  footer: {
    tag: 'Smart wardrobe. Perfect looks.',
    productH: 'Product',
    legalH: 'Legal',
    contactH: 'Contact',
    product: ['Features', 'How it works', 'Community', 'Download'],
    privacy: 'Privacy policy',
    delete: 'Delete account',
    rights: '© 2026 Tedy Style',
    madeIn: 'Made with care in Uzbekistan 🇺🇿',
  },
}

const translations: Record<Lang, Translation> = { uz, en }

interface LanguageContextValue {
  lang: Lang
  setLang: (lang: Lang) => void
  t: Translation
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

const STORAGE_KEY = 'tedy-lang'

function readInitialLang(): Lang {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'uz' || saved === 'en') return saved
  } catch {
    /* localStorage unavailable — fall through */
  }
  return 'uz'
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readInitialLang)

  useEffect(() => {
    document.documentElement.lang = lang
    try {
      localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      /* ignore */
    }
  }, [lang])

  const value = useMemo<LanguageContextValue>(
    () => ({ lang, setLang: setLangState, t: translations[lang] }),
    [lang],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLang(): LanguageContextValue {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLang must be used within LanguageProvider')
  return ctx
}
