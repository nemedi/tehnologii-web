const express = require('express');
const {getFigures, addFigure, addPointToFigure, removeFigure} = require('./service');

const PORT = process.env.PORT || 8080;
express()
	.use(express.static('../client'))
	.use(express.json())
	.get('/figures', (request, response) => {
		response.json(getFigures());
	})
	.post('/figures', (request, response) => {
		addFigure(request.body);
		response.sendStatus(204);
	})
	.post('/figures/:figureId', (request, response) => {
		addPointToFigure(request.params.figureId, request.body);
		response.sendStatus(204);
	})
	.delete('/figures/:figureId', (request, response) => {
		removeFigure(request.params.figureId);
		response.sendStatus(204);
	})
	.listen(PORT, () => console.log(`Server is running on port ${PORT}.`));