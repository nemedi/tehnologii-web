const express = require('express');
const {join, resolve} = require('path');
const {getCoins, getCoin} = require('./service');

const PORT = process.env.PORT || 8080;
express()
	.use(express.static(join(resolve(), 'public')))
	.get('/coins/', async (request, response) =>
		response.json(await getCoins(request.query.filter))
	)
	.get('/coins/:id', async (request, response) =>
		response.json(await getCoin(request.params.id))
	)
	.listen(PORT, () => console.log(`Server is running on port ${PORT}.`));