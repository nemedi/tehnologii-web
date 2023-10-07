async function load() {
	const cache = {};
	const selectTag = document.getElementsByTagName('select')[0];
	const tableTag = document.getElementsByTagName('table')[0];
	let response = await fetch('/districts');
	let districts = await response.json();
	selectTag.innerHTML += districts
		.map(district => `<option>${district}</option>`)
		.join('');
	selectTag.onchange = async function() {
		tableTag.innerHTML = '';
		let district = selectTag.value;
		if (!cache[district]) {
			let response = await fetch(`/cities?district=${district}`);
			let cities = await response.json();
			cache[district] = cities;
		}
		let cities = cache[district];
		if (cities.length > 0) {
			let inhabitants = cities.reduce((inhabitants, city) =>
				inhabitants += city.inhabitants, 0);
			tableTag.innerHTML = 
				`
					<tr>
						<td><b>City</b></td>
						<td align="right"><b>Inhabitants</b></td>
					</tr>
				`		
				+ cities.map(city =>
				`
					<tr>
						<td>${city.name}</td>
						<td align="right">${city.inhabitants}</td>
					</tr>
				`
				)
				.join('')
				+
				`
					<tr>
						<td colspan="2"><hr></td>
					</tr>
					<tr>
						<td><i>Total</i></td>
						<td align="right"><i>${inhabitants}</i></td>
					</tr>
				`;
		}
	}

}