import { supabase } from './supabaseClient'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const STATUS_LABELS = {
  pendente: 'Pendente',
  em_andamento: 'Em andamento',
  concluida: 'Concluída',
}

const PRIORITY_LABELS = {
  baixa: 'Baixa',
  media: 'Média',
  alta: 'Alta',
}

const LABEL_TO_STATUS = {
  Pendente: 'pendente',
  'Em andamento': 'em_andamento',
  'Concluída': 'concluida',
}

const LABEL_TO_PRIORITY = {
  Baixa: 'baixa',
  'Média': 'media',
  Alta: 'alta',
}

async function getAccessToken() {
  const { data } = await supabase.auth.getSession()
  return data.session?.access_token || ''
}

function toApiTask(task) {
  return {
    title: task.title,
    description: task.description,
    due_date: task.dueDate,
    priority: PRIORITY_LABELS[task.priority] || task.priority,
    status: STATUS_LABELS[task.status] || task.status,
  }
}

function fromApiTask(task) {
  return {
    id: task.id,
    title: task.title,
    description: task.description || '',
    dueDate: task.due_date,
    priority: LABEL_TO_PRIORITY[task.priority] || task.priority,
    status: LABEL_TO_STATUS[task.status] || task.status,
  }
}

function errorMessage(payload, fallback) {
  if (!payload) return fallback
  if (typeof payload.detail === 'string') return payload.detail
  if (Array.isArray(payload.detail)) {
    return payload.detail.map((item) => item.msg).join(' ')
  }
  return fallback
}

async function request(path, options = {}) {
  const token = await getAccessToken()

  let response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...(options.headers || {}),
      },
    })
  } catch {
    throw new Error('Não foi possível conectar ao servidor.')
  }

  if (!response.ok) {
    let payload = null
    try {
      payload = await response.json()
    } catch {
      // corpo sem JSON (ex.: erro de rede/proxy)
    }
    throw new Error(errorMessage(payload, `Erro ${response.status} ao acessar o servidor.`))
  }

  if (response.status === 204) {
    return null
  }

  return response.json()
}

export async function listTasks() {
  const tasks = await request('/tasks')
  return tasks.map(fromApiTask)
}

export async function createTask(task) {
  const payload = await request('/tasks', {
    method: 'POST',
    body: JSON.stringify(toApiTask(task)),
  })
  return fromApiTask(payload.tarefa)
}

export async function updateTask(taskId, task) {
  const payload = await request(`/tasks/${taskId}`, {
    method: 'PUT',
    body: JSON.stringify(toApiTask(task)),
  })
  return fromApiTask(payload.tarefa)
}

export async function deleteTask(taskId) {
  await request(`/tasks/${taskId}`, {
    method: 'DELETE',
  })
}
