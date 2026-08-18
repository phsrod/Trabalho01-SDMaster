// ─── Labels para exibição ──────────────────────────────────────

export const statusLabels = {
  pendente: 'Pendente',
  em_andamento: 'Em andamento',
  concluida: 'Concluída',
}

export const priorityLabels = {
  baixa: 'Baixa',
  media: 'Média',
  alta: 'Alta',
}

// ─── Mapeamento inverso (label → chave) para a API ─────────────

export const labelToStatus = {
  Pendente: 'pendente',
  'Em andamento': 'em_andamento',
  Concluída: 'concluida',
}

export const labelToPriority = {
  Baixa: 'baixa',
  Média: 'media',
  Alta: 'alta',
}

// ─── Chave → label para a API ──────────────────────────────────

export const statusToLabel = {
  pendente: 'Pendente',
  em_andamento: 'Em andamento',
  concluida: 'Concluída',
}

export const priorityToLabel = {
  baixa: 'Baixa',
  media: 'Média',
  alta: 'Alta',
}

// ─── Estilos de badge (prioridade e status) ────────────────────

export const priorityStyles = {
  alta: 'bg-red-50 text-red-700 border border-red-200',
  media: 'bg-amber-50 text-amber-700 border border-amber-200',
  baixa: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
}

export const statusStyles = {
  pendente: 'bg-red-50 text-red-700 border border-red-200',
  em_andamento: 'bg-amber-50 text-amber-700 border border-amber-200',
  concluida: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
}

export const defaultBadgeStyle = 'bg-slate-100 text-slate-600 border border-slate-200'

// ─── Ordem de ordenação por status ──────────────────────────────

export const statusOrder = {
  pendente: 1,
  em_andamento: 2,
  concluida: 3,
}

// ─── Peso de prioridade para ordenação ─────────────────────────

export const priorityWeight = {
  alta: 3,
  media: 2,
  baixa: 1,
}

// ─── Valores do formulário vazio ───────────────────────────────

export const EMPTY_TASK_FORM = {
  title: '',
  description: '',
  dueDate: '',
  priority: 'media',
  status: 'pendente',
}

// ─── Classes CSS reutilizáveis ─────────────────────────────────

export const inputClass =
  'h-11 w-full rounded-lg border border-slate-300 px-3 outline-none focus:border-brand focus:ring-3 focus:ring-blue-100'

export const selectClass =
  'h-11 w-full rounded-lg border border-slate-300 px-3 outline-none focus:border-brand focus:ring-3 focus:ring-blue-100'

export const labelClass = 'mb-1.5 block text-sm font-semibold'
