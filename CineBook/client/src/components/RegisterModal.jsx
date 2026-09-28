import React, { useState } from 'react';

function RegisterModal({ onLogin, onClose, onSwitchToLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const r = await fetch('/api/auth/register', {
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
        setError(data.error || 'Registration failed');
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
        <h2 className="modal-title">Create Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="reg-username">
              Username
            </label>
            <input
              id="reg-username"
              className="form-input"
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              autoFocus
              required
              minLength={3}
              autoComplete="username"
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="reg-password">
              Password
            </label>
            <input
              id="reg-password"
              className="form-input"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
            />
            <div style={{ color: '#555', fontSize: '0.75rem', marginTop: '0.3rem' }}>
              At least 6 characters
            </div>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="reg-confirm">
              Confirm Password
            </label>
            <input
              id="reg-confirm"
              className="form-input"
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>
          {error && <div className="form-error">{error}</div>}
          <button
            type="submit"
            className="btn btn-primary form-submit"
            disabled={loading}
          >
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>
        <p className="login-hint">
          Already have an account?{' '}
          <button className="btn-text-link" onClick={onSwitchToLogin}>
            Login
          </button>
        </p>
      </div>
    </div>
  );
}

export default RegisterModal;
