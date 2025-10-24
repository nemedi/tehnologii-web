const express = require('express');
const {getItems, addItem, changeItem, removeItem} = require('./service')('items.json');
const PORT = 8080;
express()
    .use(express.static('../client'))
    .use(express.text())
    .get('/items', (request, response) => {
        const items = getItems();
        if (items.length > 0) {
            response.json(items);
        } else {
            response.sendStatus(204);
        }
    })
    .post('/items', (request, response) => {
        const item = addItem(request.body);
        response.status(201).send(item.id + '');
    })
    .put('/items/:id', (request, response) => {
        if (changeItem(parseInt(request.params.id), request.body)) {
            response.sendStatus(204);
        } else {
            response.sendStatus(404);
        }
    })
    .delete('/items/:id', (request, response) => {
        if (removeItem(parseInt(request.params.id))) {
            response.sendStatus(204);
        } else {
            response.sendStatus(404);
        }
    })
    .listen(PORT, () => console.log(`Server is running on port ${PORT}.`));