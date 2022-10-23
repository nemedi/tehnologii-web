const fetch = require('node-fetch');

const SEARCH_AIRLINE_URL = 'https://www.flightradar24.com/v1/search/web/find?type=operator&query=';
const SEARCH_FLIGHTS_URL = 'https://data-cloud.flightradar24.com/zones/fcgi/feed.js?airline=';
const SEARCH_FLIGHT_URL = 'https://data-live.flightradar24.com/clickhandler/?flight=';

async function searchAirline(name) {
	try {
		const response = await fetch(SEARCH_AIRLINE_URL + name);
		const body = await response.json();
		return body.results.map(result => ({
			id: result.id,
			name: result.name
		}));
	} catch (error) {
		return [];
	}
}

async function searchFlights(airline) {
	try {
		const response = await fetch(SEARCH_FLIGHTS_URL + airline.toUpperCase());
		const body = await response.json();
		const flights = [];
		for (let code in body) {
			if (body[code] instanceof Array) {
				const flight = await searchFlight(code);
				if (flight != null) {
					flights.push(flight);
				}
			}
		}
		return flights.sort((first, second) =>
			first.number.localeCompare(second.number));
	} catch (error) {
		return [];
	}
}

async function searchFlight(code) {
	try {
		const response = await fetch(SEARCH_FLIGHT_URL + code);
		const body = await response.json();
		return {
			number: body.identification.number.default,
			aircraft: body.aircraft.model.text,
			origin: body.airport.origin
				? body.airport.origin.name : 'Unknown',
			destination: body.airport.destination
				? body.airport.destination.name : 'Unknown',
			status: body.status.text
		};
	} catch (error) {
		return null;
	}
}

module.exports = {searchAirline, searchFlights};