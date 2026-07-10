import { useState } from 'react'
import { api, setToken, ApiError } from './api'

export default function Login({ onSuccess }: { onSuccess: () => void }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (busy) return
    setError('')
    setBusy(true)
    try {
      const res = await api.login(username.trim(), password)
      setToken(res.token)
      onSuccess()
    } catch (err) {
      setBusy(false)
      if (err instanceof ApiError && err.status === 401) {
        setError('Неверный логин или пароль')
      } else {
        setError('Не удалось войти. Проверьте соединение с сервером.')
      }
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-page px-5">
      <div className="pointer-events-none fixed inset-x-0 -top-[10%] -z-10 h-[520px]"
        style={{
          background:
            'radial-gradient(760px 460px at 80% 0%, rgba(203,154,92,0.16), rgba(203,154,92,0) 62%)',
        }}
      />
      <form
        onSubmit={submit}
        className="w-full max-w-[400px] rounded-5xl border border-hair bg-white p-8 shadow-float"
      >
        <div className="mb-7 flex items-center gap-2.5">
          <img src="/logo.svg" alt="Sevil" className="h-11 w-11 rounded-[12px] shadow-soft" />
          <div>
            <div className="text-[19px] font-black -tracking-[0.02em] text-espresso">Sevil</div>
            <div className="text-[12px] font-bold uppercase tracking-wide text-gold">Admin</div>
          </div>
        </div>

        <h1 className="text-[22px] font-black text-ink">Вход в панель</h1>
        <p className="mt-1 text-[14px] font-medium text-ink-2">Введите логин и пароль администратора.</p>

        <div className="mt-6 flex flex-col gap-3">
          <Input label="Логин" value={username} onChange={setUsername} type="text" autoFocus />
          <Input label="Пароль" value={password} onChange={setPassword} type="password" />
        </div>

        {error && (
          <div className="mt-4 rounded-2xl bg-like/[0.12] px-4 py-3 text-[13px] font-semibold text-like">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={busy}
          className="mt-6 w-full rounded-2xl bg-grad-espresso py-3.5 text-[15px] font-extrabold text-onEspresso shadow-glow transition-transform duration-200 ease-out hover:-translate-y-0.5 disabled:opacity-60"
        >
          {busy ? 'Вход…' : 'Войти'}
        </button>
      </form>
    </div>
  )
}

function Input({
  label,
  value,
  onChange,
  type,
  autoFocus,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type: string
  autoFocus?: boolean
}) {
  return (
    <label className="flex flex-col rounded-2xl border border-line bg-cream px-4 py-2.5 focus-within:border-gold-soft">
      <span className="text-[11px] font-bold uppercase tracking-wide text-ink-3">{label}</span>
      <input
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus={autoFocus}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent text-[15px] font-semibold text-ink outline-none placeholder:text-ink-3"
      />
    </label>
  )
}
