const express = require('express');
const {join, resolve} = require('path');
const repository = (require('./repository'))('repository.json');

const application = express();
application.use(express.json());
application.use(express.static(join(resolve(), 'public')));

application.get('/models/:model', (request, response) =>
	response.json(repository.getModel(request.params.model)));

application.put('/models/:model', (request, response) =>
	response.status(repository.saveModel(request.params.model, request.body) ? 204 : 404).send());

application.delete('/models/:model/:id', (request, response) =>
	response.status(repository.removeModel(request.params.model, parseInt(request.params.id)) ? 204 : 404).send());

application.listen(8080, () => console.log('Server is running.'));