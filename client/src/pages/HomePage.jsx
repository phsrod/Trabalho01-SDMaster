import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import FeedbackAlert from '../components/common/FeedbackAlert'
import Icon from '../components/common/Icon'
import { useTaskContext } from '../context/useTaskContext'
import {
  priorityLabels,
  priorityStyles,
  statusLabels,
  statusStyles,
  priorityWeight,
  defaultBadgeStyle,
} from '../constants'

function getTaskScore(task) {
  const daysLeft = Math.max(
    (new Date(task.dueDate) - new Date()) / (1000 * 60 * 60 * 24),
    0
  )
  const priority = priorityWeight[task.priority] ?? 1
  return (30 - daysLeft) * 10 + priority
}

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Bom dia'
  if (hour < 18) return 'Boa tarde'
  return 'Boa noite'
}

function StatCard({ icon, iconBg, label, count, hint }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <span className={`inline-block rounded-full p-2 ${iconBg}`}>
        <Icon name={icon} />
      </span>
      <p className="mt-3 text-sm font-semibold text-slate-500">{label}</p>
      <strong className="block text-4xl">{String(count).padStart(2, '0')}</strong>
      <small className="text-slate-400">{hint}</small>
    </article>
  )
}

function FocusTaskItem({ task }) {
  return (
    <div className="border-b p-5 last:border-0">
      <h3 className="font-bold">{task.title}</h3>

      {task.description && (
        <p className="mt-1 text-sm text-slate-500">{task.description}</p>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
        <span className={`rounded-full px-2.5 py-0.5 text-xs ${priorityStyles[task.priority] ?? defaultBadgeStyle}`}>
          {priorityLabels[task.priority]}
        </span>
        <span className={`rounded-full px-2.5 py-0.5 text-xs ${statusStyles[task.status] ?? defaultBadgeStyle}`}>
          {statusLabels[task.status]}
        </span>
        <span className="text-slate-400">Data limite: {task.dueDate}</span>
      </div>
    </div>
  )
}

function HomePage() {
  const { tasks, activeUserName, feedback } = useTaskContext()

  const stats = useMemo(() => ({
    pending: tasks.filter((t) => t.status === 'pendente').length,
    inProgress: tasks.filter((t) => t.status === 'em_andamento').length,
    completed: tasks.filter((t) => t.status === 'concluida').length,
  }), [tasks])

  const focusTasks = useMemo(() =>
    tasks
      .filter((task) => task.status !== 'concluida')
      .sort((a, b) => getTaskScore(b) - getTaskScore(a))
      .slice(0, 3),
    [tasks]
  )

  return (
    <section className="mx-auto max-w-6xl p-6 md:p-12">
      <FeedbackAlert feedback={feedback} />

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
        <StatCard
          icon="clock"
          iconBg="bg-red-50 text-red-700"
          label="Pendentes"
          count={stats.pending}
          hint="Para organizar hoje"
        />
        <StatCard
          icon="spark"
          iconBg="bg-amber-50 text-amber-700"
          label="Em andamento"
          count={stats.inProgress}
          hint="Foco para esta tarde"
        />
        <StatCard
          icon="check"
          iconBg="bg-emerald-50 text-emerald-700"
          label="Concluídas"
          count={stats.completed}
          hint="Continue nesse ritmo."
        />
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
              <FocusTaskItem key={task.id} task={task} />
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
