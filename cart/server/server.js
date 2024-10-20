const express = require('express');
const session = require('express-session');
const {getProducts, getCartItems, addCartItem, incrementCartItem, decrementCartItem} = require('./store');

const PORT = process.env.PORT || 8080;
express()
    .use(express.static('../client'))
    .use(session({
        secret: 'szervusz',
        resave: false,
        saveUninitialized: false
    }))
    .use(express.json())
    .get('/products', async (request, response) => {
        const products = await getProducts();
        if (products.length > 0) {
            response.json(products);
        } else {
            response.sendStatus(204);
        }
    })
    .get('/cart', (request, response) => {
        const items = getCartItems(request.session);
        if (items.length > 0) {
            response.json(items);
        } else {
            response.sendStatus(204);
        }
    })
    .post('/cart', (request, response) => {
        addCartItem(request.session, request.body);
        response.sendStatus(201);
    })
    .put('/cart/{id}', (request, response) => {
        if (incrementCartItem(request.session, request.params.id)) {
            response.sendStatus(204);
        } else {
            response.sendStatus(404);
        }
    })
    .delete('/cart/{id}', (request, response) => {
        if (decrementCartItem(request.session, request.params.id)) {
            response.sendStatus(204);
        } else {
            response.sendStatus(404);
        }
    })
    .listen(PORT, () => console.log(`Server is running on ${PORT}.`));