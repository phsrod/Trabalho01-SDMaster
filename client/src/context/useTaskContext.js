import { useContext } from 'react'
import { TaskContext } from './taskContext.js'

export function useTaskContext() {
  const context = useContext(TaskContext)

  if (!context) {
    throw new Error('useTaskContext deve ser usado dentro de TaskProvider.')
  }

  return context
}
