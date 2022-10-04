async function searchCity(name) {
	name = name.trim();
	let results = document.getElementById('results');
	if (name.length > 0) {
		let response = await fetch(`cities/${name}`);
		let cities = await response.json();
		results.innerHTML = 
			`<table>
				<tr>
					<td><b>Name</b></td>
					<td><b>District</b></td>
					<td align="right"><b>Inhabitants</b></td>
				</tr>`
				+ cities.map(city => `<tr>
						<td>${city.name}</td>
						<td>${city.district}</td>
						<td align="right">${city.inhabitants}</td>
					</tr>`)
					.reduce((output, row) => output += row, '')
			+ `</table>`;
	} else {
		results.innerHTML = '';
	}
}