const express = require('express');
const {searchAirline, searchFlights} = require('./service');

const PORT = 8080;
express()
	.use(express.static('../client'))
	.get('/airlines/:name', async (request, response) =>
		response.json(await searchAirline(request.params.name))
	)
	.get('/flights/:airline', async (request, response) =>
		response.json(await searchFlights(request.params.airline))
	)
	.listen(PORT, () => console.log(`Server is running on port ${PORT}.`));