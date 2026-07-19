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
  'nav.personalization': { ru: 'Персонализация', uz: 'Personalizatsiya', en: 'Personalization' },
  'nav.clicks': { ru: 'Клики по кнопкам', uz: 'Tugma bosishlari', en: 'Click buttons' },
  'nav.transactions': { ru: 'Транзакции', uz: 'Tranzaksiyalar', en: 'Transactions' },
  'nav.support': { ru: 'Поддержка', uz: "Qo'llab-quvvatlash", en: 'Support' },
  'nav.notifications': { ru: 'Уведомления', uz: 'Bildirishnomalar', en: 'Notifications' },
  'nav.blogs': { ru: 'Блог', uz: 'Blog', en: 'Blog' },
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
  'daterange.days': { ru: '{n}д', uz: '{n} kun', en: '{n}d' },

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
  // Section headings
  'dashboard.section.growth': { ru: 'Рост пользователей', uz: "Foydalanuvchilar o'sishi", en: 'User growth' },
  'dashboard.section.audience': { ru: 'Аудитория и активность', uz: 'Auditoriya va faollik', en: 'Audience & activity' },
  'dashboard.section.money': { ru: 'Подписки и транзакции', uz: 'Obunalar va tranzaksiyalar', en: 'Subscriptions & transactions' },
  // Users-count container
  'dashboard.usersCount': { ru: 'Пользователи', uz: 'Foydalanuvchilar', en: 'Users' },
  'dashboard.usersTotal': { ru: 'всего', uz: 'jami', en: 'total' },
  'dashboard.usersNew': { ru: 'новых за период', uz: 'davr uchun yangi', en: 'new in range' },
  // DAU/WAU/MAU container + modal
  'dashboard.activity.title': { ru: 'Активные пользователи', uz: 'Faol foydalanuvchilar', en: 'Active users' },
  'dashboard.activity.open': { ru: 'Открыть графики →', uz: 'Grafiklarni ochish →', en: 'Open charts →' },
  'dashboard.activity.note': {
    ru: 'Данные отражают отслеживаемую активность за выбранный период.',
    uz: "Ma'lumotlar tanlangan davr uchun kuzatilgan faollikni aks ettiradi.",
    en: 'Figures reflect tracked activity over the selected range.',
  },

  // ---- Users ----
  'users.title': { ru: 'Пользователи', uz: 'Foydalanuvchilar', en: 'Users' },
  'users.subtitle': {
    ru: 'Список пользователей и аудитория',
    uz: "Foydalanuvchilar ro'yxati va auditoriya",
    en: 'User list and audience',
  },
  'users.tab.list': { ru: 'Пользователи', uz: 'Foydalanuvchilar', en: 'Users' },
  'users.tab.auditory': { ru: 'Аудитория', uz: 'Auditoriya', en: 'Auditory' },
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

  // ---- Clicks (Click buttons) ----
  'clicks.title': { ru: 'Клики по кнопкам', uz: 'Tugma bosishlari', en: 'Click buttons' },
  'clicks.subtitle': {
    ru: 'Как часто нажимают отслеживаемые кнопки в приложении',
    uz: 'Ilovadagi kuzatiladigan tugmalar qanchalik tez bosiladi',
    en: 'How often tracked in-app buttons are tapped',
  },

  // ---- Personalization ----
  'personalization.title': { ru: 'Персонализация', uz: 'Personalizatsiya', en: 'Personalization' },
  'personalization.subtitle': {
    ru: 'Стили, цветотип и ответы пользователей',
    uz: 'Uslublar, rang turi va foydalanuvchi javoblari',
    en: 'Styles, color type and user answers',
  },
  'personalization.searchPlaceholder': {
    ru: 'Поиск по имени / @username',
    uz: "Ism / @username bo'yicha qidirish",
    en: 'Search by name / @username',
  },
  'personalization.empty': { ru: 'Ответов пока нет', uz: "Hozircha javoblar yo'q", en: 'No answers yet' },
  'personalization.col.country': { ru: 'Страна', uz: 'Davlat', en: 'Country' },
  'personalization.drawer.title': { ru: 'Ответы пользователя', uz: 'Foydalanuvchi javoblari', en: 'User answers' },
  'personalization.info.country': { ru: 'Страна', uz: 'Davlat', en: 'Country' },
  'personalization.info.city': { ru: 'Город', uz: 'Shahar', en: 'City' },
  'personalization.info.weight': { ru: 'Вес', uz: 'Vazn', en: 'Weight' },
  'personalization.info.weightValue': { ru: '{n} кг', uz: '{n} kg', en: '{n} kg' },
  'personalization.info.hijab': { ru: 'Хиджаб', uz: 'Hijob', en: 'Hijab' },
  'personalization.info.styles': { ru: 'Стили', uz: 'Uslublar', en: 'Styles' },
  'personalization.info.painPoints': { ru: 'Проблемы / боли', uz: 'Muammolar', en: 'Pain points' },
  'personalization.value.yes': { ru: 'Да', uz: 'Ha', en: 'Yes' },
  'personalization.value.no': { ru: 'Нет', uz: "Yo'q", en: 'No' },

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
  'notifications.langLabel': { ru: 'Язык текста', uz: 'Matn tili', en: 'Text language' },
  'notifications.lang.uz': { ru: "Узбекский", uz: "O'zbekcha", en: 'Uzbek' },
  'notifications.lang.ru': { ru: 'Русский', uz: 'Ruscha', en: 'Russian' },
  'notifications.lang.en': { ru: 'Английский', uz: 'Inglizcha', en: 'English' },
  'notifications.lang.uzHint': {
    ru: 'Основной — обязателен. Используется, если перевод не заполнен.',
    uz: "Asosiy — majburiy. Tarjima to'ldirilmasa, shu ishlatiladi.",
    en: 'Primary — required. Used when a translation is left blank.',
  },
  'notifications.lang.fallbackHint': {
    ru: 'Необязательно. Если пусто — отправится узбекский текст.',
    uz: "Ixtiyoriy. Bo'sh bo'lsa — o'zbekcha matn ketadi.",
    en: 'Optional. If blank, the Uzbek text is sent instead.',
  },
  'notifications.langBadge': {
    ru: 'Каждый пользователь получит текст на своём языке',
    uz: 'Har bir foydalanuvchi o‘z tilida matn oladi',
    en: 'Each user receives the text in their own language',
  },
  'notifications.field.deepLink': { ru: 'Ссылка (deep link, необязательно)', uz: 'Havola (deep link, ixtiyoriy)', en: 'Link (deep link, optional)' },
  'notifications.field.deepLinkPlaceholder': { ru: 'sevil://…', uz: 'sevil://…', en: 'sevil://…' },
  // Destination picker
  'notifications.link.label': { ru: 'Кнопка / переход', uz: 'Tugma / oʻtish', en: 'Button / destination' },
  'notifications.link.none': { ru: 'Без кнопки', uz: 'Tugmasiz', en: 'No button' },
  'notifications.link.aiChat': { ru: 'AI-чат', uz: 'AI chat', en: 'AI Chat' },
  'notifications.link.secondhand': { ru: 'Секонд-хенд', uz: 'Sekond-xend', en: 'Secondhand' },
  'notifications.link.pro': { ru: 'Тариф PRO', uz: 'PRO tarifi', en: 'PRO plan' },
  'notifications.link.blogs': { ru: 'Блог', uz: 'Blog', en: 'Blogs' },
  'notifications.link.home': { ru: 'Главная', uz: 'Bosh sahifa', en: 'Home' },
  'notifications.link.custom': { ru: 'Своя ссылка…', uz: 'Boshqa havola…', en: 'Custom…' },
  'notifications.link.hint': {
    ru: 'Станет кнопкой в уведомлении и откроет выбранный раздел приложения.',
    uz: 'Bildirishnomada tugmaga aylanadi va tanlangan ilova boʻlimini ochadi.',
    en: 'Becomes a tappable button in the notification that opens the chosen section of the app.',
  },
  'notifications.audienceLabel': { ru: 'Аудитория', uz: 'Auditoriya', en: 'Audience' },
  'notifications.error.fill': { ru: 'Заполните заголовок и текст', uz: "Sarlavha va matnni to'ldiring", en: 'Fill in the title and text' },
  'notifications.error.send': { ru: 'Не удалось отправить', uz: "Yuborib bo'lmadi", en: 'Failed to send' },
  'notifications.sent': { ru: 'Отправлено {n} пользователям', uz: '{n} foydalanuvchiga yuborildi', en: 'Sent to {n} users' },
  'notifications.busy': { ru: 'Отправка…', uz: 'Yuborilmoqda…', en: 'Sending…' },
  'notifications.send': { ru: 'Отправить', uz: 'Yuborish', en: 'Send' },

  // ---- Blogs ----
  'blogs.title': { ru: 'Блог', uz: 'Blog', en: 'Blog' },
  'blogs.subtitle': {
    ru: 'Статьи и новости приложения',
    uz: 'Ilova maqolalari va yangiliklari',
    en: 'Articles and app news',
  },
  'blogs.list.heading': { ru: 'Все записи · {n}', uz: 'Barcha yozuvlar · {n}', en: 'All posts · {n}' },
  'blogs.empty.title': { ru: 'Записей пока нет', uz: "Hozircha yozuvlar yo'q", en: 'No posts yet' },
  'blogs.empty.hint': {
    ru: 'Создайте первую статью в форме справа.',
    uz: "O'ngdagi formada birinchi maqolani yarating.",
    en: 'Create your first article in the form on the right.',
  },
  'blogs.new': { ru: '+ Новая запись', uz: '+ Yangi yozuv', en: '+ New post' },
  // Language tabs (per-language content)
  'blogs.lang.label': { ru: 'Язык записи', uz: 'Yozuv tili', en: 'Post language' },
  'blogs.lang.uz': { ru: 'Узбекский', uz: "O'zbekcha", en: 'Uzbek' },
  'blogs.lang.ru': { ru: 'Русский', uz: 'Ruscha', en: 'Russian' },
  'blogs.lang.en': { ru: 'Английский', uz: 'Inglizcha', en: 'English' },
  'blogs.lang.uzHint': {
    ru: 'Основной язык — заголовок и текст обязательны. Используется, если перевод не заполнен.',
    uz: "Asosiy til — sarlavha va matn majburiy. Tarjima to'ldirilmasa, shu ishlatiladi.",
    en: 'Primary language — title and body required. Used when a translation is left blank.',
  },
  'blogs.lang.fallbackHint': {
    ru: 'Необязательно. Пустые поля в приложении заменяются узбекской версией.',
    uz: "Ixtiyoriy. Bo'sh maydonlar ilovada o'zbekcha versiya bilan almashtiriladi.",
    en: 'Optional. Blank fields fall back to the Uzbek version in the app.',
  },
  // Editor
  'blogs.editor.create': { ru: 'Новая запись', uz: 'Yangi yozuv', en: 'New post' },
  'blogs.editor.edit': { ru: 'Редактирование записи', uz: 'Yozuvni tahrirlash', en: 'Edit post' },
  'blogs.field.title': { ru: 'Заголовок', uz: 'Sarlavha', en: 'Title' },
  'blogs.field.titlePlaceholder': { ru: 'Название статьи', uz: 'Maqola nomi', en: 'Article title' },
  'blogs.field.excerpt': { ru: 'Краткое описание (необязательно)', uz: 'Qisqacha tavsif (ixtiyoriy)', en: 'Excerpt (optional)' },
  'blogs.field.excerptPlaceholder': {
    ru: 'Короткий анонс для карточки…',
    uz: 'Karta uchun qisqa anons…',
    en: 'A short teaser for the card…',
  },
  'blogs.field.author': { ru: 'Автор (необязательно)', uz: 'Muallif (ixtiyoriy)', en: 'Author (optional)' },
  'blogs.field.authorPlaceholder': { ru: 'Имя автора', uz: 'Muallif ismi', en: 'Author name' },
  'blogs.field.body': { ru: 'Текст статьи (Markdown)', uz: 'Maqola matni (Markdown)', en: 'Body (Markdown)' },
  'blogs.field.bodyPlaceholder': {
    ru: 'Напишите статью в формате Markdown…',
    uz: 'Maqolani Markdown formatida yozing…',
    en: 'Write the article in Markdown…',
  },
  'blogs.field.cover': { ru: 'Обложка', uz: 'Muqova', en: 'Cover image' },
  // Cover controls
  'blogs.cover.add': { ru: 'Загрузить обложку', uz: 'Muqova yuklash', en: 'Upload cover' },
  'blogs.cover.change': { ru: 'Заменить', uz: "O'zgartirish", en: 'Replace' },
  'blogs.cover.remove': { ru: 'Удалить', uz: "O'chirish", en: 'Remove' },
  'blogs.cover.uploading': { ru: 'Загрузка обложки…', uz: 'Muqova yuklanmoqda…', en: 'Uploading cover…' },
  'blogs.cover.error': { ru: 'Не удалось загрузить изображение', uz: "Rasmni yuklab bo'lmadi", en: 'Failed to upload the image' },
  'blogs.cover.alt': { ru: 'Обложка', uz: 'Muqova', en: 'Cover' },
  // Write / Preview
  'blogs.tab.write': { ru: 'Текст', uz: 'Matn', en: 'Write' },
  'blogs.tab.preview': { ru: 'Предпросмотр', uz: "Ko'rib chiqish", en: 'Preview' },
  'blogs.preview.empty': {
    ru: 'Начните печатать, чтобы увидеть предпросмотр.',
    uz: "Ko'rib chiqishni ko'rish uchun matn tering.",
    en: 'Start typing to see the preview.',
  },
  // Markdown toolbar (tooltips)
  'blogs.toolbar.h2': { ru: 'Заголовок', uz: 'Sarlavha', en: 'Heading' },
  'blogs.toolbar.bold': { ru: 'Жирный', uz: 'Qalin', en: 'Bold' },
  'blogs.toolbar.italic': { ru: 'Курсив', uz: 'Kursiv', en: 'Italic' },
  'blogs.toolbar.list': { ru: 'Список', uz: "Ro'yxat", en: 'List' },
  'blogs.toolbar.quote': { ru: 'Цитата', uz: 'Iqtibos', en: 'Quote' },
  'blogs.toolbar.link': { ru: 'Ссылка', uz: 'Havola', en: 'Link' },
  // Markdown toolbar (inserted placeholder text)
  'blogs.insert.heading': { ru: 'Заголовок', uz: 'Sarlavha', en: 'Heading' },
  'blogs.insert.bold': { ru: 'жирный текст', uz: 'qalin matn', en: 'bold text' },
  'blogs.insert.italic': { ru: 'курсив', uz: 'kursiv matn', en: 'italic text' },
  'blogs.insert.list': { ru: 'Пункт списка', uz: "Ro'yxat bandi", en: 'List item' },
  'blogs.insert.quote': { ru: 'Цитата', uz: 'Iqtibos', en: 'Quote' },
  'blogs.insert.link': { ru: 'текст ссылки', uz: 'havola matni', en: 'link text' },
  // Publish + status
  'blogs.publishToggle': { ru: 'Опубликовать', uz: 'Chop etish', en: 'Publish' },
  'blogs.publishHint': {
    ru: 'Опубликованные записи видны в приложении.',
    uz: 'Chop etilgan yozuvlar ilovada ko‘rinadi.',
    en: 'Published posts are visible in the app.',
  },
  'blogs.status.published': { ru: 'Опубликовано', uz: 'Chop etilgan', en: 'Published' },
  'blogs.status.draft': { ru: 'Черновик', uz: 'Qoralama', en: 'Draft' },
  // Row actions
  'blogs.action.edit': { ru: 'Изменить', uz: 'Tahrirlash', en: 'Edit' },
  'blogs.action.publish': { ru: 'Опубликовать', uz: 'Chop etish', en: 'Publish' },
  'blogs.action.unpublish': { ru: 'Снять с публикации', uz: 'Chop etishni bekor qilish', en: 'Unpublish' },
  'blogs.action.delete': { ru: 'Удалить', uz: "O'chirish", en: 'Delete' },
  'blogs.action.save': { ru: 'Сохранить', uz: 'Saqlash', en: 'Save' },
  'blogs.action.saving': { ru: 'Сохранение…', uz: 'Saqlanmoqda…', en: 'Saving…' },
  'blogs.action.cancel': { ru: 'Отмена', uz: 'Bekor qilish', en: 'Cancel' },
  'blogs.saved': { ru: 'Сохранено ✓', uz: 'Saqlandi ✓', en: 'Saved ✓' },
  'blogs.error.required': {
    ru: 'Заполните заголовок и текст статьи',
    uz: "Sarlavha va maqola matnini to'ldiring",
    en: 'Fill in the title and the body',
  },
  'blogs.error.save': { ru: 'Не удалось сохранить', uz: "Saqlab bo'lmadi", en: 'Failed to save' },
  'blogs.confirmDelete': {
    ru: 'Удалить эту запись безвозвратно?',
    uz: 'Bu yozuv butunlay o‘chirilsinmi?',
    en: 'Delete this post permanently?',
  },
  // Crop dialog
  'blogs.crop.title': { ru: 'Кадрировать обложку', uz: 'Muqovani kesish', en: 'Crop cover' },
  'blogs.crop.hint': {
    ru: 'Перетаскивайте и масштабируйте. Формат 16:9.',
    uz: 'Suring va masshtablang. Format 16:9.',
    en: 'Drag and zoom. 16:9 aspect ratio.',
  },
  'blogs.crop.zoom': { ru: 'Масштаб', uz: 'Masshtab', en: 'Zoom' },
  'blogs.crop.apply': { ru: 'Применить', uz: 'Qo‘llash', en: 'Apply' },
  'blogs.crop.applying': { ru: 'Загрузка…', uz: 'Yuklanmoqda…', en: 'Uploading…' },
  'blogs.crop.cancel': { ru: 'Отмена', uz: 'Bekor qilish', en: 'Cancel' },

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
