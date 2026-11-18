import {useEffect, useState} from 'react';
import {getCoordinates, getFlights} from './api.js';
import FlightsTable from './FlightsTable.jsx';

const REFRESH_INTERVAL = 5000;

export default function Application() {
	const [input, setInput] = useState('Bucharest');
	const [city, setCity] = useState(null);
	const [flights, setFlights] = useState(null);
	const [error, setError] = useState(null);

	useEffect(() => {
		if (!city) {
			return;
		}
		let cancelled = false;
		let timer = null;
		const refresh = async (coordinates) => {
			try {
				const data = await getFlights(coordinates.latitude, coordinates.longitude);
				if (!cancelled) {
					setFlights(data);
				}
			} catch {
				if (!cancelled) {
					setError('Could not load flights.');
				}
			}
		};
		(async () => {
			setFlights(null);
			setError(null);
			try {
				const coordinates = await getCoordinates(city);
				if (cancelled) {
					return;
				}
				if (!coordinates) {
					setError(`City "${city}" not found.`);
					return;
				}
				await refresh(coordinates);
				if (!cancelled) {
					timer = setInterval(() => refresh(coordinates), REFRESH_INTERVAL);
				}
			} catch {
				if (!cancelled) {
					setError('Could not load flights.');
				}
			}
		})();
		return () => {
			cancelled = true;
			clearInterval(timer);
		};
	}, [city]);

	const onKeyUp = (event) => {
		const value = input.trim();
		if (event.key === 'Enter' && value.length > 0) {
			setCity(value);
		}
	};

	return (
		<>
			<p>
				City <input value={input}
					onChange={(event) => setInput(event.target.value)}
					onKeyUp={onKeyUp}/>
			</p>
			{error && <p>{error}</p>}
			{city && !error && flights === null && <h2>Loading data...</h2>}
			{flights && <FlightsTable flights={flights}/>}
		</>
	);
}
