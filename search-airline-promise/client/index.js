window.onload = function() {
	document.getElementsByTagName('input')[0].onkeyup =
		event => searchAirline(event.target.value.trim());
}
function searchAirline(name) {
	const resultsElement = document.getElementsByTagName('div')[0];
	if (name.length > 2) {
		fetch(`airlines/${name}`)
			.then(response => response.json())
			.then(airlines => {
				let html = '';
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
				resultsElement.innerHTML = html;
			});
	} else {
		resultsElement.innerHTML = '';
	}
}

function searchFlights(airline) {
	const resultsElement = document.getElementsByTagName('div')[0];
	resultsElement.innerHTML =
		`Loading flights for <b>${airline.name}</b>, this may take a while...`;
	fetch(`flights/${airline.id}`)
		.then(response => response.json())
		.then(flights => {
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
			resultsElement.innerHTML = html;
		});
}