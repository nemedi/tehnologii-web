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
		if (addPointToFigure(request.params.figureId, request.body)) {
			response.sendStatus(204);
		} else {
			response.sendStatus(404);
		}
		
	})
	.delete('/figures/:figureId', (request, response) => {
		if (removeFigure(request.params.figureId)) {
			response.sendStatus(204);
		} else {
			response.sendStatus(404);
		}
		
	})
	.listen(PORT, () => console.log(`Server is running on port ${PORT}.`));