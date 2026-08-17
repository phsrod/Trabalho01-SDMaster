import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <section className="grid min-h-screen place-items-center bg-page p-6 text-center">
      <article className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="mb-2 text-xs font-bold tracking-wider text-slate-400">
          404
        </p>

        <h2 className="mb-2 text-2xl font-bold">
          Página não encontrada
        </h2>

        <p className="mb-6 text-slate-500">
          A rota acessada não existe.
        </p>

        <Link
          to="/"
          className="inline-flex rounded-lg bg-brand px-4 py-2.5 text-sm font-bold text-white"
        >
          Voltar para início
        </Link>
      </article>
    </section>
  )
}

export default NotFoundPage