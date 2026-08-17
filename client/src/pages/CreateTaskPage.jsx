import FeedbackAlert from '../components/common/FeedbackAlert'
import TaskForm from '../components/tasks/TaskForm'
import { useTaskContext } from '../context/useTaskContext'

function CreateTaskPage() {
  const { feedback, editingTaskId } = useTaskContext()

  return (
    <section className="mx-auto max-w-3xl p-6 md:p-12">
      <header className="mb-7">
        <p className="mb-2 text-xs font-bold tracking-wider text-slate-400">
          NOVA TAREFA
        </p>

        <h1 className="text-3xl font-bold tracking-tight">
          {editingTaskId ? 'Editar tarefa' : 'Criar uma tarefa'}
        </h1>

        <p className="mt-2 text-slate-500">
          Adicione os detalhes para manter seu trabalho organizado.
        </p>
      </header>

      <FeedbackAlert feedback={feedback} />

      <TaskForm />
    </section>
  )
}

export default CreateTaskPage