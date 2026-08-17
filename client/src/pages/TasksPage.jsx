import FeedbackAlert from '../components/common/FeedbackAlert'
import TaskList from '../components/tasks/TaskList'
import { useTaskContext } from '../context/useTaskContext'

function TasksPage() {
  const { feedback, tasks } = useTaskContext()

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

      <TaskList />
    </section>
  )
}

export default TasksPage