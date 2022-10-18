const express = require('express');
const {join, resolve} = require('path');
const searchLinks = require('./service');

const PORT = process.env.PORT || 8080;
express()
	.use(express.static(join(resolve(), 'public')))
	.get('/links', async (request, response) =>
		response.json(await searchLinks(request.query.url))
	)
	.listen(PORT, () => console.log(`Server is running on port ${PORT}.`));