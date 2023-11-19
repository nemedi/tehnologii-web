const express = require('express');
const {join, resolve} = require('path');
const {getBoard, getStandings, getMatches} = require('./service')('repository.json');
const port = process.env.port || 8080;
express()
	.use(express.static(join(resolve('..'), 'client')))
	.get('/api/board', (request, response) => 
		response.json(getBoard())
	)
	.get('/api/standings/:group', (request, response) => 
		response.json(getStandings(request.params.group))
	)
	.get('/api/matches/:team', (request, response) => 
		response.json(getMatches(request.params.team))
	)
	.listen(port, () => console.log(`Server is running on port ${port}.`));