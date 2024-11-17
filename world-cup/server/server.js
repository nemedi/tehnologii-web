const express = require('express');
const {getBoard, getStandings, getMatches} = require('./service')('repository.json');
const PORT = process.env.PORT || 8080;
express()
	.use(express.static('../client'))
	.get('/api/board', (request, response) => 
		response.json(getBoard())
	)
	.get('/api/standings/:group', (request, response) => 
		response.json(getStandings(request.params.group))
	)
	.get('/api/matches/:team', (request, response) => 
		response.json(getMatches(request.params.team))
	)
	.listen(PORT, () => console.log(`Server is running on port ${PORT}.`));