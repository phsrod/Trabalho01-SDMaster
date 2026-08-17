import { useMemo, useState } from 'react'
import Icon from '../components/common/Icon'
import TaskList from '../components/tasks/TaskList'
import { useTaskContext } from '../context/useTaskContext'

function SearchTaskPage() {
  const { tasks } = useTaskContext()

  const [query, setQuery] = useState('')
  const [priority, setPriority] = useState('todas')

  const results = useMemo(() => {
    const normalizedQuery = query.toLowerCase()

    return tasks.filter((task) => {
      const matchesQuery = (
        task.title + task.description
      )
        .toLowerCase()
        .includes(normalizedQuery)

      const matchesPriority =
        priority === 'todas' ||
        task.priority === priority

      return matchesQuery && matchesPriority
    })
  }, [tasks, query, priority])

  return (
    <section className="mx-auto max-w-6xl p-6 md:p-12">
      <header className="mb-7">
        <p className="mb-2 text-xs font-bold tracking-wider text-slate-400">
          ENCONTRE RAPIDAMENTE
        </p>

        <h1 className="text-3xl font-bold tracking-tight">
          Buscar uma tarefa
        </h1>

        <p className="mt-2 text-slate-500">
          Pesquise por título, descrição ou prioridade.
        </p>
      </header>

      <div className="mb-5 flex flex-col gap-3 sm:flex-row">
        <label
          className="sr-only"
          htmlFor="task-search"
        >
          Pesquisar
        </label>

        <input
          className="h-11 flex-1 rounded-lg border border-slate-300 bg-white px-3 outline-none focus:border-brand focus:ring-3 focus:ring-blue-100"
          id="task-search"
          type="search"
          autoFocus
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Pesquisar uma tarefa"
        />

        <div className="relative">
          <label
            className="sr-only"
            htmlFor="priority-filter"
          >
            Filtrar por prioridade
          </label>

          <select
            className="h-11 w-full appearance-none rounded-lg border border-slate-300 bg-white py-0 pl-3 pr-10 outline-none sm:w-56"
            id="priority-filter"
            value={priority}
            onChange={(event) => setPriority(event.target.value)}
          >
            <option value="todas">
              Todas as prioridades
            </option>

            <option value="alta">
              Alta
            </option>

            <option value="media">
              Média
            </option>

            <option value="baixa">
              Baixa
            </option>
          </select>

          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-600">
            <Icon name="chevron-down" size={17} />
          </span>
        </div>
      </div>

      <TaskList
        tasks={results}
        emptyMessage="Nenhuma tarefa encontrada com estes filtros."
      />
    </section>
  )
}

export default SearchTaskPage