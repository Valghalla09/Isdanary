import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import AppHeader from './AppHeader';

function Layout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-textDark">
      <AppHeader onMenuClick={() => setMobileNavOpen((prev) => !prev)} />

      {mobileNavOpen && (
        <div className="border-b border-accent/20 bg-card sm:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 pb-3 pt-2">
            <NavLink
              to="/dashboard"
              onClick={() => setMobileNavOpen(false)}
              className={({ isActive }) =>
                `w-full rounded-full px-3 py-2 text-left text-sm ${
                  isActive
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-textMuted hover:bg-muted hover:text-textDark'
                }`
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/inventory"
              onClick={() => setMobileNavOpen(false)}
              className={({ isActive }) =>
                `w-full rounded-full px-3 py-2 text-left text-sm ${
                  isActive
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-textMuted hover:bg-muted hover:text-textDark'
                }`
              }
            >
              Inventory
            </NavLink>
            <NavLink
              to="/sales"
              onClick={() => setMobileNavOpen(false)}
              className={({ isActive }) =>
                `w-full rounded-full px-3 py-2 text-left text-sm ${
                  isActive
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-textMuted hover:bg-muted hover:text-textDark'
                }`
              }
            >
              Sales
            </NavLink>
            <NavLink
              to="/expenses"
              onClick={() => setMobileNavOpen(false)}
              className={({ isActive }) =>
                `w-full rounded-full px-3 py-2 text-left text-sm ${
                  isActive
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-textMuted hover:bg-muted hover:text-textDark'
                }`
              }
            >
              Expenses
            </NavLink>
          </nav>
        </div>
      )}

      <main className="mx-auto flex max-w-6xl flex-1 flex-col gap-6 px-4 pb-8 pt-4 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
