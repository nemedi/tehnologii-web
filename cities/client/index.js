const locals = {
	districts: [],
	cities: []
};
window.onload = async function() {
	const response = await fetch('/cities.json');
	if (response.status === 200) {
		locals.cities = await response.json();
		locals.districts = locals.cities.reduce((items, city) => {
			const district = items.find(item => item.name === city.district);
			if (district) {
				district.inhabitants += city.inhabitants;
			} else {
				items.push({name: city.district, inhabitants: city.inhabitants});
			}
			return items;
		}, []);
		const districtsElements = document.getElementsByTagName('select')[0];
		districtsElements.innerHTML +=
			locals.districts
				.sort((first, second) => first.name < second.name ? -1
					: (first.name > second.name ? 1 : 0))
				.map(district => `<option>${district.name}</option>`)
				.join('');
		districtsElements.onchange = loadDistrict;
	}
}
function loadDistrict() {
	const citiesElement = document.getElementsByTagName('table')[0];
	citiesElement.innerHTML = '';
	const name = this.value;
	const district = locals.districts.find(item => item.name === name);
	if (district) {
		citiesElement.innerHTML =
			`
				<tr>
					<td colspan="2">Inhabitants: ${district.inhabitants}</td>
				</tr>
				<tr>
					<td><b>City</b></td>
					<td align="right"><b>Inhabitants</b></td>
				</tr>
			`
			+ locals.cities.filter(city => city.district === district.name)
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