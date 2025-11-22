import { Outlet } from 'react-router-dom';
import AppHeader from './AppHeader';

function Layout() {
  return (
    <div className="min-h-screen bg-background text-textDark dark:bg-slate-950 dark:text-slate-100">
      <AppHeader onMenuClick={() => {}} />
      <main className="mx-auto flex max-w-6xl flex-1 flex-col gap-6 px-4 pb-8 pt-4 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
