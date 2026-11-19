import { useEffect, useState } from 'react';
import { currentUser, isLoggedIn, logout, setUnauthorizedHandler } from './api.js';
import config from './config.js';
import Login from './Login.jsx';
import ResourceView from './ResourceView.jsx';

export default function App() {
	const [authenticated, setAuthenticated] = useState(isLoggedIn());
	const [active, setActive] = useState(config.resources[0].key);

	useEffect(() => {
		setUnauthorizedHandler(() => setAuthenticated(false));
	}, []);

	if (!authenticated) {
		return <Login onLogin={() => setAuthenticated(true)} />;
	}

	return (
		<>
			<header className="topbar">
				<strong>{config.title}</strong>
				<nav>
					{config.resources.map(r => (
						<button key={r.key} className={r.key === active ? 'active' : ''}
							onClick={() => setActive(r.key)}>{r.label}</button>
					))}
				</nav>
				<span className="user">{currentUser()}
					<button className="secondary" onClick={() => { logout(); setAuthenticated(false); }}>
						Deconectare
					</button>
				</span>
			</header>
			<main className="content">
				<ResourceView key={active} resourceKey={active} />
			</main>
		</>
	);
}
