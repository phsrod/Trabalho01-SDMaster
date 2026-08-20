import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { TaskContext } from './taskContext'
import { supabase } from '../supabaseClient'
import * as api from '../api'
import { statusOrder, EMPTY_TASK_FORM } from '../constants'

function sortTasks(tasks) {
  return [...tasks].sort((a, b) => {
    const statusDiff = statusOrder[a.status] - statusOrder[b.status]
    if (statusDiff !== 0) return statusDiff
    return a.dueDate.localeCompare(b.dueDate)
  })
}

function normalizeTask(form) {
  return {
    title: form.title.trim(),
    description: form.description.trim() || null,
    dueDate: form.dueDate,
    priority: form.priority,
    status: form.status,
  }
}

function validateTaskForm(form) {
  if (!form.title.trim()) return 'Informe o título da tarefa.'
  if (!form.dueDate) return 'Informe a data limite da tarefa.'
  if (!form.priority) return 'Informe a prioridade da tarefa.'
  if (!form.status) return 'Informe o status da tarefa.'
  return ''
}

export function TaskProvider({ children }) {
  const [activeAccount, setActiveAccount] = useState('')
  const [activeUserName, setActiveUserName] = useState('')
  const [tasks, setTasks] = useState([])
  const [taskForm, setTaskForm] = useState(EMPTY_TASK_FORM)
  const [editingTaskId, setEditingTaskId] = useState(null)
  const [feedback, setFeedback] = useState({ type: '', message: '' })
  const feedbackTimeoutRef = useRef(null)

  // Limpa o timeout do feedback ao desmontar
  useEffect(() => {
    return () => {
      if (feedbackTimeoutRef.current) {
        clearTimeout(feedbackTimeoutRef.current)
      }
    }
  }, [])

  const setMessage = useCallback((type, message) => {
    setFeedback({ type, message })

    if (feedbackTimeoutRef.current) {
      clearTimeout(feedbackTimeoutRef.current)
    }

    feedbackTimeoutRef.current = setTimeout(() => {
      setFeedback({ type: '', message: '' })
    }, 10000)
  }, [])

  async function applySession(session) {
    if (!session?.user) return

    const email = session.user.email || session.user.id
    setActiveAccount(email)

    let name = session.user.user_metadata?.name || ''

    if (!name) {
      const { data: freshUser } = await supabase.auth.getUser()
      name = freshUser?.user?.user_metadata?.name || ''
    }

    // Se não tem nome, usa a parte antes do @ como fallback
    if (!name && email.includes('@')) {
      name = email.split('@')[0]
      await supabase.auth.updateUser({ data: { name } })
    }

    setActiveUserName(name)
  }

  const refreshTasks = useCallback(async () => {
    try {
      const fetchedTasks = await api.listTasks()
      setTasks(sortTasks(fetchedTasks))
    } catch (error) {
      setMessage('danger', error.message || 'Não foi possível carregar as tarefas.')
    }
  }, [setMessage])

  // Restaura sessão ao carregar
  useEffect(() => {
    async function restoreSession() {
      const { data } = await supabase.auth.getSession()
      if (data.session) {
        await applySession(data.session)
        refreshTasks()
      }
    }
    restoreSession()
  }, [refreshTasks])

  function resetTaskForm() {
    setTaskForm(EMPTY_TASK_FORM)
    setEditingTaskId(null)
  }

  // ─── Autenticação ──────────────────────────────────────────────

  async function loginUser(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    })

    if (error || !data.session) {
      return { success: false, message: 'E-mail ou senha inválidos.' }
    }

    await applySession(data.session)
    await refreshTasks()
    return { success: true }
  }

  async function registerUser(name, email, password) {
    const normalizedName = name.trim()
    const normalizedEmail = email.trim().toLowerCase()

    if (!normalizedName || !normalizedEmail || !password) {
      return { success: false, message: 'Preencha todos os campos.' }
    }

    if (password.length < 6) {
      return { success: false, message: 'A senha deve ter pelo menos 6 caracteres.' }
    }

    const { data, error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: { data: { name: normalizedName } },
    })

    if (error) {
      return {
        success: false,
        message: error.message === 'User already registered'
          ? 'Este e-mail já está cadastrado.'
          : error.message,
      }
    }

    if (!data.session) {
      return {
        success: false,
        message: 'Cadastro criado! Confirme seu e-mail para ativar a conta.',
      }
    }

    await applySession(data.session)
    await refreshTasks()
    return { success: true }
  }

  async function logoutAccount() {
    await supabase.auth.signOut()
    setActiveAccount('')
    setActiveUserName('')
    setTasks([])
    resetTaskForm()
  }

  // ─── CRUD de tarefas ───────────────────────────────────────────

  function updateTaskField(name, value) {
    setTaskForm((current) => ({ ...current, [name]: value }))
  }

  async function submitTask(event) {
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

    try {
      if (editingTaskId) {
        await api.updateTask(editingTaskId, normalizedTask)
        setMessage('success', 'Tarefa atualizada com sucesso.')
      } else {
        await api.createTask(normalizedTask)
        setMessage('success', 'Tarefa criada com sucesso.')
      }

      resetTaskForm()
      await refreshTasks()
    } catch (error) {
      setMessage('danger', error.message || 'Não foi possível salvar a tarefa.')
    }
  }

  function startTaskEdit(taskId) {
    const task = tasks.find((item) => item.id === taskId)

    if (!task) {
      setMessage('danger', 'Não foi possível localizar a tarefa.')
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

  async function deleteTask(taskId) {
    const task = tasks.find((item) => item.id === taskId)

    if (!task) {
      setMessage('danger', 'Não foi possível localizar a tarefa.')
      return
    }

    try {
      await api.deleteTask(taskId)

      if (editingTaskId === taskId) {
        resetTaskForm()
      }

      setMessage('success', `Tarefa "${task.title}" removida com sucesso.`)
      await refreshTasks()
    } catch (error) {
      setMessage('danger', error.message || 'Não foi possível excluir a tarefa.')
    }
  }

  async function toggleTaskStatus(taskId) {
    const task = tasks.find((item) => item.id === taskId)
    if (!task) return

    const nextStatus = task.status === 'concluida' ? 'pendente' : 'concluida'
    const updatedTask = { ...task, status: nextStatus }

    setTasks((currentTasks) => sortTasks(
      currentTasks.map((item) => item.id === taskId ? updatedTask : item)
    ))

    try {
      await api.updateTask(taskId, updatedTask)
    } catch (error) {
      setTasks((currentTasks) => sortTasks(
        currentTasks.map((item) => item.id === taskId ? task : item)
      ))
      setMessage('danger', error.message || 'Não foi possível atualizar a tarefa.')
    }
  }

  function cancelTaskEditing() {
    resetTaskForm()
    setMessage('success', 'Edição cancelada.')
  }

  // ─── Contexto memoizado ────────────────────────────────────────

  const contextValue = useMemo(() => ({
    activeAccount,
    activeUserName,
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
  }), [
    activeAccount,
    activeUserName,
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
  ])

  return <TaskContext.Provider value={contextValue}>{children}</TaskContext.Provider>
}
