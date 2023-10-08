const express = require('express');
const {resolve, join} = require('path');
const searchName = require('./service');
const PORT = process.env.PORT || 8080;

express()
    .use(express.static(join(resolve(), 'web')))
    .get('/names/:name', async (request, response) =>
        response.json(await searchName(request.params.name)))
    .listen(PORT, () => console.log(`Server is listening on port ${PORT}.`));