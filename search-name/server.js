const express = require('express');
const names = require('./names');
const {join, resolve} = require('path');
const PORT = process.env.PORT || 8080;
express()
	.use(express.static(join(resolve(), 'public')))
	.get('/names/:name', async (request, response) => 
		response.json(await names(request.params.name))
	)
	.listen(PORT, () => console.log(`Server is running on port ${PORT}.`));