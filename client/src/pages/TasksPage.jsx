import { useMemo, useState } from 'react'
import FeedbackAlert from '../components/common/FeedbackAlert'
import Icon from '../components/common/Icon'
import TaskList from '../components/tasks/TaskList'
import { useTaskContext } from '../context/useTaskContext'

function TasksPage() {
  const { feedback, tasks } = useTaskContext()

  const [query, setQuery] = useState('')
  const [priority, setPriority] = useState('todas')
  const [status, setStatus] = useState('todos')

  const filteredTasks = useMemo(() => {
    const normalizedQuery = query.toLowerCase()

    return tasks.filter((task) => {
      const matchesQuery = (
        task.title + (task.description || '')
      )
        .toLowerCase()
        .includes(normalizedQuery)

      const matchesPriority =
        priority === 'todas' || task.priority === priority

      const matchesStatus =
        status === 'todos' || task.status === status

      return matchesQuery && matchesPriority && matchesStatus
    })
  }, [tasks, query, priority, status])

  const hasFilters = query || priority !== 'todas' || status !== 'todos'

  const taskCountMessage =
    tasks.length === 1
      ? 'tarefa cadastrada'
      : 'tarefas cadastradas'

  return (
    <section className="mx-auto max-w-6xl p-6 md:p-12">
      <header className="mb-7">
        <p className="mb-2 text-xs font-bold tracking-wider text-slate-400">
          SEU PLANEJAMENTO
        </p>

        <h1 className="text-3xl font-bold tracking-tight">
          Minhas tarefas
        </h1>

        <p className="mt-2 text-slate-500">
          {tasks.length} {taskCountMessage} no seu espaço.
        </p>
      </header>

      <FeedbackAlert feedback={feedback} />

      <div className="mb-5 flex flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor="task-search">
          Pesquisar
        </label>

        <input
          className="h-11 flex-1 rounded-lg border border-slate-300 bg-white px-3 outline-none focus:border-brand focus:ring-3 focus:ring-blue-100"
          id="task-search"
          type="search"
          autoFocus
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Pesquisar por título ou descrição"
        />

        <div className="relative">
          <label className="sr-only" htmlFor="priority-filter">
            Filtrar por prioridade
          </label>

          <select
            className="h-11 w-full appearance-none rounded-lg border border-slate-300 bg-white py-0 pl-3 pr-10 outline-none sm:w-56"
            id="priority-filter"
            value={priority}
            onChange={(event) => setPriority(event.target.value)}
          >
            <option value="todas">Todas as prioridades</option>
            <option value="alta">Alta</option>
            <option value="media">Média</option>
            <option value="baixa">Baixa</option>
          </select>

          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-600">
            <Icon name="chevron-down" size={17} />
          </span>
        </div>

        <div className="relative">
          <label className="sr-only" htmlFor="status-filter">
            Filtrar por status
          </label>

          <select
            className="h-11 w-full appearance-none rounded-lg border border-slate-300 bg-white py-0 pl-3 pr-10 outline-none sm:w-56"
            id="status-filter"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <option value="todos">Todos os status</option>
            <option value="pendente">Pendente</option>
            <option value="em_andamento">Em andamento</option>
            <option value="concluida">Concluída</option>
          </select>

          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-600">
            <Icon name="chevron-down" size={17} />
          </span>
        </div>
      </div>

      <TaskList
        tasks={filteredTasks}
        emptyMessage={hasFilters ? 'Nenhuma tarefa encontrada com estes filtros.' : undefined}
      />
    </section>
  )
}

export default TasksPage