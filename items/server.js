const {resolve, join} = require('path');
const express = require('express');
const service = require('./service')('items.json');
const PORT = process.env.PORT || 8080;
express()
    .use(express.static(join(resolve(), 'web')))
    .use(express.text())
    .get('/items', (request, response) => {
        const items = service.getItems();
        if (items.length > 0) {
            response.json(items);
        } else {
            response.sendStatus(204);
        }
    })
    .post('/items', (request, response) => {
        const item = service.addItem(request.body);
        response.status(201).send(item.id + '');
    })
    .put('/items/:id', (request, response) => {
        if (service.changeItem(parseInt(request.params.id), request.body)) {
            response.sendStatus(204);
        } else {
            response.sendStatus(404);
        }
    })
    .delete('/items/:id', (request, response) => {
        if (service.removeItem(parseInt(request.params.id))) {
            response.sendStatus(204);
        } else {
            response.sendStatus(404);
        }
    })
    .listen(PORT, () => console.log(`Server is running on port ${PORT}.`));