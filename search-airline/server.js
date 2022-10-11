const express = require('express');
const {join, resolve} = require('path');
const {searchAirline, searchFlights} = require('./service');
express()
	.use(express.static(join(resolve(), 'public')))
	.get('/airlines/:name', async (request, response) => {
		response.json(await searchAirline(request.params.name));
	})
	.get('/flights/:airline', async (request, response) => {
		response.json(await searchFlights(request.params.airline))
	})
	.listen(process.env.PORT || 8080);