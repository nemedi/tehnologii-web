const cache = {};
window.onload = async function() {
	const response = await fetch('/cities.json');
	if (response.status === 200) {
		cache.cities = await response.json();
		cache.districts = cache.cities.reduce((districts, city) => {
			const district = districts.find(item => item.name === city.district);
			if (district) {
				district.inhabitants += city.inhabitants;
			} else {
				districts.push({name: city.district, inhabitants: city.inhabitants});
			}
			return districts;
		}, []);
		const districtsElements = document.getElementsByTagName('select')[0];
		districtsElements.innerHTML +=
			cache.districts
				.sort((first, second) => first.name < second.name ? -1
					: (first.name > second.name ? 1 : 0))
				.map(district => `<option>${district.name}</option>`)
				.join('');
		districtsElements.onchange = loadDistrict;
	}
}
function loadDistrict() {
	const tableElement = document.getElementsByTagName('table')[0];
	tableElement.innerHTML = '';
	const name = this.value;
	const district = cache.districts.find(item => item.name === name);
	if (district) {
		tableElement.innerHTML =
			`
				<tr>
					<td colspan="2">Inhabitants: ${district.inhabitants}</td>
				</tr>
				<tr>
					<td><b>City</b></td>
					<td align="right"><b>Inhabitants</b></td>
				</tr>
			`
			+ cache.cities.filter(city => city.district === district.name)
				.sort((first, second) => first.name < second.name ? -1
					: (first.name > second.name ? 1 : 0))
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