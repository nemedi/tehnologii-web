const endpoint = 'https://api.nationalize.io/?name=';
const countries = require('./countries');

async function searchName(name) {
	const response = await fetch(endpoint + name);
	const body = await response.json();
	return body.country.map(item => countries.get(item.country_id));
}

module.exports = searchName;