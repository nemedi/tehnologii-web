const locals = {
	districts: [],
	cities: []
};
function districts() {
	return document.getElementsByTagName('select')[0];
}
function cities() {
	return document.getElementsByTagName('table')[0];
}
async function load() {
	districts().onchange = loadDistrict;
	loadDistricts();
	loadCities();
}
async function loadDistricts() {
	const response = await fetch('/districts.json');
	if (response.status === 200) {
		locals.districts = await response.json();
		districts().innerHTML +=
			locals.districts
				.sort((first, second) => first.name < second.name ? -1
					: (first.name > second.name ? 1 : 0))
				.map(district => `<option>${district.name}</option>`)
				.join('');
	}
}
async function loadCities() {
	const response = await fetch('/cities.json');
	if (response.status === 200) {
		locals.cities = await response.json();
	}
}

function loadDistrict() {
	cities().innerHTML = '';
	const name = districts().value;
	const district = locals.districts.find(item => item.name === name);
	if (district) {
		cities().innerHTML =
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