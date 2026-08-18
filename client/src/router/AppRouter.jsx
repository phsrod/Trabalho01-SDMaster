import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { TaskProvider } from '../context/TaskContext.jsx'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import NotFoundPage from '../pages/NotFoundPage'
import TasksPage from '../pages/TasksPage'
import HomePage from '../pages/HomePage'
import CreateTaskPage from '../pages/CreateTaskPage'
import ProtectedLayout from './ProtectedLayout'

function AppRouter() {
  return <BrowserRouter><TaskProvider><Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/cadastro" element={<RegisterPage />} />
    <Route path="/" element={<ProtectedLayout />}>
      <Route index element={<HomePage />} />
      <Route path="tarefas" element={<TasksPage />} />
      <Route path="criar-tarefa" element={<CreateTaskPage />} />
    </Route>
    <Route path="*" element={<NotFoundPage />} />
  </Routes></TaskProvider></BrowserRouter>
}

export default AppRouter
