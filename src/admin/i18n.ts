import { useLang, type Lang } from '../i18n'

// ---------------------------------------------------------------------------
// Admin-panel i18n. The admin lives outside the marketing site's translation
// tables, so it carries its own flat dictionary. Every user-facing string in
// `src/admin/**` is keyed here with descriptive dotted keys.
//
//   `ru` is the source of truth (the original hardcoded Russian).
//   `uz` is Uzbek (Latin script), `en` is professional English.
//
// Backend enum -> label maps (Support type/status, Notification audience) are
// keyed by slug, e.g. `support.status.new`, so components can resolve them via
// `t('support.status.' + slug)`.
//
// `{n}` (and other `{name}` tokens) are interpolated from the `vars` argument.
// ---------------------------------------------------------------------------

const dict = {
  // ---- Shell / navigation ----
  'nav.dashboard': { ru: 'Дашборд', uz: 'Boshqaruv paneli', en: 'Dashboard' },
  'nav.users': { ru: 'Пользователи', uz: 'Foydalanuvchilar', en: 'Users' },
  'nav.transactions': { ru: 'Транзакции', uz: 'Tranzaksiyalar', en: 'Transactions' },
  'nav.support': { ru: 'Поддержка', uz: "Qo'llab-quvvatlash", en: 'Support' },
  'nav.notifications': { ru: 'Уведомления', uz: 'Bildirishnomalar', en: 'Notifications' },
  'nav.cms': { ru: 'CMS', uz: 'CMS', en: 'CMS' },
  'nav.logout': { ru: 'Выйти', uz: 'Chiqish', en: 'Log out' },

  // ---- Common ----
  'common.total': { ru: 'Всего: {n}', uz: 'Jami: {n}', en: 'Total: {n}' },
  'common.error.title': { ru: 'Не удалось загрузить', uz: "Yuklab bo'lmadi", en: 'Failed to load' },
  'common.error.body': {
    ru: 'Проверьте, что бэкенд admin API запущен и вы авторизованы.',
    uz: "Admin API backend ishga tushganini va siz avtorizatsiyadan o'tganingizni tekshiring.",
    en: 'Make sure the admin API backend is running and that you are authorized.',
  },
  'common.error.retry': { ru: 'Повторить', uz: 'Qayta urinish', en: 'Retry' },
  'chart.empty': { ru: 'Нет данных', uz: "Ma'lumot yo'q", en: 'No data' },

  // ---- Login ----
  'login.error.invalid': {
    ru: 'Неверный логин или пароль',
    uz: "Login yoki parol noto'g'ri",
    en: 'Invalid login or password',
  },
  'login.error.generic': {
    ru: 'Не удалось войти. Проверьте соединение с сервером.',
    uz: "Kirib bo'lmadi. Server bilan aloqani tekshiring.",
    en: 'Could not sign in. Check the server connection.',
  },
  'login.title': { ru: 'Вход в панель', uz: 'Panelga kirish', en: 'Sign in to the panel' },
  'login.subtitle': {
    ru: 'Введите логин и пароль администратора.',
    uz: 'Administrator login va parolini kiriting.',
    en: 'Enter the administrator login and password.',
  },
  'login.username': { ru: 'Логин', uz: 'Login', en: 'Login' },
  'login.password': { ru: 'Пароль', uz: 'Parol', en: 'Password' },
  'login.busy': { ru: 'Вход…', uz: 'Kirilmoqda…', en: 'Signing in…' },
  'login.submit': { ru: 'Войти', uz: 'Kirish', en: 'Sign in' },

  // ---- Dashboard ----
  'dashboard.title': { ru: 'Дашборд', uz: 'Boshqaruv paneli', en: 'Dashboard' },
  'dashboard.subtitle': {
    ru: 'Обзор роста, транзакций и аудитории',
    uz: "O'sish, tranzaksiyalar va auditoriya sharhi",
    en: 'Overview of growth, transactions and audience',
  },
  'dashboard.loading': { ru: 'Загрузка статистики…', uz: 'Statistika yuklanmoqda…', en: 'Loading statistics…' },
  'dashboard.stat.users': { ru: 'Пользователи', uz: 'Foydalanuvchilar', en: 'Users' },
  'dashboard.stat.revenue': { ru: 'Доход', uz: 'Daromad', en: 'Revenue' },
  'dashboard.stat.paidSubs': { ru: 'Платные подписки', uz: 'Pullik obunalar', en: 'Paid subscriptions' },
  'dashboard.stat.free': { ru: 'Free', uz: 'Free', en: 'Free' },
  'dashboard.new30dDelta': { ru: '+{n} / 30д', uz: '+{n} / 30 kun', en: '+{n} / 30d' },
  'dashboard.txnCountDelta': { ru: '{n} транз.', uz: '{n} tranz.', en: '{n} txns' },
  'dashboard.dau.desc': { ru: 'активны за 24ч', uz: '24 soatda faol', en: 'active in 24h' },
  'dashboard.wau.desc': { ru: 'за 7 дней', uz: '7 kunda', en: 'in 7 days' },
  'dashboard.mau.desc': { ru: 'за 30 дней', uz: '30 kunda', en: 'in 30 days' },
  'dashboard.chart.userGrowth': { ru: 'Рост пользователей', uz: "Foydalanuvchilar o'sishi", en: 'User growth' },
  'dashboard.chart.transactions': { ru: 'Транзакции', uz: 'Tranzaksiyalar', en: 'Transactions' },
  'dashboard.chart.subscriptions': { ru: 'Подписки', uz: 'Obunalar', en: 'Subscriptions' },
  'dashboard.chart.gender': { ru: 'Пол аудитории', uz: 'Auditoriya jinsi', en: 'Audience gender' },
  'dashboard.chart.colorType': { ru: 'Цветотип', uz: 'Rang turi', en: 'Color type' },
  'dashboard.chart.region': { ru: 'Регионы (локация)', uz: 'Hududlar (lokatsiya)', en: 'Regions (location)' },
  'dashboard.chart.age': { ru: 'Возраст', uz: 'Yosh', en: 'Age' },
  'dashboard.chart.retention': {
    ru: 'Удержание (возврат пользователей)',
    uz: 'Ushlab qolish (foydalanuvchilar qaytishi)',
    en: 'Retention (returning users)',
  },
  'dashboard.retention.day': { ru: 'День', uz: 'Kun', en: 'Day' },
  'dashboard.retention.week': { ru: 'Неделя', uz: 'Hafta', en: 'Week' },
  'dashboard.retention.month': { ru: 'Месяц', uz: 'Oy', en: 'Month' },
  'dashboard.chart.txnByStatus': { ru: 'Транзакции по статусу', uz: "Status bo'yicha tranzaksiyalar", en: 'Transactions by status' },
  'dashboard.noTransactions': { ru: 'Нет транзакций', uz: "Tranzaksiyalar yo'q", en: 'No transactions' },
  'dashboard.chart.styles': { ru: 'Стили', uz: 'Uslublar', en: 'Styles' },
  'dashboard.chart.buttonClicks': { ru: 'Клики по кнопкам', uz: 'Tugmalar bosishlari', en: 'Button clicks' },
  'dashboard.noEvents': { ru: 'Пока нет событий', uz: "Hozircha hodisalar yo'q", en: 'No events yet' },

  // ---- Users ----
  'users.title': { ru: 'Пользователи', uz: 'Foydalanuvchilar', en: 'Users' },
  'users.searchPlaceholder': {
    ru: 'Поиск по имени / @username',
    uz: "Ism / @username bo'yicha qidirish",
    en: 'Search by name / @username',
  },
  'users.searchButton': { ru: 'Найти', uz: 'Topish', en: 'Search' },
  'users.empty': { ru: 'Пользователи не найдены', uz: 'Foydalanuvchilar topilmadi', en: 'No users found' },
  'users.col.user': { ru: 'Пользователь', uz: 'Foydalanuvchi', en: 'User' },
  'users.col.plan': { ru: 'План', uz: 'Reja', en: 'Plan' },
  'users.col.gender': { ru: 'Пол', uz: 'Jins', en: 'Gender' },
  'users.col.region': { ru: 'Регион', uz: 'Hudud', en: 'Region' },
  'users.col.created': { ru: 'Регистрация', uz: "Ro'yxatdan o'tgan", en: 'Registered' },
  'users.drawer.profile': { ru: 'Профиль', uz: 'Profil', en: 'Profile' },
  'users.drawer.loadError': { ru: 'Не удалось загрузить профиль.', uz: "Profilni yuklab bo'lmadi.", en: 'Failed to load the profile.' },
  'users.info.plan': { ru: 'План', uz: 'Reja', en: 'Plan' },
  'users.info.gender': { ru: 'Пол', uz: 'Jins', en: 'Gender' },
  'users.info.region': { ru: 'Регион', uz: 'Hudud', en: 'Region' },
  'users.info.colorType': { ru: 'Цветотип', uz: 'Rang turi', en: 'Color type' },
  'users.info.bodyShape': { ru: 'Тип фигуры', uz: 'Gavda tuzilishi', en: 'Body shape' },
  'users.info.height': { ru: 'Рост', uz: "Bo'y", en: 'Height' },
  'users.info.heightValue': { ru: '{n} см', uz: '{n} sm', en: '{n} cm' },
  'users.info.birthYear': { ru: 'Год рождения', uz: "Tug'ilgan yil", en: 'Birth year' },
  'users.info.created': { ru: 'Регистрация', uz: "Ro'yxatdan o'tgan", en: 'Registered' },
  'users.info.favoriteColors': { ru: 'Любимые цвета', uz: 'Sevimli ranglar', en: 'Favorite colors' },
  'users.info.bio': { ru: 'О себе', uz: "O'zi haqida", en: 'About' },
  'users.styles.heading': { ru: 'Сгенерированные образы · {n}', uz: 'Yaratilgan obrazlar · {n}', en: 'Generated looks · {n}' },
  'users.styles.empty': { ru: 'Пока нет образов', uz: "Hozircha obrazlar yo'q", en: 'No looks yet' },

  // ---- Transactions ----
  'transactions.title': { ru: 'Транзакции', uz: 'Tranzaksiyalar', en: 'Transactions' },
  'transactions.empty': { ru: 'Транзакций пока нет', uz: "Hozircha tranzaksiyalar yo'q", en: 'No transactions yet' },
  'transactions.col.user': { ru: 'Пользователь', uz: 'Foydalanuvchi', en: 'User' },
  'transactions.col.amount': { ru: 'Сумма', uz: 'Summa', en: 'Amount' },
  'transactions.col.plan': { ru: 'План', uz: 'Reja', en: 'Plan' },
  'transactions.col.provider': { ru: 'Провайдер', uz: 'Provayder', en: 'Provider' },
  'transactions.col.status': { ru: 'Статус', uz: 'Status', en: 'Status' },
  'transactions.col.date': { ru: 'Дата', uz: 'Sana', en: 'Date' },

  // ---- Support ----
  'support.title': { ru: 'Поддержка', uz: "Qo'llab-quvvatlash", en: 'Support' },
  'support.subtitle': { ru: 'Обращения из приложения · {n}', uz: 'Ilovadan murojaatlar · {n}', en: 'Requests from the app · {n}' },
  'support.filter.all': { ru: 'Все', uz: 'Hammasi', en: 'All' },
  // Feedback type slugs (backend enum)
  'support.type.bug': { ru: 'Ошибка', uz: 'Xatolik', en: 'Bug' },
  'support.type.suggestion': { ru: 'Предложение', uz: 'Taklif', en: 'Suggestion' },
  'support.type.question': { ru: 'Вопрос', uz: 'Savol', en: 'Question' },
  'support.type.other': { ru: 'Другое', uz: 'Boshqa', en: 'Other' },
  // Feedback status slugs (backend enum)
  'support.status.new': { ru: 'Новое', uz: 'Yangi', en: 'New' },
  'support.status.in_progress': { ru: 'В работе', uz: 'Jarayonda', en: 'In progress' },
  'support.status.resolved': { ru: 'Решено', uz: 'Hal qilingan', en: 'Resolved' },
  'support.empty.title': { ru: 'Обращений нет', uz: "Murojaatlar yo'q", en: 'No requests' },
  'support.empty.hint': {
    ru: 'Формы из приложения будут приходить сюда.',
    uz: 'Ilovadagi formalar shu yerga keladi.',
    en: 'Forms from the app will arrive here.',
  },
  'support.userFallback': { ru: 'Пользователь', uz: 'Foydalanuvchi', en: 'User' },
  'support.attachment': { ru: '📎 вложение', uz: '📎 ilova', en: '📎 attachment' },
  'support.attachmentAlt': { ru: 'вложение', uz: 'ilova', en: 'attachment' },
  'support.drawer.title': { ru: 'Обращение', uz: 'Murojaat', en: 'Request' },
  'support.statusHeading': { ru: 'Статус', uz: 'Status', en: 'Status' },

  // ---- Notifications ----
  'notifications.title': { ru: 'Уведомления', uz: 'Bildirishnomalar', en: 'Notifications' },
  'notifications.subtitle': {
    ru: 'Отправка push и in-app уведомлений пользователям',
    uz: 'Foydalanuvchilarga push va ilova ichidagi bildirishnomalar yuborish',
    en: 'Send push and in-app notifications to users',
  },
  // Audience slugs (backend enum)
  'notifications.audience.all': { ru: 'Все', uz: 'Hammasi', en: 'All' },
  'notifications.audience.free': { ru: 'Free', uz: 'Free', en: 'Free' },
  'notifications.audience.pro': { ru: 'PRO', uz: 'PRO', en: 'PRO' },
  'notifications.audience.max': { ru: 'MAX', uz: 'MAX', en: 'MAX' },
  'notifications.history': { ru: 'История рассылок', uz: 'Yuborishlar tarixi', en: 'Broadcast history' },
  'notifications.empty': { ru: 'Пока ничего не отправлено', uz: 'Hozircha hech narsa yuborilmagan', en: 'Nothing sent yet' },
  'notifications.composer.title': { ru: 'Новая рассылка', uz: 'Yangi yuborish', en: 'New broadcast' },
  'notifications.field.title': { ru: 'Заголовок', uz: 'Sarlavha', en: 'Title' },
  'notifications.field.titlePlaceholder': { ru: 'Например: Новая коллекция ✨', uz: 'Masalan: Yangi kolleksiya ✨', en: 'e.g. New collection ✨' },
  'notifications.field.body': { ru: 'Текст', uz: 'Matn', en: 'Text' },
  'notifications.field.bodyPlaceholder': {
    ru: 'Короткое сообщение для пользователей…',
    uz: 'Foydalanuvchilar uchun qisqa xabar…',
    en: 'A short message for users…',
  },
  'notifications.field.deepLink': { ru: 'Ссылка (deep link, необязательно)', uz: 'Havola (deep link, ixtiyoriy)', en: 'Link (deep link, optional)' },
  'notifications.field.deepLinkPlaceholder': { ru: 'sevil://…', uz: 'sevil://…', en: 'sevil://…' },
  'notifications.audienceLabel': { ru: 'Аудитория', uz: 'Auditoriya', en: 'Audience' },
  'notifications.error.fill': { ru: 'Заполните заголовок и текст', uz: "Sarlavha va matnni to'ldiring", en: 'Fill in the title and text' },
  'notifications.error.send': { ru: 'Не удалось отправить', uz: "Yuborib bo'lmadi", en: 'Failed to send' },
  'notifications.sent': { ru: 'Отправлено {n} пользователям', uz: '{n} foydalanuvchiga yuborildi', en: 'Sent to {n} users' },
  'notifications.busy': { ru: 'Отправка…', uz: 'Yuborilmoqda…', en: 'Sending…' },
  'notifications.send': { ru: 'Отправить', uz: 'Yuborish', en: 'Send' },

  // ---- CMS ----
  'cms.title': { ru: 'CMS', uz: 'CMS', en: 'CMS' },
  'cms.subtitle': { ru: 'Промпты AI и контент', uz: 'AI promptlari va kontent', en: 'AI prompts and content' },
  'cms.saved': { ru: 'Сохранено ✓', uz: 'Saqlandi ✓', en: 'Saved ✓' },
  'cms.saving': { ru: 'Сохранение…', uz: 'Saqlanmoqda…', en: 'Saving…' },
  'cms.save': { ru: 'Сохранить', uz: 'Saqlash', en: 'Save' },
  'cms.charCount': { ru: '{n} символов', uz: '{n} belgi', en: '{n} characters' },
  'cms.unsavedDot': { ru: 'Есть несохранённые изменения', uz: "Saqlanmagan o'zgarishlar bor", en: 'You have unsaved changes' },
  'cms.tab.chat': { ru: 'AI-стилист (чат)', uz: 'AI stilist (chat)', en: 'AI stylist (chat)' },
  'cms.tab.outfit': { ru: 'Генерация образа', uz: 'Obraz generatsiyasi', en: 'Outfit generation' },
  'cms.tab.enhance': { ru: 'Обработка фото', uz: 'Rasmni qayta ishlash', en: 'Photo processing' },
  'cms.title.chat': { ru: 'Системный промпт — чат', uz: 'Tizim prompti — chat', en: 'System prompt — chat' },
  'cms.title.outfit': { ru: 'Промпт генерации образа', uz: 'Obraz generatsiya prompti', en: 'Outfit generation prompt' },
  'cms.title.enhance': { ru: 'Промпт вырезки одежды из фото', uz: 'Kiyimni rasmdan kesib olish prompti', en: 'Clothing cutout prompt' },
  'cms.hint.chat': {
    ru: 'Задаёт поведение Sevil в чате: тон, язык, формат ответов. Применяется к новым сообщениям.',
    uz: "Sevilning chatdagi xatti-harakatini belgilaydi: ohang, til, javob formati. Yangi xabarlarga qo'llaniladi.",
    en: "Defines Sevil's behavior in chat: tone, language, response format. Applies to new messages.",
  },
  'cms.hint.outfit': {
    ru: 'Управляет тем, как AI собирает ежедневный образ из гардероба пользователя.',
    uz: "AI foydalanuvchi shkafidan kunlik obrazni qanday yig'ishini boshqaradi.",
    en: "Controls how the AI assembles the daily outfit from the user's wardrobe.",
  },
  'cms.hint.enhance': {
    ru: 'Master-бриф: как AI вырезает вещь из фото (убирает человека и фон, ставит на белый). Применяется при загрузке новой одежды.',
    uz: "Master-brif: AI kiyimni rasmdan qanday kesib oladi (odam va fonni olib tashlaydi, oq fonga qo'yadi). Yangi kiyim yuklanganda qo'llaniladi.",
    en: 'Master brief: how the AI cuts an item out of a photo (removes the person and background, places it on white). Applies when new clothing is uploaded.',
  },
} satisfies Record<string, Record<Lang, string>>

export type AdminKey = keyof typeof dict

/** Interpolation vars, e.g. `t('common.total', { n: 42 })`. */
type Vars = Record<string, string | number>

export type AdminT = (key: AdminKey | (string & {}), vars?: Vars) => string

/**
 * Reads the active language from the shared LanguageProvider and returns a
 * `t(key, vars?)` translator. Falls back to `ru`, then to the raw key.
 */
export function useAdminT(): AdminT {
  const { lang } = useLang()
  return (key, vars) => {
    const entry = (dict as Record<string, Record<Lang, string>>)[key]
    let s = entry ? entry[lang] ?? entry.ru : key
    if (vars) s = s.replace(/\{(\w+)\}/g, (_m, k: string) => (k in vars ? String(vars[k]) : `{${k}}`))
    return s
  }
}
