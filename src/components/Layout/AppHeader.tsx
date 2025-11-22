import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
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
    <header className="flex items-center justify-between border-b border-accent/40 bg-card px-4 py-3 backdrop-blur sm:px-6 lg:px-8">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="rounded-md p-2 text-textDark hover:bg-muted hover:text-textDark lg:hidden"
            onClick={onMenuClick}
            aria-label="Toggle navigation"
          >
            <span className="block h-0.5 w-5 bg-current" />
            <span className="mt-1 block h-0.5 w-5 bg-current" />
            <span className="mt-1 block h-0.5 w-5 bg-current" />
          </button>
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-textDark no-underline"
          >
            <img
              src="/logo.jpg"
              alt="IsdaNary logo"
              className="h-8 w-8 rounded-full object-cover shadow-sm sm:h-9 sm:w-9"
            />
            <div className="flex flex-col">
              <span className="text-sm font-semibold sm:text-base">IsdaNary</span>
              <span className="text-xs text-textMuted sm:text-sm">
                Fisheries Management System
              </span>
            </div>
          </Link>
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
        {user ? (
          <div className="flex items-center gap-2">
            <span className="hidden text-xs text-textMuted sm:inline">{user.email}</span>
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
              className="text-xs text-textMuted hover:text-primary"
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
