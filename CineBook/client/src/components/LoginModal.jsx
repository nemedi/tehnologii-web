import React, { useState } from 'react';

function LoginModal({ onLogin, onClose, onSwitchToRegister }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const r = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });
      const data = await r.json();
      setLoading(false);
      if (data.id) {
        onLogin(data);
      } else {
        setError(data.error || 'Login failed');
      }
    } catch {
      setLoading(false);
      setError('Network error — please try again');
    }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <button className="modal-close" onClick={onClose} aria-label="Close">
          &times;
        </button>
        <h2 className="modal-title">Login</h2>
        <p style={{ color: '#888', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
          Login to confirm your seat reservation
        </p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              className="form-input"
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              autoFocus
              required
              autoComplete="username"
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              className="form-input"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          {error && <div className="form-error">{error}</div>}
          <button
            type="submit"
            className="btn btn-primary form-submit"
            disabled={loading}
          >
            {loading ? 'Logging in…' : 'Login'}
          </button>
        </form>
        <p className="login-hint">
          No account?{' '}
          <button className="btn-text-link" onClick={onSwitchToRegister}>
            Register
          </button>
          &nbsp;&bull;&nbsp; Test: john / password123
        </p>
      </div>
    </div>
  );
}

export default LoginModal;
