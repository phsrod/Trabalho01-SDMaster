import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useTaskContext } from '../context/useTaskContext'
import Icon from '../components/common/Icon'

function LoginPage() {
  const { activeAccount, loginUser } = useTaskContext()
  const navigate = useNavigate()

  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({
    email: '',
    password: ''
  })

  useEffect(() => {
    if (!error) return

    const timer = setTimeout(() => {
      setError('')
    }, 10000)

    return () => clearTimeout(timer)
  }, [error])

  if (activeAccount) {
    return <Navigate to="/" replace />
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const result = await loginUser(
      form.email,
      form.password
    )

    if (!result.success) {
      setError(result.message)
      setForm({ email: '', password: '' })
      return
    }

    navigate('/', { replace: true })
  }

  function handleFieldChange(event) {
    const { name, value } = event.target

    setForm((previous) => ({
      ...previous,
      [name]: value
    }))
  }

  return (
    <main className="grid min-h-screen place-items-center bg-page p-4">
      <section
        className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-sm"
        aria-labelledby="login-title"
      >
        <div className="mb-8 flex items-center justify-center gap-2 text-xl font-bold">
          <span className="grid size-8 place-items-center rounded-lg bg-brand text-white">
            T
          </span>
          Task Manager
        </div>

        <h1
          id="login-title"
          className="text-center text-2xl font-bold"
        >
          Entrar
        </h1>

        <p className="mb-7 mt-2 text-center text-sm text-slate-500">
          Informe seus dados para acessar suas tarefas.
        </p>

        <form
          className="grid gap-4"
          onSubmit={handleSubmit}
        >
          {error && (
            <p
              className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
              role="alert"
            >
              {error}
            </p>
          )}

          <label
            className="grid gap-1.5 text-sm font-semibold"
            htmlFor="login-email"
          >
            E-mail

            <input
              className="h-11 rounded-lg border border-slate-300 px-3 outline-none focus:border-brand focus:ring-3 focus:ring-blue-100"
              id="login-email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleFieldChange}
              autoComplete="email"
              required
            />
          </label>

          <label
            className="grid gap-1.5 text-sm font-semibold"
            htmlFor="login-password"
          >
            Senha

            <div className="relative">
              <input
                className="h-11 w-full rounded-lg border border-slate-300 px-3 pr-11 outline-none focus:border-brand focus:ring-3 focus:ring-blue-100"
                id="login-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={handleFieldChange}
                autoComplete="current-password"
                required
              />

              <button
                type="button"
                className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-md text-slate-500 hover:text-slate-700"
                onClick={() => setShowPassword((previous) => !previous)}
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              >
                <Icon name={showPassword ? 'eye-off' : 'eye'} size={18} />
              </button>
            </div>
          </label>

          <button
            className="mt-1 h-11 rounded-lg bg-brand text-sm font-bold text-white hover:bg-blue-700"
            type="submit"
          >
            Entrar
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Não possui uma conta?{' '}
          <Link
            className="font-bold text-brand underline"
            to="/cadastro"
          >
            Criar conta
          </Link>
        </p>
      </section>
    </main>
  )
}

export default LoginPage