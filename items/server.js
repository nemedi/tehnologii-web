const express = require('express');
const {join, resolve} = require('path');
const repository = require('./items')('items.json');
const PORT = process.env.PORT || 8080;
express()
	.use(express.text())
	.use(express.static(join(resolve(), 'public')))
	.get('/items', (request, response) => {
		const items = repository.getItems();
		if (items.length > 0) {
			response.send(JSON.stringify(items));
		} else {
			response.sendStatus(204);
		}
	})
	.post('/items', (request, response) =>
		response.status(201).send(JSON.stringify(repository.addItem(request.body))))
	.delete('/items/:id', (request, response) =>
		response.sendStatus(repository.removeItem(parseInt(request.params.id)) ? '204' : '404'))
	.listen(PORT, () => console.log(`Server is running on port ${PORT}.`));