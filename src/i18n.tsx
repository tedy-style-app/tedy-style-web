import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export type Lang = 'ru' | 'uz' | 'en'

export interface Feature {
  icon: string
  title: string
  body: string
}

export interface Step {
  title: string
  body: string
}

export interface Plan {
  name: string
  tagline: string
  price: string
  /** Original price shown struck-through next to `price` to signal a discount. */
  priceOld?: string
  priceUnit?: string
  priceNote?: string
  features: string[]
  highlight?: boolean
  badge?: string
}

export interface Translation {
  nav: { features: string; how: string; pricing: string; download: string }
  hero: { eyebrow: string; title: string; sub: string; trust: string }
  store: { appStoreSmall: string; appStore: string; playSmall: string; play: string }
  strip: string[]
  features: { eyebrow: string; title: string; lead: string; items: Feature[] }
  how: { eyebrow: string; title: string; steps: Step[] }
  ai: {
    eyebrow: string
    title: string
    body: string
    checks: string[]
    chatUser: string
    chatReply: string
    chatBadge: string
  }
  secondhand: {
    eyebrow: string
    title: string
    body: string
    points: { icon: string; label: string }[]
    free: string
    itemTitle: string
    itemMeta: string
  }
  pricing: {
    eyebrow: string
    title: string
    lead: string
    note: string
    cta: string
    plans: Plan[]
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

const ru: Translation = {
  nav: {
    features: 'Возможности',
    how: 'Как это работает',
    pricing: 'Тарифы',
    download: 'Скачать',
  },
  hero: {
    eyebrow: 'AI-СТИЛИСТ',
    title: 'Твой стилист. Каждое утро — готовый образ.',
    sub: 'Сфотографируй свой гардероб — Sevil соберёт идеальный образ под погоду, повод и твой вкус. Каждый день, в одно касание.',
    trust: 'Бесплатно · Вход через Google или Apple',
  },
  store: {
    appStoreSmall: 'Загрузите в',
    appStore: 'App Store',
    playSmall: 'Доступно в',
    play: 'Google Play',
  },
  strip: ['Личный AI-стилист', 'Погода твоего города', '3 языка', 'Бесплатный старт'],
  features: {
    eyebrow: 'ВОЗМОЖНОСТИ',
    title: 'Умный помощник для твоего гардероба',
    lead: 'Выбрать, что надеть, найти свой стиль и подарить вещам вторую жизнь — всё в одном приложении.',
    items: [
      {
        icon: '✦',
        title: 'AI-стилист Sevil',
        body: 'Напиши «что надеть сегодня?» — и получи образ, собранный из твоих вещей. Живой чат на твоём языке.',
      },
      {
        icon: '📸',
        title: 'Умный гардероб',
        body: 'Сфотографируй одежду — AI распознаёт её и раскладывает по категориям, цветам и сезонам.',
      },
      {
        icon: '☀️',
        title: 'Образ на сегодня',
        body: 'Каждое утро готовый лук, подобранный под погоду твоего города и содержимое шкафа.',
      },
      {
        icon: '🎨',
        title: 'Персонализация',
        body: 'Цветотип, тип фигуры, любимые цвета и стиль — образы получаются точно под тебя.',
      },
      {
        icon: '🛍️',
        title: 'Secondhand',
        body: 'Отдавай ненужное даром и находи вещи от других — из гардероба в пару касаний.',
      },
      {
        icon: '🌐',
        title: 'Твой язык, твои данные',
        body: 'Русский, oʻzbek и English. Приватность по умолчанию — гардероб виден только тебе.',
      },
    ],
  },
  how: {
    eyebrow: 'КАК ЭТО РАБОТАЕТ',
    title: 'Три простых шага',
    steps: [
      {
        title: 'Заполни гардероб',
        body: 'Сфотографируй свои вещи — AI сам их распознает и разложит по полочкам.',
      },
      {
        title: 'Расскажи о себе',
        body: 'Цветотип, фигура и стиль — пара минут, чтобы образы стали точно твоими.',
      },
      {
        title: 'Получай образы',
        body: 'Каждый день — готовый лук, а Sevil всегда на связи в чате.',
      },
    ],
  },
  ai: {
    eyebrow: 'AI-СТИЛИСТ',
    title: 'Спроси — и получи готовый образ.',
    body: 'Sevil — личный стилист в кармане. Напиши обычными словами, что нужно, — и он соберёт образ из твоего гардероба с учётом погоды, повода и твоего вкуса.',
    checks: [
      'Отвечает на твоём языке',
      'Собирает образ из твоих вещей',
      'Помнит твой стиль и погоду',
    ],
    chatUser: 'Что надеть сегодня?',
    chatReply:
      'Сегодня в Ташкенте прохладно. Предлагаю: бежевый свитер, тёмные джинсы, белые кроссовки и лёгкую куртку. Свежо и по погоде ✨',
    chatBadge: 'Sevil печатает…',
  },
  secondhand: {
    eyebrow: 'SECONDHAND',
    title: 'Дай вещам вторую жизнь.',
    body: 'Не носишь? Отдай даром. Публикуй вещи из своего гардероба в пару касаний, находи находки от других и договаривайся напрямую в Telegram.',
    points: [
      { icon: '🎁', label: 'Отдавай даром' },
      { icon: '⚡', label: 'Публикация в 2 касания' },
      { icon: '💬', label: 'Связь в Telegram' },
    ],
    free: 'Даром',
    itemTitle: 'Бежевое пальто',
    itemMeta: 'Размер M · Отличное',
  },
  pricing: {
    eyebrow: 'ТАРИФЫ',
    title: 'Начни бесплатно',
    lead: 'Базовые возможности — навсегда бесплатны. Больше AI — на PRO и MAX.',
    note: 'Оплата оформляется в приложении.',
    cta: 'Открыть в приложении',
    plans: [
      {
        name: 'Free',
        tagline: 'Всё, чтобы начать',
        price: 'Бесплатно',
        features: [
          'ИИ-чат: 5 сообщений/день',
          'Образ дня: 1 лук/день',
          'Гардероб: до 15 вещей',
          'Секонд-хенд: частичный',
          'Проактивный ИИ-стилист: базовый',
        ],
      },
      {
        name: 'PRO',
        tagline: 'Для тех, кто хочет больше',
        price: '$3.99',
        priceOld: '$7.99',
        priceUnit: '/ мес',
        priceNote: 'Первые 3 месяца, затем $7.99/мес',
        highlight: true,
        badge: 'Популярный',
        features: [
          'Всё из Free',
          'ИИ-чат: 50/день (факт. безлимит)',
          'Образ дня: 5 луков/день',
          'Гардероб: до 50 вещей',
          'Полный секонд-хенд',
          'Виртуальная примерка',
          'Без рекламы',
        ],
      },
      {
        name: 'MAX',
        tagline: 'Максимум от Sevil',
        price: '$11.99',
        priceUnit: '/ мес',
        features: [
          'Всё из PRO',
          'ИИ-чат: безлимит',
          'Образ дня: 5 + по запросу (10)',
          'Безлимитный гардероб',
          'Секонд-хенд + ранние дропы',
          'Персональный ИИ-стилист',
        ],
      },
    ],
  },
  cta: {
    title: 'Будь собой каждый день',
    body: 'Для iOS и Android. Скачай бесплатно и получи свой первый образ уже сегодня.',
  },
  footer: {
    tag: 'Умный гардероб. Идеальные образы.',
    productH: 'Продукт',
    legalH: 'Правовое',
    contactH: 'Контакты',
    product: ['Возможности', 'Как это работает', 'Тарифы', 'Скачать'],
    privacy: 'Политика конфиденциальности',
    delete: 'Удалить аккаунт',
    rights: '© 2026 Sevil',
    madeIn: 'Сделано с любовью в Узбекистане 🇺🇿',
  },
}

const uz: Translation = {
  nav: {
    features: 'Imkoniyatlar',
    how: 'Qanday ishlaydi',
    pricing: 'Tariflar',
    download: 'Yuklab olish',
  },
  hero: {
    eyebrow: 'AI STILIST',
    title: 'Sizning stilistingiz. Har tong — tayyor obraz.',
    sub: "Shkafingizni suratga oling — Sevil ob-havo, tadbir va didingizga mos mukammal obrazni yig'adi. Har kuni, bir tegishda.",
    trust: 'Bepul · Google yoki Apple bilan kiring',
  },
  store: {
    appStoreSmall: 'Yuklab oling:',
    appStore: 'App Store',
    playSmall: 'Yuklab oling:',
    play: 'Google Play',
  },
  strip: ['Shaxsiy AI stilist', 'Shahringiz ob-havosi', '3 til', 'Bepul boshlang'],
  features: {
    eyebrow: 'IMKONIYATLAR',
    title: 'Shkafingiz uchun aqlli yordamchi',
    lead: 'Nima kiyishni tanlash, uslubni topish va kiyimlarga ikkinchi hayot berish — barchasi bitta ilovada.',
    items: [
      {
        icon: '✦',
        title: 'AI stilist Sevil',
        body: "«Bugun nima kiyay?» deb yozing — shkafingizdagi kiyimlardan obraz yig'ib beradi. Tilingizda jonli suhbat.",
      },
      {
        icon: '📸',
        title: 'Aqlli shkaf',
        body: 'Kiyimni suratga oling — AI uni taniydi va kategoriya, rang, mavsum boʻyicha tartiblaydi.',
      },
      {
        icon: '☀️',
        title: 'Bugungi obraz',
        body: 'Har tong shahringiz ob-havosi va shkafingizga mos tayyor look sizni kutadi.',
      },
      {
        icon: '🎨',
        title: 'Personalizatsiya',
        body: 'Rangturingiz, gavda tuzilishi, sevimli ranglar va uslub — obrazlar aynan sizga mos.',
      },
      {
        icon: '🛍️',
        title: 'Secondhand',
        body: 'Keraksiz kiyimni daromad bering va boshqalarnikini toping — shkafdan bir necha tegishda.',
      },
      {
        icon: '🌐',
        title: 'Tilingiz, maʼlumotingiz',
        body: "Ruscha, oʻzbek va English. Maxfiylik odatiy — shkafingizni faqat siz koʻrasiz.",
      },
    ],
  },
  how: {
    eyebrow: 'QANDAY ISHLAYDI',
    title: 'Uch oddiy qadam',
    steps: [
      {
        title: "Shkafni to'ldiring",
        body: "Kiyimlaringizni suratga oling — AI ularni o'zi taniydi va tartiblaydi.",
      },
      {
        title: "O'zingiz haqingizda ayting",
        body: "Rangtur, gavda va uslub — obrazlar aynan sizniki bo'lishi uchun bir necha daqiqa.",
      },
      {
        title: 'Obrazlarni oling',
        body: 'Har kuni tayyor look, Sevil esa doim chatda aloqada.',
      },
    ],
  },
  ai: {
    eyebrow: 'AI STILIST',
    title: "So'rang — tayyor obrazni oling.",
    body: "Sevil — cho'ntagingizdagi shaxsiy stilist. Nima kerakligini oddiy so'z bilan yozing — u shkafingizdan ob-havo, tadbir va didingizga mos obrazni yig'adi.",
    checks: [
      'Tilingizda javob beradi',
      "Obrazni sizning kiyimlaringizdan yig'adi",
      'Uslub va ob-havoni eslab qoladi',
    ],
    chatUser: 'Bugun nima kiyay?',
    chatReply:
      "Bugun Toshkentda salqin. Taklif: bej sviter, to'q jinsi, oq krossovka va yengil kurtka. Tetik va ob-havoga mos ✨",
    chatBadge: 'Sevil yozmoqda…',
  },
  secondhand: {
    eyebrow: 'SECONDHAND',
    title: 'Kiyimlarga ikkinchi hayot bering.',
    body: "Kiymayapsizmi? Daromad bering. Shkafingizdagi kiyimlarni bir necha tegishda joylang, boshqalarnikini toping va to'g'ridan-to'g'ri Telegramda kelishing.",
    points: [
      { icon: '🎁', label: 'Daromad bering' },
      { icon: '⚡', label: '2 tegishda joylang' },
      { icon: '💬', label: 'Telegram orqali aloqa' },
    ],
    free: 'Bepul',
    itemTitle: 'Bej palto',
    itemMeta: "O'lcham M · Aʼlo",
  },
  pricing: {
    eyebrow: 'TARIFLAR',
    title: 'Bepul boshlang',
    lead: "Asosiy imkoniyatlar — abadiy bepul. Ko'proq AI — PRO va MAX'da.",
    note: "To'lov ilovada rasmiylashtiriladi.",
    cta: 'Ilovada ochish',
    plans: [
      {
        name: 'Free',
        tagline: 'Boshlash uchun hammasi',
        price: 'Bepul',
        features: [
          'AI-chat: kuniga 5 ta xabar',
          'Bugungi obraz: kuniga 1 ta',
          'Shkaf: 15 tagacha',
          'Secondhand: qisman',
          'Proaktiv AI stilist: bazaviy',
        ],
      },
      {
        name: 'PRO',
        tagline: "Ko'proq xohlaganlar uchun",
        price: '$3.99',
        priceOld: '$7.99',
        priceUnit: '/ oy',
        priceNote: "Birinchi 3 oy, keyin $7.99/oy",
        highlight: true,
        badge: 'Ommabop',
        features: [
          'Free dagi hammasi',
          'AI-chat: kuniga 50 ta (amalda cheksiz)',
          'Bugungi obraz: kuniga 5 ta',
          'Shkaf: 50 tagacha',
          "To'liq secondhand",
          "Virtual kiyib ko'rish",
          'Reklamasiz',
        ],
      },
      {
        name: 'MAX',
        tagline: 'Sevil dan maksimum',
        price: '$11.99',
        priceUnit: '/ oy',
        features: [
          'PRO dagi hammasi',
          'AI-chat: cheksiz',
          "Bugungi obraz: 5 + so'rov bo'yicha (10)",
          'Cheksiz shkaf',
          'Secondhand + erta droplar',
          'Shaxsiy proaktiv AI stilist',
        ],
      },
    ],
  },
  cta: {
    title: "Har kuni o'zingizcha",
    body: 'iOS va Android uchun. Bepul yuklab oling va birinchi obrazingizni bugun oling.',
  },
  footer: {
    tag: 'Aqlli shkaf. Mukammal obrazlar.',
    productH: 'Mahsulot',
    legalH: 'Huquqiy',
    contactH: 'Aloqa',
    product: ['Imkoniyatlar', 'Qanday ishlaydi', 'Tariflar', 'Yuklab olish'],
    privacy: 'Maxfiylik siyosati',
    delete: "Hisobni o'chirish",
    rights: '© 2026 Sevil',
    madeIn: "O'zbekistonda mehr bilan yaratildi 🇺🇿",
  },
}

const en: Translation = {
  nav: {
    features: 'Features',
    how: 'How it works',
    pricing: 'Pricing',
    download: 'Download',
  },
  hero: {
    eyebrow: 'AI STYLIST',
    title: 'Your stylist. A ready look every morning.',
    sub: 'Snap your wardrobe — Sevil builds the perfect outfit for the weather, the occasion and your taste. Every day, in a single tap.',
    trust: 'Free · Sign in with Google or Apple',
  },
  store: {
    appStoreSmall: 'Download on the',
    appStore: 'App Store',
    playSmall: 'Get it on',
    play: 'Google Play',
  },
  strip: ['A personal AI stylist', "Your city's weather", '3 languages', 'Free to start'],
  features: {
    eyebrow: 'FEATURES',
    title: 'A smart companion for your wardrobe',
    lead: 'Choosing what to wear, finding your style, and giving clothes a second life — all in one app.',
    items: [
      {
        icon: '✦',
        title: 'Sevil, your AI stylist',
        body: 'Ask “what should I wear today?” and get a look built from your own clothes. A live chat in your language.',
      },
      {
        icon: '📸',
        title: 'Smart wardrobe',
        body: 'Snap a clothing item — AI recognizes it and sorts it by category, color and season.',
      },
      {
        icon: '☀️',
        title: 'Look of the day',
        body: "A ready outfit every morning, matched to your city's weather and your closet.",
      },
      {
        icon: '🎨',
        title: 'Personalization',
        body: 'Color type, body shape, favorite colors and style — looks made exactly for you.',
      },
      {
        icon: '🛍️',
        title: 'Secondhand',
        body: 'Give away what you no longer wear and discover pieces from others — in a couple of taps.',
      },
      {
        icon: '🌐',
        title: 'Your language, your data',
        body: 'Russian, oʻzbek and English. Private by default — your wardrobe is yours alone.',
      },
    ],
  },
  how: {
    eyebrow: 'HOW IT WORKS',
    title: 'Three simple steps',
    steps: [
      {
        title: 'Fill your wardrobe',
        body: 'Photograph your clothes — AI recognizes and organizes them for you.',
      },
      {
        title: 'Tell us about you',
        body: 'Color type, shape and style — a couple of minutes to make looks truly yours.',
      },
      {
        title: 'Get your looks',
        body: 'A ready outfit every day, and Sevil always a message away.',
      },
    ],
  },
  ai: {
    eyebrow: 'AI STYLIST',
    title: 'Just ask — get a complete look.',
    body: 'Sevil is your personal stylist in your pocket. Say what you need in plain words, and it assembles a look from your wardrobe — accounting for the weather, the occasion and your taste.',
    checks: [
      'Replies in your language',
      'Builds looks from your own clothes',
      'Remembers your style and weather',
    ],
    chatUser: 'What should I wear today?',
    chatReply:
      "It's cool in Tashkent today. I suggest: a beige sweater, dark jeans, white sneakers and a light jacket. Fresh and weather-ready ✨",
    chatBadge: 'Sevil is typing…',
  },
  secondhand: {
    eyebrow: 'SECONDHAND',
    title: 'Give clothes a second life.',
    body: 'Not wearing it? Give it away. Post items from your wardrobe in a couple of taps, discover finds from others and arrange it directly on Telegram.',
    points: [
      { icon: '🎁', label: 'Give away free' },
      { icon: '⚡', label: 'Post in 2 taps' },
      { icon: '💬', label: 'Chat on Telegram' },
    ],
    free: 'Free',
    itemTitle: 'Beige coat',
    itemMeta: 'Size M · Excellent',
  },
  pricing: {
    eyebrow: 'PRICING',
    title: 'Start for free',
    lead: 'The essentials are free forever. More AI comes with PRO and MAX.',
    note: 'Checkout happens in the app.',
    cta: 'Open in the app',
    plans: [
      {
        name: 'Free',
        tagline: 'Everything to get started',
        price: 'Free',
        features: [
          'AI chat: 5 messages/day',
          'Look of the day: 1/day',
          'Wardrobe: up to 15 items',
          'Secondhand: partial',
          'Proactive AI stylist: basic',
        ],
      },
      {
        name: 'PRO',
        tagline: 'For those who want more',
        price: '$3.99',
        priceOld: '$7.99',
        priceUnit: '/ mo',
        priceNote: 'First 3 months, then $7.99/mo',
        highlight: true,
        badge: 'Popular',
        features: [
          'Everything in Free',
          'AI chat: 50/day (virtually unlimited)',
          'Look of the day: 5/day',
          'Wardrobe: up to 50 items',
          'Full secondhand',
          'Virtual try-on',
          'No ads',
        ],
      },
      {
        name: 'MAX',
        tagline: 'The most of Sevil',
        price: '$11.99',
        priceUnit: '/ mo',
        features: [
          'Everything in PRO',
          'AI chat: unlimited',
          'Look of the day: 5 + on-demand (10)',
          'Unlimited wardrobe',
          'Secondhand + early drops',
          'Personal proactive AI stylist',
        ],
      },
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
    product: ['Features', 'How it works', 'Pricing', 'Download'],
    privacy: 'Privacy policy',
    delete: 'Delete account',
    rights: '© 2026 Sevil',
    madeIn: 'Made with care in Uzbekistan 🇺🇿',
  },
}

const translations: Record<Lang, Translation> = { ru, uz, en }

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
    if (saved === 'ru' || saved === 'uz' || saved === 'en') return saved
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
