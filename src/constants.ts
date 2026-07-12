// Store links — live listings.
export const APP_STORE_URL = 'https://apps.apple.com/app/id6778969423'
export const PLAY_STORE_URL =
  'https://play.google.com/store/apps/details?id=uz.tedy.teddy_mobile'

// Backend API host. In production the web app and the API live on the
// SAME origin (sevil.app + sevil.app/api), so API_BASE is empty and every
// call is relative — nginx routes /api to the backend container. For local
// dev, set VITE_API_BASE (e.g. https://sevil.app) in a .env file.
export const API_BASE = import.meta.env.VITE_API_BASE ?? ''

// Live backend pages (served by the .NET API under the same origin).
export const PRIVACY_URL = `${API_BASE}/privacy`
export const DELETE_ACCOUNT_URL = `${API_BASE}/delete-account`

export const CONTACT_EMAIL = 'hello@tedy.uz'
