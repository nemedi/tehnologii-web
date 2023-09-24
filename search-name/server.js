const express = require('express');
const searchName = require('./service');
const {join, resolve} = require('path');
const PORT = process.env.PORT || 8080;
express()
	.use(express.static(join(resolve(), 'web')))
	.get('/names/:name', async (request, response) => 
		response.json(await searchName(request.params.name))
	)
	.listen(PORT, () => console.log(`Server is running on port ${PORT}.`));