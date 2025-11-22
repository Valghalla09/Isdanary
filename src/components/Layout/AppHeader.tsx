import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../UI/ThemeToggle';
import Button from '../UI/Button';

interface AppHeaderProps {
  onMenuClick: () => void;
}

function AppHeader({ onMenuClick }: AppHeaderProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Error signing out', error);
    }
  };

  return (
    <header className="flex items-center justify-between border-b border-accent/40 bg-card px-4 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80 sm:px-6 lg:px-8">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="rounded-md p-2 text-textDark hover:bg-muted hover:text-textDark dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100 lg:hidden"
            onClick={onMenuClick}
            aria-label="Toggle navigation"
          >
            <span className="block h-0.5 w-5 bg-current" />
            <span className="mt-1 block h-0.5 w-5 bg-current" />
            <span className="mt-1 block h-0.5 w-5 bg-current" />
          </button>
          <div>
            <Link
              to="/dashboard"
              className="text-sm font-semibold text-textDark dark:text-slate-100 sm:text-base"
            >
              IsdaNary
            </Link>
            <p className="text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
              Fisheries Management System
            </p>
          </div>
        </div>
        <nav className="hidden gap-4 text-sm font-medium text-textMuted sm:flex">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `rounded-full px-3 py-1 ${
                isActive
                  ? 'bg-primary text-white shadow-sm'
                  : 'hover:bg-muted hover:text-textDark'
              }`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/inventory"
            className={({ isActive }) =>
              `rounded-full px-3 py-1 ${
                isActive
                  ? 'bg-primary text-white shadow-sm'
                  : 'hover:bg-muted hover:text-textDark'
              }`
            }
          >
            Inventory
          </NavLink>
          <NavLink
            to="/sales"
            className={({ isActive }) =>
              `rounded-full px-3 py-1 ${
                isActive
                  ? 'bg-primary text-white shadow-sm'
                  : 'hover:bg-muted hover:text-textDark'
              }`
            }
          >
            Sales
          </NavLink>
          <NavLink
            to="/expenses"
            className={({ isActive }) =>
              `rounded-full px-3 py-1 ${
                isActive
                  ? 'bg-primary text-white shadow-sm'
                  : 'hover:bg-muted hover:text-textDark'
              }`
            }
          >
            Expenses
          </NavLink>
        </nav>
      </div>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        {user ? (
          <div className="flex items-center gap-2">
            <span className="hidden text-xs text-slate-600 dark:text-slate-300 sm:inline">
              {user.email}
            </span>
            <Button
              type="button"
              variant="outline"
              className="px-3 py-1 text-xs"
              onClick={handleLogout}
            >
              Log out
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="text-xs text-slate-700 hover:text-primary dark:text-slate-300 dark:hover:text-primary"
            >
              Log in
            </Link>
            <Link to="/signup">
              <Button type="button" className="px-3 py-1 text-xs">
                Sign up
              </Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

export default AppHeader;
