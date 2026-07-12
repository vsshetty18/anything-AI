import React, { useState } from 'react';
import { LogIn } from 'lucide-react';
import { api } from '../api.js';
import Spinner from '../components/Spinner.jsx';
import Toast from '../components/Toast.jsx';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.login(email, password);
      onLogin(res.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="card w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-primary">Anything AI</h1>
          <p className="text-sm text-textDark/50 mt-2">Sign in to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-sm text-textDark/70 mb-1.5 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="text-sm text-textDark/70 mb-1.5 block">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="••••••••"
              required
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-textDark/60 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded accent-primary"
            />
            Remember Me
          </label>

          <button type="submit" disabled={loading} className="btn-primary flex items-center justify-center gap-2 mt-2">
            {loading ? <Spinner size={16} /> : <LogIn size={16} />}
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>

        <p className="text-xs text-textDark/30 text-center mt-6">
          Demo login: vighnesh@anything.ai / password123
        </p>
      </div>

      {error && <Toast message={error} type="error" onClose={() => setError('')} />}
    </div>
  );
}
