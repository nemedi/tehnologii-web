const fetch = require('node-fetch');
async function getFlights(country) {
	var flights = [];
	let borders = await getCountryBorders(country);
	var object = await getObject(`https://data-live.flightradar24.com/zones/fcgi/feed.js
		?bounds=${borders.top}, ${borders.bottom},${borders.left},${borders.right}`);
	for (let key in object) {
		if (typeof object[key] === 'object') {
			let flight = {
				number: key,
				latitude: object[key][1],
				longitude: object[key][2]};
			//if (isOverCountry(flight, country, borders)) {
				flight = await getFlightDetails(flight);
				if (flight.from && flight.to && flight.airline) {
					flights.push(flight);
				}
			//}
		}
	}
	return flights.sort((first, second) =>
		first.airline.toLowerCase() < second.airline.toLowerCase() ? -1
		: (first.airline.toLowerCase() > second.airline.toLowerCase() ? 1 : 0));
}

async function isOverCountry(flight, country, borders) {
	return flight.longitude >= borders.left
		&& flight.longitude <= borders.right
		&& flight.latitude >= borders.top
		&& flight.latitude <= borders.bottom
		&& (await getFlightCountry(flight)) === country;
}

async function getCountryBorders(country) {
	let object = await getObject(`https://nominatim.openstreetmap.org/search
		?country=${country}&format=json`);
	return {
		left: object[0].boundingbox[2],
		top: object[0].boundingbox[0],
		right: object[0].boundingbox[3],
		bottom: object[0].boundingbox[1]
	};
}

async function getFlightDetails(flight) {
	try {
		var object = await getObject(`http://data-live.flightradar24.com/clickhandler
			?flight=${flight.number}`);
		flight.from = object.airport.origin.name;
		flight.to = object.airport.destination.name;
		flight.airline = object.airline.name;
		delete flight.latitude;
		delete flight.longitude;
	} catch (e) {
	} finally {
		return flight;
	}
}

async function getFlightCountry(flight) {
	return (await getObject(`http://maps.googleapis.com/maps/api/geocode/json
		?latlng=${flight.latitude}, ${flight.longitude}`))
		.address.country;
}

async function getObject(url) {
	const response = await fetch(url);
	return await response.json();
}

module.exports = {getFlights};