const GET_COORDINATES_URL = 'https://geocoding-api.open-meteo.com/v1/search?name=';
const GET_FLIGHTS_URL = 'https://data-cloud.flightradar24.com/zones/fcgi/feed.js?bounds=';
const GET_FLIGHT_DETAILS_URL = 'https://data-live.flightradar24.com/clickhandler/?flight=';

async function getCoordinates(name) {
    try {
        const response = await fetch(GET_COORDINATES_URL + name,
            {headers: {'User-Agent': 'flights-radar-react'}});
        const body = await response.json();
        return body.results.length > 0
            ? {
                latitude: body.results[0].latitude,
                longitude: body.results[0].longitude
            }
            : null;
    } catch {
        return null;
    }
}

async function getFlights(latitude, longitude) {
	try {
        const flights = [];
		const response = await fetch(GET_FLIGHTS_URL
            + [latitude + 1, longitude - 1, latitude - 1, longitude + 1].join(','),
            {headers: {'User-Agent': 'flights-radar-react'}});
        const body = await response.json();
        for (let key in body) {
            if (body[key] instanceof Array) {
                const flight = await getFlightDetails(key);
                if (flight) {
                    flights.push(flight);
                }
            }
        }
        return flights;
	} catch {
		return [];
	}
}

async function getFlightDetails(code) {
	try {
		const response = await fetch(GET_FLIGHT_DETAILS_URL + code,
            {headers: {'User-Agent': 'flights-radar-react'}});
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
	} catch {
		return null;
	}
}

export {getCoordinates, getFlights};