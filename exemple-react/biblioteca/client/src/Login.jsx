import { useState } from 'react';
import { login } from './api.js';
import config from './config.js';

export default function Login({ onLogin }) {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [busy, setBusy] = useState(false);

	async function submit(event) {
		event.preventDefault();
		setBusy(true);
		setError('');
		try {
			await login(username, password, config.resources[0].path);
			onLogin();
		} catch (e) {
			setError(e.message);
		} finally {
			setBusy(false);
		}
	}

	return (
		<main className="login">
			<form onSubmit={submit}>
				<h1>{config.title}</h1>
				<p className="muted">Autentifică-te pentru a continua.</p>
				<label>Utilizator
					<input value={username} onChange={e => setUsername(e.target.value)}
						autoComplete="username" autoFocus required />
				</label>
				<label>Parolă
					<input type="password" value={password} onChange={e => setPassword(e.target.value)}
						autoComplete="current-password" required />
				</label>
				{error && <p className="error" role="alert">{error}</p>}
				<button type="submit" disabled={busy}>{busy ? 'Se verifică…' : 'Autentificare'}</button>
			</form>
		</main>
	);
}
