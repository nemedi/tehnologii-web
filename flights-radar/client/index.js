document.addEventListener('DOMContentLoaded', () => {
	let job = null;
	const getView = memoizer(async (view) =>
		await (await fetch(`/${view}.html`)).text()
	);
	const renderView = (view, data) => {
		$('#main').innerHTML = view.render(data)
	};
	const getCoordinates = async (city) => {
		const response = await fetch(`/coordinates/${city}`);
		if (response.status === 200) {
			return await response.json();
		}
	};
	const getFlights = async (latitude, longitude) => {
		const response = await fetch(
			`/flights?bounds=${latitude + 1},${longitude - 1},${latitude - 1},${longitude + 1}`);
		if (response.status === 200) {
			return await response.json();
		} else {
			return [];
		}
	};
	$('input').addEventListener('keyup', async (event) => {
		const city = event.target.value.trim();
		if (event.key === 'Enter'
			&& city.length > 0) {
			event.preventDefault();
			if (job) {
				clearInterval(job);
			}
			const {latitude, longitude} = await getCoordinates(city);
			if (latitude && longitude) {
				const view = await getView('flights');
				renderView('<h2>Loading data...</h2>');
				const flights = await getFlights(latitude, longitude);
					renderView(view, {flights});
				job = setInterval(async () => {
					const flights = await getFlights(latitude, longitude);
					renderView(view, {flights});
				}, 5000);
			}
			return false;
		}
	});
});