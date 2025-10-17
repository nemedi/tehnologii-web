window.onload = function() {
	document.getElementsByTagName('input')[0].onkeyup =
		event => searchAirline(event.target.value.trim());
}
async function searchAirline(name) {
	let html = '';
	if (name.length > 2) {
		const response = await fetch(`airlines/${name}`);
		const airlines = await response.json();
		if (airlines.length > 0) {
			html = '<ul>'
				+ airlines.map(airline =>
					`<li>
						<a href="javascript:void(0)"
							onclick="searchFlights({name: '${airline.name}', id: '${airline.id}'})">
							${airline.name}
						</a>
					</li>`
				).join('')
				+ '</ul>';
		} else {
			html = 'No results found.';
		}
	}
	document.getElementsByTagName('div')[0].innerHTML = html;
}
async function searchFlights(airline) {
	document.getElementsByTagName('div')[0].innerHTML =
		`Loading flights for <b>${airline.name}</b>, this may take a while...`;
	const response = await fetch(`flights/${airline.id}`);
	const flights = await response.json();
	let html = 'No results found.';
	if (flights.length > 0) {
		html = `<table>
					<tr>
						<td><b>Number</b></td>
						<td><b>Aircraft</b></td>
						<td><b>Origin</b></td>
						<td><b>Destination</b></td>
						<td><b>Status</b></td>
					</tr>`
				+ flights.map(flight =>
					`<tr>
						<td>${flight.number}</td>
						<td>${flight.aircraft}</td>
						<td>${flight.origin}</td>
						<td>${flight.destination}</td>
						<td>${flight.status}</td>
					</tr>`
				).join('')
				+ '</table>';
	}
	document.getElementsByTagName('div')[0].innerHTML = html;
}