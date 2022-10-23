const express = require('express');
const {join, resolve} = require('path');
const {searchAirline, searchFlights} = require('./service');

const PORT = process.env.PORT || 8080;
express()
	.use(express.static(join(resolve(), 'public')))
	.get('/airlines/:name', (request, response) =>
		searchAirline(request.params.name)
			.then(airlines => response.json(airlines),
				error => response.json([]))
	)
	.get('/flights/:airline', (request, response) =>
		searchFlights(request.params.airline)
			.then(flights => response.json(flights),
				error => response.json([]))
	)
	.listen(PORT, () => console.log(`Server is running on port ${PORT}.`));