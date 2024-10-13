function searchAirline(name) {
	if (name.length > 2) {
		fetch(`airlines/${name}`)
			.then(response => response.json())
			.then(body => {
				if (body.length > 0) {
					var html = '<ul>';
					for (airline of body) {
						html += `<li>
									<a href="javascript:void(0)" onclick="searchFlights({name: '${airline.name}', id: '${airline.id}'})">${airline.name}</a>
								</li>`;
					}
					html += '</ul>';
				} else {
					html = 'No results found.';
				}
				document.getElementById('results').innerHTML = html;
			});
	} else {
		document.getElementById('results').innerHTML = '';
	}
}

function searchFlights(airline) {
	document.getElementById('results').innerHTML = `Loading flights for <b>${airline.name}</b>, this may take a while...`;
	fetch(`flights/${airline.id}`)
		.then(response => response.json())
		.then(body => {
			let html = 'No results found.';
			if (body.length > 0) {
				html = `<table>
							<tr>
								<td><b>Number</b></td>
								<td><b>Aircraft</b></td>
								<td><b>Origin</b></td>
								<td><b>Destination</b></td>
								<td><b>Status</b></td>
							</tr>`;
				for (let flight of body) {
					html += `<tr>
								<td>${flight.number}</td>
								<td>${flight.aircraft}</td>
								<td>${flight.origin}</td>
								<td>${flight.destination}</td>
								<td>${flight.status}</td>
							</tr>`;
				}
				html += '</table>';
			}
			document.getElementById('results').innerHTML = html;
		});
}