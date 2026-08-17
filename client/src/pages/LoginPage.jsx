import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useTaskContext } from '../context/useTaskContext'

function LoginPage() {
  const { activeAccount, loginUser } = useTaskContext()
  const navigate = useNavigate()

  const [error, setError] = useState('')
  const [form, setForm] = useState({
    email: '',
    password: ''
  })

  if (activeAccount) {
    return <Navigate to="/" replace />
  }

  function handleSubmit(event) {
    event.preventDefault()

    const result = loginUser(
      form.email,
      form.password
    )

    if (!result.success) {
      setError(result.message)
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

            <input
              className="h-11 rounded-lg border border-slate-300 px-3 outline-none focus:border-brand focus:ring-3 focus:ring-blue-100"
              id="login-password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleFieldChange}
              autoComplete="current-password"
              required
            />
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