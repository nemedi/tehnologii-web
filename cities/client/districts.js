const cache = {};
window.onload = async function() {
	const response = await fetch('/cities.json');
	if (response.status === 200) {
		let cities = await response.json();
		cache.districts = cities.reduce((districts, city) => {
			const district = districts.find(item => item.name === city.district);
			if (district) {
				district.cities.push(city);
			} else {
				districts.push({
					name: city.district,
					cities: [city]
				});
			}
			return districts;
		}, []);
		const selectElement = document.querySelector('select');
		selectElement.innerHTML +=
			cache.districts
				.sort((first, second) => first.name.localeCompare(second.name))
				.map(district => `<option>${district.name}</option>`)
				.join('');
		selectElement.onchange = loadDistrict;
	}
}
function loadDistrict(event) {
	const tableElement = document.querySelector('table');
	tableElement.innerHTML = '';
	const name = event.target.value;
	const district = cache.districts.find(item => item.name === name);
	if (district) {
		let inhabitants = district.cities.reduce((sum, city) => sum + city.inhabitants, 0);
		tableElement.innerHTML =
			`
				<tr>
					<td><b>Inhabitants</b></td>
					<td align="right">${inhabitants}</td>
				</tr>
				<tr>
					<td><b>City</b></td>
					<td align="right"><b>Inhabitants</b></td>
				</tr>
			`
			+ district.cities
				.sort((first, second) => first.name.localeCompare(second.name))
				.map(city =>
					`
						<tr>
							<td>${city.name}</td>
							<td align="right">${city.inhabitants}</td>
						</tr>
					`
				)
				.join('');
	}
}