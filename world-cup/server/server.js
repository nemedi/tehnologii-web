const express = require('express');
const {getBoard, getStandings, getMatches} = require('./service')('data.json');
const {join, resolve} = require('path');
const PORT = process.env.PORT || 8080;
express()
	.use(express.static(join(resolve('..'), 'client')))
	.get('/board', async (request, response) => 
		response.json(getBoard())
	)
	.get('/standings/:group', async (request, response) => 
		response.json(getStandings(request.params.group))
	)
	.get('/matches/:team', async (request, response) => 
		response.json(getMatches(request.params.team))
	)
	.listen(PORT, () => console.log(`Server is running on port ${PORT}.`));