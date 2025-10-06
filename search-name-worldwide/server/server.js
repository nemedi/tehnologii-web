const express = require('express');
const searchName = require('./service');
const PORT = 8080;

express()
    .use(express.static('../client'))
    .get('/names/:name', async (request, response) =>
        response.json(await searchName(request.params.name)))
    .listen(PORT, () => console.log(`Server is listening on port ${PORT}.`));