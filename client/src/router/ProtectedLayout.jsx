import { Navigate } from 'react-router-dom'
import MainLayout from '../components/layout/MainLayout'
import { useTaskContext } from '../context/useTaskContext'

function ProtectedLayout() {
  const { activeAccount } = useTaskContext()
  return activeAccount ? <MainLayout /> : <Navigate to="/login" replace />
}

export default ProtectedLayout
