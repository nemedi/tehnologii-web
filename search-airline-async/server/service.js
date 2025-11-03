const SEARCH_AIRLINE_URL = 'https://www.flightradar24.com/v1/search/web/find?type=operator&query=';
const SEARCH_FLIGHTS_URL = 'https://data-cloud.flightradar24.com/zones/fcgi/feed.js?airline=';
const SEARCH_FLIGHT_URL = 'https://data-live.flightradar24.com/clickhandler/?flight=';

async function searchAirline(name) {
	try {
		const response = await fetch(SEARCH_AIRLINE_URL + name)
			.catch(error => {throw error;});
		const body = await response.json()
			.catch(error => {throw error;});
		return body.results.map(result => ({
			id: result.id,
			name: result.name
		}));
	} catch (error) {
		console.log(error);
		return [];
	}
}

async function searchFlights(airline) {
	try {
		const response = await fetch(SEARCH_FLIGHTS_URL + airline.toUpperCase())
			.catch(error => { throw error;});
		const body = await response.json()
			.catch(error => { throw error;});
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
		console.log(error);
		return [];
	}
}

async function searchFlight(code) {
	try {
		const response = await fetch(SEARCH_FLIGHT_URL + code)
			.catch(error => { throw error;});
		const body = await response.json()
			.catch(error => { throw error;});
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
		console.log(error);
		return null;
	}
}

module.exports = {searchAirline, searchFlights};