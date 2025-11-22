import { useTheme } from '../../context/ThemeContext';

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-slate-100 px-3 py-1 text-xs font-medium text-slate-800 shadow-sm hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
      aria-label="Toggle light and dark mode"
    >
      <span className="h-2 w-2 rounded-full bg-amber-400 shadow-sm dark:hidden" />
      <span className="hidden h-2 w-2 rounded-full bg-sky-400 shadow-sm dark:inline-block" />
      <span>{isDark ? 'Dark' : 'Light'} mode</span>
    </button>
  );
}

export default ThemeToggle;
