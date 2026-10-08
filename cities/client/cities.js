const cache = {};
window.onload = async function() {
	const response = await fetch('/cities.json');
	if (response.status === 200) {
		cache.cities = await response.json();
		const inputElement = document.querySelector('input');
		inputElement.onkeyup = searchCity;
	}
}
function searchCity(event) {
	const tableElement = document.querySelector('table');
	tableElement.innerHTML = '';
	const name = event.target.value.trim();
	if (name.length === 0) {
		return;
	}
	let cities = cache.cities.filter(city => city.name.toLowerCase().startsWith(name.toLowerCase()));
	if (cities.length > 0) {
		tableElement.innerHTML =
			`
				<tr>
					<td><b>Name</b></td>
					<td align="right"><b>Inhabitants</b></td>
				</tr>
			`
			+ cities.sort((first, second) => first.name.localeCompare(second.name))
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