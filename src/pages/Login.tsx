import { FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/UI/Button';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await login(email.trim(), password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      let message = 'Unable to sign in. Please check your details and try again.';
      if (err instanceof Error && err.message) {
        if (
          err.message.includes('auth/invalid-credential') ||
          err.message.includes('auth/wrong-password')
        ) {
          message = 'Invalid email or password.';
        } else if (err.message.includes('auth/user-not-found')) {
          message = 'No account found for that email.';
        }
      }
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8 dark:bg-slate-950">
      <div className="w-full max-w-md rounded-xl border border-muted bg-card p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-xl font-semibold text-textDark dark:text-slate-100">Sign in</h1>
        <p className="mt-1 text-sm text-textMuted dark:text-slate-400">
          Access your IsdaNary dashboard.
        </p>
        {error && (
          <div className="mt-4 rounded-md border border-rose-400 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-500 dark:bg-rose-950/40 dark:text-rose-100">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="space-y-1">
            <label
              htmlFor="email"
              className="text-xs font-medium text-textDark dark:text-slate-200"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-md border border-muted bg-card px-3 py-2 text-sm text-textDark outline-none focus:border-primary focus:ring-1 focus:ring-primary dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            />
          </div>
          <div className="space-y-1">
            <label
              htmlFor="password"
              className="text-xs font-medium text-textDark dark:text-slate-200"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-md border border-muted bg-card px-3 py-2 text-sm text-textDark outline-none focus:border-primary focus:ring-1 focus:ring-primary dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            />
          </div>
          <Button type="submit" disabled={submitting} className="mt-2 w-full justify-center">
            {submitting ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
        <p className="mt-4 text-xs text-textMuted dark:text-slate-400">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="font-medium text-primary hover:text-primaryDark">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
