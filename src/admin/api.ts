import { API_BASE } from '../constants'

// ---------------------------------------------------------------------------
// Admin API contract. Everything lives under `${API_BASE}/api/admin`.
// The backend (built as a follow-up) must implement these exactly.
//
//   POST   /api/admin/login            {username,password}          -> AuthResult
//   GET    /api/admin/stats                                          -> Stats
//   GET    /api/admin/users?search=&page=&pageSize=                  -> Paged<UserRow>
//   GET    /api/admin/users/{id}                                     -> UserDetail
//   GET    /api/admin/transactions?page=&pageSize=                   -> Paged<Txn>
//   GET    /api/admin/feedback?page=&pageSize=&status=               -> Paged<Feedback>
//   PATCH  /api/admin/feedback/{id}     {status}                     -> Feedback
//   GET    /api/admin/cms                                            -> Cms
//   PUT    /api/admin/cms              {systemPrompt, ...}           -> Cms
//
// All GET/PATCH/PUT require `Authorization: Bearer <token>` and an Admin claim.
// ---------------------------------------------------------------------------

const TOKEN_KEY = 'sevil-admin-token'

export const getToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}
export const setToken = (t: string) => {
  try {
    localStorage.setItem(TOKEN_KEY, t)
  } catch {
    /* ignore */
  }
}
export const clearToken = () => {
  try {
    localStorage.removeItem(TOKEN_KEY)
  } catch {
    /* ignore */
  }
}

export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

async function request<T>(
  path: string,
  opts: { method?: string; body?: unknown } = {},
): Promise<T> {
  const token = getToken()
  const res = await fetch(`${API_BASE}/api/admin${path}`, {
    method: opts.method ?? 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
  })
  if (res.status === 401) {
    clearToken()
    // Let the shell drop back to the login screen.
    try {
      window.dispatchEvent(new Event('sevil-admin-logout'))
    } catch {
      /* non-browser env */
    }
    throw new ApiError(401, 'Unauthorized')
  }
  if (!res.ok) throw new ApiError(res.status, `HTTP ${res.status}`)
  if (res.status === 204) return undefined as T
  return (await res.json()) as T
}

// ---- Types --------------------------------------------------------------

export interface AuthResult {
  token: string
  expiresAt?: string
  name?: string
}

export interface Point {
  date: string // ISO or label
  value: number
}
export interface Slice {
  label: string
  count: number
}

export interface Stats {
  users: { total: number; new30d: number; growth: Point[] }
  revenue: { total: number; currency: string; count: number; growth: Point[] }
  plans: { free: number; pro: number; max: number }
  personalization: {
    gender: Slice[]
    colorType: Slice[]
    region: Slice[]
    style: Slice[]
  }
  activity: { dau: number; wau: number; mau: number }
  age: Slice[]
  retention: { daily: number; weekly: number; monthly: number }
  transactions: { status: string; count: number; amount: number }[]
  buttonClicks: Slice[]
}

/** DAU / WAU / MAU time series for the activity modal. */
export interface ActivitySeries {
  dau: Point[]
  wau: Point[]
  mau: Point[]
}

export interface Paged<T> {
  items: T[]
  total: number
}

/** One row of the "who submitted what" personalization table. */
export interface PersonalizationRow {
  id: string
  fullName: string
  username: string | null
  gender: string | null
  country: string | null
  city: string | null
  region: string | null
  colorSeason: string | null
  bodyShape: string | null
  favoriteColors: string[]
  stylePersonas: string[]
  painPoints: string[]
  birthYear: number | null
  heightCm: number | null
  weightKg: number | null
  hijab: boolean | null
  createdAt: string
}

export interface UserRow {
  id: string
  fullName: string
  username: string
  plan: string
  gender: string | null
  region: string | null
  createdAt: string
}

export interface GeneratedStyle {
  id: string
  createdAt: string
  title: string | null
  imageUrl: string | null
}

export interface UserDetail extends UserRow {
  bio: string | null
  colorSeason: string | null
  bodyShape: string | null
  favoriteColors: string | null
  birthYear: number | null
  heightCm: number | null
  stylesCount: number
  styles: GeneratedStyle[]
}

export interface Txn {
  id: string
  userName: string
  amount: number
  currency: string
  plan: string
  status: string
  provider: string
  createdAt: string
}

export interface Feedback {
  id: string
  userName: string
  type: string
  title: string
  description: string
  attachmentUrl: string | null
  status: string
  createdAt: string
}

export interface Cms {
  systemPrompt: string
  outfitPrompt: string
  enhancePrompt: string
  updatedAt?: string
}

export type NotifAudience = 'all' | 'free' | 'pro' | 'max'

export interface AdminNotification {
  id: string
  title: string
  body: string
  audience: string
  deepLink: string | null
  sentCount: number
  createdAt: string
}

export interface SendNotification {
  // Primary (Uzbek) text — required; also the fallback for any language left blank.
  title: string
  body: string
  audience: NotifAudience
  deepLink?: string
  // Optional per-language overrides; each user gets the text for their active app language.
  titleRu?: string
  bodyRu?: string
  titleEn?: string
  bodyEn?: string
}

