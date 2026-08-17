import { useMemo, useState } from 'react'
import { TaskContext } from './taskContext'

const STORAGE_KEY = 'tasks_by_account_v1'
const USERS_STORAGE_KEY = 'taskly_users_v1'
const SESSION_STORAGE_KEY = 'taskly_session_v1'
const STATUS_ORDER = {
  pendente: 1,
  em_andamento: 2,
  concluida: 3,
}

const EMPTY_TASK_FORM = {
  title: '',
  description: '',
  dueDate: '',
  priority: 'media',
  status: 'pendente',
}

const SAMPLE_TASKS = [
  { id: 'sample-1', title: 'Revisar proposta de identidade visual', description: 'Ajustar os últimos elementos e organizar os arquivos de apresentação.', dueDate: '2026-08-16', priority: 'alta', status: 'em_andamento' },
  { id: 'sample-2', title: 'Preparar pauta da reunião semanal', description: 'Definir prioridades, entregas e pontos que precisam de decisão.', dueDate: '2026-08-17', priority: 'media', status: 'pendente' },
  { id: 'sample-3', title: 'Organizar referências do projeto Aurora', description: 'Consolidar imagens aprovadas e registrar os links de origem.', dueDate: '2026-08-19', priority: 'baixa', status: 'pendente' },
  { id: 'sample-4', title: 'Atualizar cronograma do projeto', description: 'Registrar as entregas concluídas nesta semana.', dueDate: '2026-08-15', priority: 'media', status: 'concluida' },
]

function loadTasksByAccount() {
  const raw = localStorage.getItem(STORAGE_KEY)

  if (!raw) {
    return { 'meu-espaco': SAMPLE_TASKS }
  }

  try {
    const parsed = JSON.parse(raw)
    return typeof parsed === 'object' && parsed !== null ? parsed : {}
  } catch {
    return { 'meu-espaco': SAMPLE_TASKS }
  }
}

function saveTasksByAccount(tasksByAccount) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasksByAccount))
}

