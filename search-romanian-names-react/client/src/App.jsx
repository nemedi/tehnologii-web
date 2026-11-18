import {useRef, useState} from 'react';

export default function App() {
	const cache = useRef({});
	const [state, setState] = useState({status: 'idle'});

	async function onKeyUp(event) {
		const name = event.target.value;
		if (event.key !== 'Enter' || name.trim().length === 0) {
			setState({status: 'idle'});
			return;
		}
		setState({status: 'loading', name});
		const results = cache.current[name] !== undefined
			? cache.current[name]
			: await (await fetch(`names/${encodeURIComponent(name)}`)).json();
		if (results.length > 0) {
			cache.current[name] = results;
		}
		setState({status: 'done', name, results});
	}

	return (
		<>
			<p>
				Name: <input onKeyUp={onKeyUp} />
			</p>
			<div id="results">
				{state.status === 'loading' && (
					<>Searching for <i>{state.name.toUpperCase()}</i>, please wait...</>
				)}
				{state.status === 'done' && (state.results.length > 0
					? <ol>{state.results.map(r => <li key={r.district}>{r.district}: {r.count}</li>)}</ol>
					: <>No results found for {state.name}.</>)}
			</div>
		</>
	);
}
