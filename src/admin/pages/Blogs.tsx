import { useEffect, useMemo, useRef, useState } from 'react'
import Cropper, { type Area, type Point } from 'react-easy-crop'
import { marked } from 'marked'
import { api, resolveUrl, uploadBlogImage, type AdminBlog, type SaveBlog } from '../api'
import { PageHeader, Spinner, ErrorState, EmptyState, Card, Badge, Pager, fmtDate } from '../ui'
import { useAdminT, type AdminT } from '../i18n'

const PAGE_SIZE = 20

export default function Blogs() {
  const t = useAdminT()
  const [page, setPage] = useState(1)
  const [rows, setRows] = useState<AdminBlog[]>([])
  const [total, setTotal] = useState(0)
  const [state, setState] = useState<'loading' | 'error' | 'ready'>('loading')
  const [editing, setEditing] = useState<AdminBlog | null>(null)
  // Bumped to force the editor to remount with a clean slate.
  const [nonce, setNonce] = useState(0)

  const load = () => {
    setState('loading')
    api
      .blogs(page, PAGE_SIZE)
      .then((r) => {
        setRows(r.items)
        setTotal(r.total)
        setState('ready')
      })
      .catch(() => setState('error'))
  }
  useEffect(load, [page])

  const startNew = () => {
    setEditing(null)
    setNonce((n) => n + 1)
  }
  const startEdit = (b: AdminBlog) => {
    setEditing(b)
    setNonce((n) => n + 1)
  }

  const onSaved = (saved: AdminBlog, wasCreate: boolean) => {
    // Refresh the list; page 1 shows newest first.
    if (wasCreate && page !== 1) setPage(1)
    else load()
    if (wasCreate) startNew()
    else {
      setEditing(saved)
      setNonce((n) => n + 1)
    }
  }

  const togglePublish = async (b: AdminBlog) => {
    try {
      const updated = await api.publishBlog(b.id, !b.isPublished)
      setRows((rs) => rs.map((x) => (x.id === b.id ? updated : x)))
      setEditing((e) => (e && e.id === b.id ? updated : e))
    } catch {
      /* keep UI as-is */
    }
  }

  const remove = async (b: AdminBlog) => {
    if (!window.confirm(t('blogs.confirmDelete'))) return
    try {
      await api.deleteBlog(b.id)
      setRows((rs) => rs.filter((x) => x.id !== b.id))
      setTotal((n) => Math.max(0, n - 1))
      if (editing && editing.id === b.id) startNew()
    } catch {
      /* keep UI as-is */
    }
  }

  return (
    <div>
      <PageHeader
        title={t('blogs.title')}
        subtitle={t('blogs.subtitle')}
        action={
          <button
            onClick={startNew}
            className="rounded-full bg-grad-espresso px-5 py-2.5 text-[14px] font-extrabold text-onEspresso shadow-glow disabled:opacity-40"
          >
            {t('blogs.new')}
          </button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
        {/* List */}
        <div>
          <h3 className="mb-3 text-[15px] font-extrabold text-ink">
            {t('blogs.list.heading', { n: total.toLocaleString('ru-RU') })}
          </h3>
          {state === 'loading' && <Spinner />}
          {state === 'error' && <ErrorState onRetry={load} />}
          {state === 'ready' &&
            (rows.length === 0 ? (
              <EmptyState icon="📝" title={t('blogs.empty.title')} hint={t('blogs.empty.hint')} />
            ) : (
              <>
                <div className="flex flex-col gap-3">
                  {rows.map((b) => (
                    <BlogRow
                      key={b.id}
                      blog={b}
                      active={editing?.id === b.id}
                      onEdit={() => startEdit(b)}
                      onTogglePublish={() => togglePublish(b)}
                      onDelete={() => remove(b)}
                    />
                  ))}
                </div>
                <Pager page={page} total={total} pageSize={PAGE_SIZE} onPage={setPage} />
              </>
            ))}
        </div>

        {/* Editor */}
        <BlogEditor key={`${editing?.id ?? 'new'}:${nonce}`} editing={editing} onSaved={onSaved} />
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// List row
// ---------------------------------------------------------------------------

function BlogRow({
  blog,
  active,
  onEdit,
  onTogglePublish,
  onDelete,
}: {
  blog: AdminBlog
  active: boolean
  onEdit: () => void
  onTogglePublish: () => void
  onDelete: () => void
}) {
  const t = useAdminT()
  const cover = resolveUrl(blog.coverImageUrl)
  return (
    <div
      className={`rounded-4xl border bg-white p-3 shadow-card transition-colors ${
        active ? 'border-gold-soft' : 'border-hair'
      }`}
    >
      <div className="flex gap-3">
        {cover ? (
          <img
            src={cover}
            alt={t('blogs.cover.alt')}
            className="h-16 w-24 shrink-0 rounded-2xl border border-hair object-cover"
          />
        ) : (
          <div className="flex h-16 w-24 shrink-0 items-center justify-center rounded-2xl bg-cream text-[22px]">
            📝
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <Badge tone={blog.isPublished ? 'green' : 'neutral'}>
              {t(blog.isPublished ? 'blogs.status.published' : 'blogs.status.draft')}
            </Badge>
            <span className="ml-auto text-[11px] font-semibold text-ink-3">{fmtDate(blog.createdAt)}</span>
          </div>
          <div className="mt-1 line-clamp-2 text-[14px] font-extrabold leading-tight text-ink">{blog.title}</div>
        </div>
      </div>
      <div className="mt-2.5 flex flex-wrap gap-1.5">
        <RowAction onClick={onEdit}>{t('blogs.action.edit')}</RowAction>
        <RowAction onClick={onTogglePublish}>
          {t(blog.isPublished ? 'blogs.action.unpublish' : 'blogs.action.publish')}
        </RowAction>
        <RowAction onClick={onDelete} tone="danger">
          {t('blogs.action.delete')}
        </RowAction>
      </div>
    </div>
  )
}

function RowAction({
  children,
  onClick,
  tone = 'default',
}: {
  children: React.ReactNode
  onClick: () => void
  tone?: 'default' | 'danger'
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-[12px] font-extrabold transition-colors ${
        tone === 'danger'
          ? 'border-like/40 bg-white text-like hover:bg-like/10'
          : 'border-line bg-white text-ink-2 hover:bg-cream'
      }`}
    >
      {children}
    </button>
  )
}

// ---------------------------------------------------------------------------
// Editor
// ---------------------------------------------------------------------------

function BlogEditor({
  editing,
  onSaved,
}: {
  editing: AdminBlog | null
  onSaved: (saved: AdminBlog, wasCreate: boolean) => void
}) {
  const t = useAdminT()
  const [title, setTitle] = useState(editing?.title ?? '')
  const [excerpt, setExcerpt] = useState(editing?.excerpt ?? '')
  const [author, setAuthor] = useState(editing?.authorName ?? '')
  const [body, setBody] = useState(editing?.contentMarkdown ?? '')
  const [cover, setCover] = useState<string | null>(editing?.coverImageUrl ?? null)
  const [isPublished, setIsPublished] = useState(editing?.isPublished ?? false)
  const [tab, setTab] = useState<'write' | 'preview'>('write')

  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  // Cover upload state.
  const [cropSrc, setCropSrc] = useState<string | null>(null)
  const [coverBusy, setCoverBusy] = useState(false)
  const [coverError, setCoverError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const bodyRef = useRef<HTMLTextAreaElement>(null)

  const isCreate = editing === null
  const previewHtml = useMemo(
    () => (body.trim() ? (marked(body, { async: false }) as string) : ''),
    [body],
  )

  const insert = (before: string, after = '', placeholder = '') => {
    const ta = bodyRef.current
    if (!ta) {
      setBody((b) => b + before + placeholder + after)
      return
    }
    const start = ta.selectionStart
    const end = ta.selectionEnd
    const selected = body.slice(start, end) || placeholder
    const next = body.slice(0, start) + before + selected + after + body.slice(end)
    setBody(next)
    requestAnimationFrame(() => {
      ta.focus()
      const pos = start + before.length
      ta.setSelectionRange(pos, pos + selected.length)
    })
  }

  const onPickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = '' // allow re-selecting the same file later
    if (!file) return
    setCoverError('')
    const reader = new FileReader()
    reader.onload = () => setCropSrc(reader.result as string)
    reader.readAsDataURL(file)
  }

  const onCropDone = async (blob: Blob) => {
    setCoverBusy(true)
    setCoverError('')
    try {
      const { url } = await uploadBlogImage(blob)
      setCover(url)
      setCropSrc(null)
    } catch {
      setCoverError(t('blogs.cover.error'))
    } finally {
      setCoverBusy(false)
    }
  }

  const save = async () => {
    if (saving) return
    if (title.trim() === '' || body.trim() === '') {
      setError(t('blogs.error.required'))
      return
    }
    setError('')
    setSaving(true)
    const payload: SaveBlog = {
      title: title.trim(),
      excerpt: excerpt.trim() || undefined,
      contentMarkdown: body,
      coverImageUrl: cover ?? undefined,
      authorName: author.trim() || undefined,
      isPublished,
    }
    try {
      const result = isCreate
        ? await api.createBlog(payload)
        : await api.updateBlog(editing.id, payload)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
      onSaved(result, isCreate)
    } catch {
      setError(t('blogs.error.save'))
    } finally {
      setSaving(false)
    }
  }

  const coverUrl = resolveUrl(cover)

  return (
    <Card
      title={t(isCreate ? 'blogs.editor.create' : 'blogs.editor.edit')}
      className="h-fit"
      action={saved ? <span className="text-[13px] font-extrabold text-online">{t('blogs.saved')}</span> : undefined}
    >
      <div className="flex flex-col gap-3">
        <Field label={t('blogs.field.title')}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t('blogs.field.titlePlaceholder')}
            className="w-full bg-transparent text-[15px] font-semibold text-ink outline-none placeholder:text-ink-3"
          />
        </Field>

        <Field label={t('blogs.field.excerpt')}>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={2}
            placeholder={t('blogs.field.excerptPlaceholder')}
            className="w-full resize-y bg-transparent text-[14px] font-medium leading-relaxed text-ink outline-none placeholder:text-ink-3"
          />
        </Field>

        <Field label={t('blogs.field.author')}>
          <input
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder={t('blogs.field.authorPlaceholder')}
            className="w-full bg-transparent text-[14px] font-semibold text-ink outline-none placeholder:text-ink-3"
          />
        </Field>

        {/* Cover image */}
        <div>
          <div className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-ink-3">{t('blogs.field.cover')}</div>
          {coverUrl && (
            <img
              src={coverUrl}
              alt={t('blogs.cover.alt')}
              className="mb-2 aspect-[16/9] w-full rounded-2xl border border-hair object-cover"
            />
          )}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => fileRef.current?.click()}
              disabled={coverBusy}
              className="rounded-full border border-line bg-white px-4 py-2 text-[13px] font-extrabold text-ink-2 transition-colors hover:bg-cream disabled:opacity-40"
            >
              {coverUrl ? t('blogs.cover.change') : t('blogs.cover.add')}
            </button>
            {coverUrl && (
              <button
                onClick={() => setCover(null)}
                className="rounded-full border border-like/40 bg-white px-4 py-2 text-[13px] font-extrabold text-like transition-colors hover:bg-like/10"
              >
                {t('blogs.cover.remove')}
              </button>
            )}
            {coverBusy && <span className="text-[12px] font-semibold text-ink-3">{t('blogs.cover.uploading')}</span>}
          </div>
          {coverError && <div className="mt-1.5 text-[12px] font-semibold text-like">{coverError}</div>}
          <input ref={fileRef} type="file" accept="image/*" onChange={onPickFile} className="hidden" />
        </div>

        {/* Body: Write | Preview */}
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wide text-ink-3">{t('blogs.field.body')}</span>
            <div className="inline-flex gap-1 rounded-full bg-cream p-1">
              {(['write', 'preview'] as const).map((tb) => (
                <button
                  key={tb}
                  onClick={() => setTab(tb)}
                  className={`rounded-full px-3 py-1 text-[12px] font-extrabold transition-colors ${
                    tab === tb ? 'bg-espresso text-onEspresso' : 'text-ink-2'
                  }`}
                >
                  {t('blogs.tab.' + tb)}
                </button>
              ))}
            </div>
          </div>

          {tab === 'write' ? (
            <div className="rounded-2xl border border-line bg-cream focus-within:border-gold-soft">
              <Toolbar t={t} insert={insert} />
              <textarea
                ref={bodyRef}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                spellCheck={false}
                rows={14}
                placeholder={t('blogs.field.bodyPlaceholder')}
                className="min-h-[280px] w-full resize-y bg-transparent px-4 py-3 font-mono text-[13px] leading-relaxed text-ink outline-none placeholder:text-ink-3"
              />
            </div>
          ) : previewHtml ? (
            <div
              className="min-h-[280px] rounded-2xl border border-line bg-white px-4 py-3 text-[14px] leading-relaxed text-ink-2 [&_a]:text-gold [&_a]:underline [&_blockquote]:my-2 [&_blockquote]:border-l-2 [&_blockquote]:border-gold [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:text-ink-3 [&_code]:rounded [&_code]:bg-cream [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[12.5px] [&_h1]:mt-4 [&_h1]:text-[20px] [&_h1]:font-black [&_h1]:text-ink [&_h2]:mt-3 [&_h2]:text-[17px] [&_h2]:font-extrabold [&_h2]:text-ink [&_h3]:mt-2 [&_h3]:text-[15px] [&_h3]:font-extrabold [&_h3]:text-ink [&_img]:my-2 [&_img]:rounded-2xl [&_li]:my-1 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:my-2 [&_strong]:font-extrabold [&_strong]:text-ink [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5"
              dangerouslySetInnerHTML={{ __html: previewHtml }}
            />
          ) : (
            <div className="flex min-h-[280px] items-center justify-center rounded-2xl border border-line bg-white px-4 py-3 text-center text-[13px] font-medium text-ink-3">
              {t('blogs.preview.empty')}
            </div>
          )}
        </div>

        {/* Publish toggle */}
        <button
          type="button"
          onClick={() => setIsPublished((v) => !v)}
          className="flex items-center justify-between rounded-2xl border border-line bg-cream px-4 py-3 text-left"
        >
          <span>
            <span className="block text-[14px] font-extrabold text-ink">{t('blogs.publishToggle')}</span>
            <span className="mt-0.5 block text-[12px] font-medium text-ink-3">{t('blogs.publishHint')}</span>
          </span>
          <span
            className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
              isPublished ? 'bg-online' : 'bg-ink-3/40'
            }`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-soft transition-all ${
                isPublished ? 'left-[22px]' : 'left-0.5'
              }`}
            />
          </span>
        </button>

        {error && <div className="text-[13px] font-semibold text-like">{error}</div>}

        <button
          onClick={save}
          disabled={saving}
          className="mt-1 w-full rounded-2xl bg-grad-espresso py-3 text-[15px] font-extrabold text-onEspresso shadow-glow disabled:opacity-50"
        >
          {saving ? t('blogs.action.saving') : t('blogs.action.save')}
        </button>
      </div>

      {cropSrc && (
        <CropModal
          src={cropSrc}
          busy={coverBusy}
          onCancel={() => setCropSrc(null)}
          onApply={onCropDone}
        />
      )}
    </Card>
  )
}

function Toolbar({ t, insert }: { t: AdminT; insert: (before: string, after?: string, placeholder?: string) => void }) {
  const btns: { key: string; label: string; run: () => void }[] = [
    { key: 'h2', label: 'H2', run: () => insert('## ', '', t('blogs.insert.heading')) },
    { key: 'bold', label: 'B', run: () => insert('**', '**', t('blogs.insert.bold')) },
    { key: 'italic', label: 'I', run: () => insert('*', '*', t('blogs.insert.italic')) },
    { key: 'list', label: '•', run: () => insert('- ', '', t('blogs.insert.list')) },
    { key: 'quote', label: '❝', run: () => insert('> ', '', t('blogs.insert.quote')) },
    { key: 'link', label: '🔗', run: () => insert('[', '](https://)', t('blogs.insert.link')) },
  ]
  return (
    <div className="flex flex-wrap gap-1 border-b border-line px-2 py-1.5">
      {btns.map((b) => (
        <button
          key={b.key}
          type="button"
          title={t('blogs.toolbar.' + b.key)}
          onClick={b.run}
          className={`flex h-7 min-w-7 items-center justify-center rounded-lg px-2 text-[13px] text-ink-2 transition-colors hover:bg-beige ${
            b.key === 'bold' ? 'font-black' : b.key === 'italic' ? 'font-bold italic' : 'font-bold'
          }`}
        >
          {b.label}
        </button>
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Crop modal
// ---------------------------------------------------------------------------

function CropModal({
  src,
  busy,
  onCancel,
  onApply,
}: {
  src: string
  busy: boolean
  onCancel: () => void
  onApply: (blob: Blob) => void
}) {
  const t = useAdminT()
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [pixels, setPixels] = useState<Area | null>(null)

  const apply = async () => {
    if (!pixels || busy) return
    try {
      const blob = await getCroppedBlob(src, pixels)
      onApply(blob)
    } catch {
      /* onApply not called; leave modal open */
    }
  }

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/50 p-4" onClick={busy ? undefined : onCancel}>
      <div
        className="w-full max-w-[560px] rounded-4xl bg-page p-5 shadow-float"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-[17px] font-black text-ink">{t('blogs.crop.title')}</h3>
        <p className="mt-0.5 text-[13px] font-medium text-ink-2">{t('blogs.crop.hint')}</p>

        <div className="relative mt-3 h-[300px] w-full overflow-hidden rounded-2xl bg-espresso-dark">
          <Cropper
            image={src}
            crop={crop}
            zoom={zoom}
            aspect={16 / 9}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={(_, px) => setPixels(px)}
          />
        </div>

        <div className="mt-3 flex items-center gap-3">
          <span className="text-[11px] font-bold uppercase tracking-wide text-ink-3">{t('blogs.crop.zoom')}</span>
          <input
            type="range"
            min={1}
            max={3}
            step={0.01}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="h-1.5 flex-1 cursor-pointer accent-espresso"
          />
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={onCancel}
            disabled={busy}
            className="flex-1 rounded-2xl border border-line bg-white py-2.5 text-[14px] font-extrabold text-ink-2 disabled:opacity-40"
          >
            {t('blogs.crop.cancel')}
          </button>
          <button
            onClick={apply}
            disabled={busy || !pixels}
            className="flex-1 rounded-2xl bg-grad-espresso py-2.5 text-[14px] font-extrabold text-onEspresso shadow-glow disabled:opacity-40"
          >
            {busy ? t('blogs.crop.applying') : t('blogs.crop.apply')}
          </button>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Shared field wrapper + canvas crop helpers
// ---------------------------------------------------------------------------

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col rounded-2xl border border-line bg-cream px-4 py-2.5 focus-within:border-gold-soft">
      <span className="mb-0.5 text-[11px] font-bold uppercase tracking-wide text-ink-3">{label}</span>
      {children}
    </label>
  )
}

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.addEventListener('load', () => resolve(img))
    img.addEventListener('error', (e) => reject(e))
    img.src = url
  })
}

async function getCroppedBlob(src: string, crop: Area): Promise<Blob> {
  const image = await createImage(src)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas 2D context unavailable')
  canvas.width = Math.round(crop.width)
  canvas.height = Math.round(crop.height)
  ctx.drawImage(image, crop.x, crop.y, crop.width, crop.height, 0, 0, canvas.width, canvas.height)
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('toBlob returned null'))),
      'image/jpeg',
      0.9,
    )
  })
}
