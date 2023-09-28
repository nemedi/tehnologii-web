const express = require('express');
const resolveName = require('./service');
const PORT = process.env.PORT || 8080;
express()
	.get('/names/:name', async (request, response) => {
		try {
			const results = await resolveName(request.params.name);
			if (results && results.length > 0) {
				response.json(results);
			} else {
				response.status(404).send('');
			}
		} catch (error) {
			response.status(500).json(error);
		}
	})
	.listen(PORT, () => console.log(`Server is running on port ${PORT}.`));