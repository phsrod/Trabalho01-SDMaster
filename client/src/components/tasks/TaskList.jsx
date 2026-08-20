import { useNavigate } from 'react-router-dom'
import { useTaskContext } from '../../context/useTaskContext'
import Icon from '../common/Icon'
import {
  priorityLabels,
  priorityStyles,
  statusLabels,
  statusStyles,
  defaultBadgeStyle,
} from '../../constants'

function Badge({ label, style }) {
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs ${style}`}>
      {label}
    </span>
  )
}

function TaskItem({ task }) {
  const { startTaskEdit, deleteTask, toggleTaskStatus } = useTaskContext()
  const navigate = useNavigate()

  const isCompleted = task.status === 'concluida'

  return (
    <div className="grid gap-3 border-b border-slate-100 p-5 last:border-0 sm:grid-cols-[24px_minmax(0,1fr)_auto]">
      <button
        type="button"
        className={`grid size-5 place-items-center rounded-full border ${
          isCompleted
            ? 'border-emerald-600 bg-emerald-600 text-white'
            : 'border-slate-300 text-transparent'
        }`}
        onClick={() => toggleTaskStatus(task.id)}
        aria-label={
          isCompleted
            ? `Marcar ${task.title} como não concluída`
            : `Marcar ${task.title} como concluída`
        }
      >
        <Icon name="check" size={12} />
      </button>

      <div>
        <div className="flex flex-wrap justify-between gap-2">
          <h3 className="font-bold">{task.title}</h3>
          <time className="text-xs text-slate-400" dateTime={task.dueDate}>
            Data limite: {task.dueDate.split('-').reverse().join('/')}
          </time>
        </div>

        {task.description && (
          <p className="mt-1 text-sm text-slate-500">{task.description}</p>
        )}

        <div className="mt-3 flex gap-2 text-xs font-semibold">
          <Badge
            label={priorityLabels[task.priority]}
            style={priorityStyles[task.priority] ?? defaultBadgeStyle}
          />
          <Badge
            label={statusLabels[task.status]}
            style={statusStyles[task.status] ?? defaultBadgeStyle}
          />
        </div>
      </div>

      <div className="flex gap-2 sm:items-center">
        <button
          type="button"
          className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100"
          onClick={() => {
            startTaskEdit(task.id)
            requestAnimationFrame(() => navigate('/criar-tarefa'))
          }}
        >
          Editar
        </button>

        <button
          type="button"
          className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700 hover:bg-red-100"
          onClick={() => deleteTask(task.id)}
        >
          Excluir
        </button>
      </div>
    </div>
  )
}

function TaskList({
  tasks: suppliedTasks,
  emptyMessage = 'Ainda não existem tarefas.',
}) {
  const { tasks } = useTaskContext()
  const visibleTasks = suppliedTasks ?? tasks

  return (
    <article
      className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
      aria-labelledby="task-list-title"
    >
      <div className="flex items-center justify-between border-b border-slate-200 p-6">
        <div>
          <p className="mb-1 text-xs font-bold tracking-wider text-slate-400">
            LISTA COMPLETA
          </p>
          <h2 id="task-list-title" className="text-xl font-bold">
            Minhas tarefas
          </h2>
        </div>

        <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-bold text-brand">
          {visibleTasks.length}
        </span>
      </div>

      {visibleTasks.length === 0 ? (
        <p className="p-7 text-slate-500">{emptyMessage}</p>
      ) : (
        <div>
          {visibleTasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </div>
      )}
    </article>
  )
}

export default TaskList