export interface AdminBlog {
  id: string
  // Primary (Uzbek) content — always present; the app falls back to it.
  title: string
  excerpt: string
  contentMarkdown: string
  coverImageUrl: string | null
  // Optional per-language overrides (null when not translated).
  titleRu: string | null
  excerptRu: string | null
  contentMarkdownRu: string | null
  coverImageUrlRu: string | null
  titleEn: string | null
  excerptEn: string | null
  contentMarkdownEn: string | null
  coverImageUrlEn: string | null
  authorName: string
  isPublished: boolean
  publishedAt: string | null
  createdAt: string
  updatedAt: string | null
}

export interface SaveBlog {
  // Primary (Uzbek) content — required; also the fallback for blank translations.
  title: string
  excerpt?: string
  contentMarkdown: string
  coverImageUrl?: string
  // Optional per-language overrides; omit to leave blank (app falls back to Uzbek).
  titleRu?: string
  excerptRu?: string
  contentMarkdownRu?: string
  coverImageUrlRu?: string
  titleEn?: string
  excerptEn?: string
  contentMarkdownEn?: string
  coverImageUrlEn?: string
  authorName?: string
  isPublished: boolean
}

// ---- Endpoints ----------------------------------------------------------

export const api = {
  login: (username: string, password: string) =>
    request<AuthResult>('/login', { method: 'POST', body: { username, password } }),
  // Date range is optional; the backend defaults to the last 30 days.
  // `users.growth` and `revenue.growth` then span [from, to].
  stats: (from?: string, to?: string) => {
    const p = new URLSearchParams()
    if (from) p.set('from', from)
    if (to) p.set('to', to)
    const qs = p.toString()
    return request<Stats>(`/stats${qs ? `?${qs}` : ''}`)
  },
  // DAU/WAU/MAU time series for the activity modal (same optional range).
  activitySeries: (from?: string, to?: string) => {
    const p = new URLSearchParams()
    if (from) p.set('from', from)
    if (to) p.set('to', to)
    const qs = p.toString()
    return request<ActivitySeries>(`/activity-series${qs ? `?${qs}` : ''}`)
  },
  // Per-user personalization answers ("who submitted what").
  personalization: (search: string, page: number, pageSize = 20) =>
    request<Paged<PersonalizationRow>>(
      `/personalization?search=${encodeURIComponent(search)}&page=${page}&pageSize=${pageSize}`,
    ),
  users: (search: string, page: number, pageSize = 20) =>
    request<Paged<UserRow>>(
      `/users?search=${encodeURIComponent(search)}&page=${page}&pageSize=${pageSize}`,
    ),
  user: (id: string) => request<UserDetail>(`/users/${id}`),
  transactions: (page: number, pageSize = 20) =>
    request<Paged<Txn>>(`/transactions?page=${page}&pageSize=${pageSize}`),
  feedback: (page: number, status = '', pageSize = 20) =>
    request<Paged<Feedback>>(
      `/feedback?page=${page}&pageSize=${pageSize}${status ? `&status=${status}` : ''}`,
    ),
  updateFeedback: (id: string, status: string) =>
    request<Feedback>(`/feedback/${id}`, { method: 'PATCH', body: { status } }),
  cms: () => request<Cms>('/cms'),
  saveCms: (systemPrompt: string, outfitPrompt: string, enhancePrompt: string) =>
    request<Cms>('/cms', {
      method: 'PUT',
      body: { systemPrompt, outfitPrompt, enhancePrompt },
    }),
  notifications: (page: number, pageSize = 20) =>
    request<Paged<AdminNotification>>(`/notifications?page=${page}&pageSize=${pageSize}`),
  sendNotification: (payload: SendNotification) =>
    request<AdminNotification>('/notifications', { method: 'POST', body: payload }),
  blogs: (page: number, pageSize = 20) =>
    request<Paged<AdminBlog>>(`/blogs?page=${page}&pageSize=${pageSize}`),
  blog: (id: string) => request<AdminBlog>(`/blogs/${id}`),
  createBlog: (payload: SaveBlog) =>
    request<AdminBlog>('/blogs', { method: 'POST', body: payload }),
  updateBlog: (id: string, payload: SaveBlog) =>
    request<AdminBlog>(`/blogs/${id}`, { method: 'PUT', body: payload }),
  publishBlog: (id: string, isPublished: boolean) =>
    request<AdminBlog>(`/blogs/${id}/publish`, { method: 'PATCH', body: { isPublished } }),
  deleteBlog: (id: string) => request<void>(`/blogs/${id}`, { method: 'DELETE' }),
}

/**
 * Uploads a blog cover image via multipart/form-data (field name `image`).
 * Uses raw fetch because `request()` is JSON-only; the browser sets the
 * multipart boundary, so we must NOT set Content-Type ourselves.
 */
export async function uploadBlogImage(file: Blob): Promise<{ url: string }> {
  const token = getToken()
  const formData = new FormData()
  formData.append('image', file, 'cover.jpg')
  const res = await fetch(`${API_BASE}/api/admin/blogs/upload`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  })
  if (res.status === 401) {
    clearToken()
    try {
      window.dispatchEvent(new Event('sevil-admin-logout'))
    } catch {
      /* non-browser env */
    }
    throw new ApiError(401, 'Unauthorized')
  }
  if (!res.ok) throw new ApiError(res.status, `HTTP ${res.status}`)
  return (await res.json()) as { url: string }
}

// Absolute URL for a possibly-relative stored image path.
export const resolveUrl = (url: string | null): string | null => {
  if (!url) return null
  if (/^https?:\/\//i.test(url)) return url
  return `${API_BASE}${url.startsWith('/') ? '' : '/'}${url}`
}
