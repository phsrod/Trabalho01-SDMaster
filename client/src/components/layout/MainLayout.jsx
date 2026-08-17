import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import Icon from '../common/Icon'
import { useTaskContext } from '../../context/useTaskContext'

const menuItems = [
  {
    to: '/',
    label: 'Principal',
    icon: 'home',
    end: true
  },
  {
    to: '/tarefas',
    label: 'Minhas tarefas',
    icon: 'tasks'
  },
  {
    to: '/criar-tarefa',
    label: 'Criar tarefa',
    icon: 'plus'
  },
  {
    to: '/buscar',
    label: 'Buscar uma tarefa',
    icon: 'search'
  }
]

function MainLayout() {
  const { activeAccount, logoutAccount } = useTaskContext()
  const navigate = useNavigate()

  function handleLogout() {
    logoutAccount()
    navigate('/login', { replace: true })
  }

  return (
    <div className="grid min-h-screen md:grid-cols-[242px_minmax(0,1fr)]">
      <aside className="flex gap-3 border-b border-slate-200 bg-white p-4 md:sticky md:top-0 md:h-screen md:flex-col md:gap-0 md:border-b-0 md:border-r">
        <NavLink
          to="/"
          className="flex min-h-11 shrink-0 items-center gap-2 rounded-lg px-2 text-xl font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          aria-label="Task Manager — página principal"
          end
        >
          <span className="grid size-8 place-items-center rounded-lg bg-brand text-white">
            T
          </span>

          <span className="hidden md:inline">Task Manager</span>
        </NavLink>

        <nav
          className="flex flex-1 gap-1 overflow-x-auto md:mt-10 md:grid md:auto-rows-min md:content-start md:gap-1"
          aria-label="Navegação principal"
        >
          <p className="hidden px-3 pb-1 text-xs font-bold tracking-wider text-slate-400 md:block">
            MENU
          </p>

          {menuItems.map(({ to, label, icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              aria-label={label}
              title={label}
              className={({ isActive }) =>
                `flex h-9 w-9 shrink-0 items-center gap-3 rounded-lg px-3 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:w-auto sm:px-3 md:w-full ${
                  isActive
                    ? 'bg-blue-50 shadow-sm'
                    : 'hover:bg-blue-50'
                }`
              }
            >
              <span className="text-brand">
                <Icon name={icon} />
              </span>
              <span className="hidden text-black sm:inline">{label}</span>
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          className="grid size-11 shrink-0 place-items-center rounded-lg border border-red-200 text-red-700 transition-colors hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700 md:hidden"
          onClick={handleLogout}
          aria-label="Sair"
          title="Sair"
        >
          <Icon name="logout" />
        </button>

        <section
          className="mt-auto hidden border-t border-slate-200 px-2 pt-4 md:block"
          aria-label="Meu espaço"
        >
          <div className="flex items-center gap-2">
            <div className="grid size-8 place-items-center rounded-full bg-violet-100 font-bold text-violet-700">
              L
            </div>

            <div className="text-xs">
              <strong className="block">
                Meu espaço
              </strong>

              <span className="text-slate-500">
                {activeAccount
                  ? 'Conta pessoal'
                  : 'Sessão encerrada'}
              </span>
            </div>
          </div>

          <button
            type="button"
            className="mt-3 flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-xs font-bold text-red-700 transition-colors hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
            onClick={handleLogout}
          >
            <Icon name="logout" size={16} />
            Sair
          </button>
        </section>
      </aside>

      <main className="min-w-0">
        <Outlet />
      </main>
    </div>
  )
}

export default MainLayout
