const express = require('express');
const {resolve, join} = require('path');
const {getFlights} = require('./flights');
const PORT = process.env.PORT || 8080;
express()
	.use(express.static(join(resolve(), 'public')))
	.get('/flights/:country', async (request, response) => {
		let flights = await getFlights(request.params.country);
		response.json(flights);
	})
	.listen(PORT, () => console.log(`Server is listening on port ${PORT}.`));