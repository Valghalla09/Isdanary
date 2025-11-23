import { FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/UI/Button';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-md rounded-xl border border-muted bg-card p-6 shadow-lg">
        <div className="mb-4 flex flex-col items-center text-center">
          <img
            src="/logo.jpg"
            alt="IsdaNary logo"
            className="h-24 w-24 rounded-full object-cover shadow-sm"
          />
          <h1 className="mt-2 text-2xl font-bold text-primary">IsdaNary</h1>
          <p className="text-xs text-textMuted">
            Fisheries Management System
          </p>
        </div>
        <h2 className="text-base font-semibold text-textDark">Log in</h2>
        <p className="mt-1 text-sm text-textMuted">
          Access your IsdaNary dashboard.
        </p>
        {error && (
          <div className="mt-4 rounded-md border border-rose-400 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="space-y-1">
            <label htmlFor="email" className="text-xs font-medium text-textDark">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-md border border-muted bg-card px-3 py-2 text-sm text-textDark outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="password" className="text-xs font-medium text-textDark">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-md border border-muted bg-card px-3 py-2 pr-14 text-sm text-textDark outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-3 flex items-center text-textMuted hover:text-textDark"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <path d="M9.88 9.88A3 3 0 0 0 12 15a3 3 0 0 0 2.12-.88" />
                    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c5 0 9 4 10 7-.64 1.5-1.86 3.54-3.78 5.11" />
                    <path d="M6.35 6.35C3.88 7.6 2.17 9.5 1 12c.64 1.5 1.86 3.54 3.78 5.11" />
                    <line x1="2" y1="2" x2="22" y2="22" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <Button type="submit" disabled={submitting} className="mt-2 w-full justify-center">
            {submitting ? 'Logging in...' : 'Log in'}
          </Button>
        </form>
        <p className="mt-4 text-xs text-textMuted">
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
