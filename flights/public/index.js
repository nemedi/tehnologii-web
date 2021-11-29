async function loadFlights() {
	let country = '';
	if (window.location.search.startsWith('?country=')) {
		country = window.location.search.substring('?country='.length);
		country = country[0].toUpperCase() + country.substring(1);
	}
	if (country.length === 0) {
		country = 'romania';
	}
	document.getElementById('loading').innerHTML = `Loading flights over ${country}`;
	const response = await fetch(`/flights/${country}`);
	if (response.status === 200) {
		const flights = await response.json();
		document.getElementById('flights').innerHTML =
			`
				<tr>
					<td nowrap><b>Airline</b></td>
					<td nowrap><b>From</b></td>
					<td nowrap><b>To</b></td>
				</tr>
			`
			+ 
			flights.map(flight => `
				<tr>
					<td nowrap>${flight.airline}</td>
					<td nowrap>${flight.from}</td>
					<td nowrap>${flight.to}</td>
				</tr>
			`).join('');
	}
}