const SEARCH_AIRLINE_URL = 'https://www.flightradar24.com/v1/search/web/find?type=operator&query=';
const SEARCH_FLIGHTS_URL = 'https://data-cloud.flightradar24.com/zones/fcgi/feed.js?airline=';
const SEARCH_FLIGHT_URL = 'https://data-live.flightradar24.com/clickhandler/?flight=';

function searchAirline(name) {
	return new Promise((resolve, reject) =>
		fetch(SEARCH_AIRLINE_URL + name)
			.then(response => response.json(),
				error => reject(error))
			.then(body =>
					resolve(
						body.results.map(result =>
							({
								id: result.id,
								name: result.name
							})
						)
					),
				error => reject(error))
	);
}

function searchFlights(airline) {
	return new Promise((resolve, reject) =>
		fetch(SEARCH_FLIGHTS_URL + airline.toUpperCase())
			.then(response => response.json(),
				error => reject(error))
			.then(body => {
					Promise.all(Object.entries(body)
						.filter(([code, value]) => value instanceof Array)
						.map(([code, value]) => searchFlight(code)))
						.then(flights => resolve(flights
							.sort((first, second) =>
								first.number.localeCompare(second.number))),
							error => reject(error))
				},
				error => reject(error))
	);
}

function searchFlight(code) {
	return new Promise((resolve, reject) =>
		fetch(SEARCH_FLIGHT_URL + code)
			.then(response => response.json(),
				error => reject(error))
			.then(body =>
				resolve(
					({
						number: body.identification.number.default,
						aircraft: body.aircraft.model.text,
						origin: body.airport.origin ? body.airport.origin.name : 'Unknown',
						destination: body.airport.destination ? body.airport.destination.name : 'Unknown',
						status: body.status.text
					})
				),
				error => reject(error)
			)
	);
}

module.exports = {searchAirline, searchFlights};