const express = require('express');
const {getBoard, getStandings, getMatches} = require('./service');
const {join, resolve} = require('path');
const PORT = process.env.PORT || 8080;
express()
	.use(express.static(join(resolve(), 'public')))
	.get('/board', async (request, response) => 
		response.json(await getBoard())
	)
	.get('/standings/:group', async (request, response) => 
		response.json(await getStandings(request.params.group))
	)
	.get('/matches/:team', async (request, response) => 
		response.json(await getMatches(request.params.team))
	)
	.listen(PORT, () => console.log(`Server is running on port ${PORT}.`));