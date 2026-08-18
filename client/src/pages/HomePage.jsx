import { Link } from 'react-router-dom'
import Icon from '../components/common/Icon'
import { useTaskContext } from '../context/useTaskContext'

const labels = {
  pendente: 'Pendente',
  em_andamento: 'Em andamento'
}

const priorityLabels = {
  alta: 'Alta',
  media: 'Média',
  baixa: 'Baixa'
}

const priorityStyles = {
  alta: 'bg-red-50 text-red-700 border border-red-200',
  media: 'bg-amber-50 text-amber-700 border border-amber-200',
  baixa: 'bg-emerald-50 text-emerald-700 border border-emerald-200'
}

const statusStyles = {
  pendente: 'bg-red-50 text-red-700 border border-red-200',
  em_andamento: 'bg-amber-50 text-amber-700 border border-amber-200',
  concluida: 'bg-emerald-50 text-emerald-700 border border-emerald-200'
}

const priorityWeight = { alta: 3, media: 2, baixa: 1 }

function getTaskScore(task) {
  const daysLeft = Math.max(
    (new Date(task.dueDate) - new Date()) / (1000 * 60 * 60 * 24),
    0
  )
  const priority = priorityWeight[task.priority] ?? 1
  // Mais urgente = mais pontos; prioridade desempata
  return (30 - daysLeft) * 10 + priority
}

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Bom dia'
  if (hour < 18) return 'Boa tarde'
  return 'Boa noite'
}

function HomePage() {
  const { tasks, activeUserName } = useTaskContext()

  const pending = tasks.filter(
    (task) => task.status === 'pendente'
  ).length

  const inProgress = tasks.filter(
    (task) => task.status === 'em_andamento'
  ).length

  const completed = tasks.filter(
    (task) => task.status === 'concluida'
  ).length

  const focusTasks = tasks
    .filter((task) => task.status !== 'concluida')
    .sort((a, b) => getTaskScore(b) - getTaskScore(a))
    .slice(0, 3)

  return (
    <section className="mx-auto max-w-6xl p-6 md:p-12">
      <header className="mb-9 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-bold tracking-wider text-slate-400">
            SEU PLANEJAMENTO
          </p>

          <h1 className="text-3xl font-bold tracking-tight">
            {getGreeting()}{activeUserName ? `, ${activeUserName}` : ''}.
          </h1>
        </div>

        <Link
          to="/criar-tarefa"
          className="flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-bold text-white"
        >
          <Icon name="plus" size={16} />
          Criar tarefa
        </Link>
      </header>

      <div className="mb-5 grid gap-4 md:grid-cols-3">
        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <span className="inline-block rounded-full bg-red-50 p-2 text-red-700">
            <Icon name="clock" />
          </span>

          <p className="mt-3 text-sm font-semibold text-slate-500">
            Pendentes
          </p>

          <strong className="block text-4xl">
            {String(pending).padStart(2, '0')}
          </strong>

          <small className="text-slate-400">
            Para organizar hoje
          </small>
        </article>

        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <span className="inline-block rounded-full bg-amber-50 p-2 text-amber-700">
            <Icon name="spark" />
          </span>

          <p className="mt-3 text-sm font-semibold text-slate-500">
            Em andamento
          </p>

          <strong className="block text-4xl">
            {String(inProgress).padStart(2, '0')}
          </strong>

          <small className="text-slate-400">
            Foco para esta tarde
          </small>
        </article>

        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <span className="inline-block rounded-full bg-emerald-50 p-2 text-emerald-700">
            <Icon name="check" />
          </span>

          <p className="mt-3 text-sm font-semibold text-slate-500">
            Concluídas
          </p>

          <strong className="block text-4xl">
            {String(completed).padStart(2, '0')}
          </strong>

          <small className="text-slate-400">
            Continue nesse ritmo.
          </small>
        </article>
      </div>

      <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b p-6">
          <div>
            <p className="text-xs font-bold tracking-wider text-slate-400">
              LISTA ATIVA
            </p>

            <h2 className="mt-1 text-xl font-bold">
              Tarefas em foco ({focusTasks.length})
            </h2>
          </div>

          <Link
            className="flex items-center gap-1 text-sm font-bold text-brand"
            to="/tarefas"
          >
            Ver todas
            <Icon name="arrow" size={15} />
          </Link>
        </div>

        <div>
          {focusTasks.length ? (
            focusTasks.map((task) => (
              <div
                className="border-b p-5 last:border-0"
                key={task.id}
              >
                <h3 className="font-bold">
                  {task.title}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {task.description}
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs ${priorityStyles[task.priority] ?? 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                    {priorityLabels[task.priority]}
                  </span>

                  <span className={`rounded-full px-2.5 py-0.5 text-xs ${statusStyles[task.status] ?? 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                    {labels[task.status]}
                  </span>

                  <span className="text-slate-400">
                    Data limite: {task.dueDate}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="p-6 text-slate-500">
              Você está com tudo em dia.
            </p>
          )}
        </div>
      </article>
    </section>
  )
}

export default HomePage