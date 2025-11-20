const express = require('express');
const repository = require('./service')('repository.json');
const PORT = 8080;
express()
	.use(express.json())
	.use(express.static('../client'))
	.get('/models/:model', (request, response) => {
		const model = repository.getModel(request.params.model);
		if (model) {
			response.json(model);
		} else {
			response.sendStatus(404);
		}
	})
	.put('/models/:model', (request, response) => {
		if (repository.saveModel(request.params.model, request.body)) {
			response.sendStatus(204);
		} else {
			response.sendStatus(403);
		}
	})
	.delete('/models/:model/:id', (request, response) => {
		if (repository.removeModel(request.params.model, parseInt(request.params.id))) {
			response.sendStatus(204);
		} else {
			response.sendStatus(404);
		}
	})
	.listen(PORT, () => console.log(`Server is running on port ${PORT}.`));