function loadUsers() {
  const raw = localStorage.getItem(USERS_STORAGE_KEY)
  if (!raw) return []

  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function loadSession() {
  return localStorage.getItem(SESSION_STORAGE_KEY) || ''
}

function normalizeTask(form) {
  return {
    title: form.title.trim(),
    description: form.description.trim(),
    dueDate: form.dueDate,
    priority: form.priority,
    status: form.status,
  }
}

function validateTaskForm(form) {
  if (!form.title.trim()) return 'Informe o titulo da tarefa.'
  if (!form.description.trim()) return 'Informe a descricao da tarefa.'
  if (!form.dueDate) return 'Informe a data limite da tarefa.'
  if (!form.priority) return 'Informe a prioridade da tarefa.'
  if (!form.status) return 'Informe o status da tarefa.'
  return ''
}

export function TaskProvider({ children }) {
  const [activeAccount, setActiveAccount] = useState(loadSession)
  const [tasksByAccount, setTasksByAccount] = useState(loadTasksByAccount)
  const [taskForm, setTaskForm] = useState(EMPTY_TASK_FORM)
  const [editingTaskId, setEditingTaskId] = useState(null)
  const [feedback, setFeedback] = useState({ type: '', message: '' })

  const tasks = useMemo(() => {
    if (!activeAccount) return []

    const accountTasks = tasksByAccount[activeAccount] || []

    return [...accountTasks].sort((a, b) => {
      const statusDiff = STATUS_ORDER[a.status] - STATUS_ORDER[b.status]
      if (statusDiff !== 0) return statusDiff
      return a.dueDate.localeCompare(b.dueDate)
    })
  }, [activeAccount, tasksByAccount])

  function setMessage(type, message) {
    setFeedback({ type, message })
  }

  function resetTaskForm() {
    setTaskForm(EMPTY_TASK_FORM)
    setEditingTaskId(null)
  }

  function updateTasksForAccount(nextTasks) {
    setTasksByAccount((current) => {
      const updated = {
        ...current,
        [activeAccount]: nextTasks,
      }
      saveTasksByAccount(updated)
      return updated
    })
  }

  function loginUser(email, password) {
    const normalizedEmail = email.trim().toLowerCase()
    const user = loadUsers().find((item) => item.email === normalizedEmail && item.password === password)

    if (!user) {
      return { success: false, message: 'E-mail ou senha invalidos.' }
    }

    setActiveAccount(user.id)
    localStorage.setItem(SESSION_STORAGE_KEY, user.id)
    return { success: true }
  }

  function registerUser(name, email, password) {
    const normalizedName = name.trim()
    const normalizedEmail = email.trim().toLowerCase()

    if (!normalizedName || !normalizedEmail || !password) {
      return { success: false, message: 'Preencha todos os campos.' }
    }

    if (password.length < 6) {
      return { success: false, message: 'A senha deve ter pelo menos 6 caracteres.' }
    }

    const users = loadUsers()
    if (users.some((user) => user.email === normalizedEmail)) {
      return { success: false, message: 'Este e-mail ja esta cadastrado.' }
    }

    const user = { id: crypto.randomUUID(), name: normalizedName, email: normalizedEmail, password }
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([...users, user]))
    setActiveAccount(user.id)
    localStorage.setItem(SESSION_STORAGE_KEY, user.id)
    return { success: true }
  }

  function logoutAccount() {
    setActiveAccount('')
    resetTaskForm()
    localStorage.removeItem(SESSION_STORAGE_KEY)
  }

  function updateTaskField(name, value) {
    setTaskForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  function submitTask(event) {
    event.preventDefault()

    if (!activeAccount) {
      setMessage('danger', 'Selecione uma conta para criar tarefas.')
      return
    }

    const validationError = validateTaskForm(taskForm)
    if (validationError) {
      setMessage('danger', validationError)
      return
    }

    const normalizedTask = normalizeTask(taskForm)

    if (editingTaskId) {
      const updatedTasks = tasks.map((task) => {
        if (task.id !== editingTaskId) return task
        return {
          ...task,
          ...normalizedTask,
          updatedAt: new Date().toISOString(),
        }
      })

      updateTasksForAccount(updatedTasks)
      resetTaskForm()
      setMessage('success', 'Tarefa atualizada com sucesso.')
      return
    }

    const newTask = {
      id: crypto.randomUUID(),
      ...normalizedTask,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    updateTasksForAccount([...tasks, newTask])
    resetTaskForm()
    setMessage('success', 'Tarefa criada com sucesso.')
  }

  function startTaskEdit(taskId) {
    const task = tasks.find((item) => item.id === taskId)

    if (!task) {
      setMessage('danger', 'Nao foi possivel localizar a tarefa.')
      return
    }

    setTaskForm({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      priority: task.priority,
      status: task.status,
    })
    setEditingTaskId(task.id)
    setMessage('success', `Editando tarefa: ${task.title}`)
  }

  function deleteTask(taskId) {
    const task = tasks.find((item) => item.id === taskId)

    if (!task) {
      setMessage('danger', 'Nao foi possivel localizar a tarefa.')
      return
    }

    const updatedTasks = tasks.filter((item) => item.id !== taskId)
    updateTasksForAccount(updatedTasks)

    if (editingTaskId === taskId) {
      resetTaskForm()
    }

    setMessage('success', `Tarefa "${task.title}" removida com sucesso.`)
  }

  function toggleTaskStatus(taskId) {
    const updatedTasks = tasks.map((task) => task.id === taskId
      ? { ...task, status: task.status === 'concluida' ? 'pendente' : 'concluida', updatedAt: new Date().toISOString() }
      : task)
    updateTasksForAccount(updatedTasks)
  }

  function cancelTaskEditing() {
    resetTaskForm()
    setMessage('success', 'Edicao cancelada.')
  }

  const contextValue = {
    activeAccount,
    tasks,
    taskForm,
    editingTaskId,
    feedback,
    loginUser,
    registerUser,
    logoutAccount,
    updateTaskField,
    submitTask,
    startTaskEdit,
    deleteTask,
    toggleTaskStatus,
    cancelTaskEditing,
  }

  return <TaskContext.Provider value={contextValue}>{children}</TaskContext.Provider>
}
