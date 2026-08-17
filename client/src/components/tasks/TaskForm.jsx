import { useTaskContext } from '../../context/useTaskContext'

function TaskForm() {
  const {
    activeAccount,
    taskForm,
    editingTaskId,
    updateTaskField,
    submitTask,
    cancelTaskEditing,
  } = useTaskContext()

  return (
    <article className="rounded-xl border border-slate-200 bg-white shadow-sm" aria-labelledby="task-form-title">
      <div className="p-6">
        <h2 id="task-form-title" className="mb-5 text-xl font-bold">
          {editingTaskId ? 'Editar tarefa' : 'Adicionar tarefa'}
        </h2>

        <form className="grid gap-4" onSubmit={submitTask}>
          <div>
            <label className="mb-1.5 block text-sm font-semibold" htmlFor="title">
              Titulo da tarefa
            </label>
            <input
              id="title"
              name="title"
              type="text"
              className="h-11 w-full rounded-lg border border-slate-300 px-3 outline-none focus:border-brand focus:ring-3 focus:ring-blue-100"
              value={taskForm.title}
              onChange={(event) => updateTaskField(event.target.name, event.target.value)}
              maxLength={120}
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold" htmlFor="description">
              Descricao
            </label>
            <textarea
              id="description"
              name="description"
              className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-brand focus:ring-3 focus:ring-blue-100"
              rows="4"
              value={taskForm.description}
              onChange={(event) => updateTaskField(event.target.name, event.target.value)}
              maxLength={500}
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2"><div>
            <label className="mb-1.5 block text-sm font-semibold" htmlFor="dueDate">
              Data limite
            </label>
            <input
              id="dueDate"
              name="dueDate"
              type="date"
              className="h-11 w-full rounded-lg border border-slate-300 px-3 outline-none focus:border-brand focus:ring-3 focus:ring-blue-100"
              value={taskForm.dueDate}
              onChange={(event) => updateTaskField(event.target.name, event.target.value)}
              required
            />
          </div><div>
            <label className="mb-1.5 block text-sm font-semibold" htmlFor="priority">
              Prioridade
            </label>
            <select
              id="priority"
              name="priority"
              className="h-11 w-full rounded-lg border border-slate-300 px-3 outline-none focus:border-brand focus:ring-3 focus:ring-blue-100"
              value={taskForm.priority}
              onChange={(event) => updateTaskField(event.target.name, event.target.value)}
              required
            >
              <option value="baixa">Baixa</option>
              <option value="media">Média</option>
              <option value="alta">Alta</option>
            </select>
          </div></div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold" htmlFor="status">
              Status
            </label>
            <select
              id="status"
              name="status"
              className="h-11 w-full rounded-lg border border-slate-300 px-3 outline-none focus:border-brand focus:ring-3 focus:ring-blue-100"
              value={taskForm.status}
              onChange={(event) => updateTaskField(event.target.name, event.target.value)}
              required
            >
              <option value="pendente">Pendente</option>
              <option value="em_andamento">Em andamento</option>
              <option value="concluida">Concluída</option>
            </select>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button type="submit" className="h-11 flex-1 rounded-lg bg-brand px-4 text-sm font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50" disabled={!activeAccount}>
              {editingTaskId ? 'Salvar' : 'Adicionar'}
            </button>

            {editingTaskId && (
              <button type="button" className="h-11 rounded-lg border border-slate-300 px-4 font-bold" onClick={cancelTaskEditing}>
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>
    </article>
  )
}

export default TaskForm
