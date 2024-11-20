const express = require('express');
const PORT = process.env.PORT || 8080;
async function processRequest(request, response) {
    const url = request.query.__url;
    delete request.__url;
    const remoteResponse = await fetch(url, request);
    Object.getOwnPropertyNames(remoteResponse.headers)
        .forEach(name => response.set(name, remoteResponse.headers[name]));
    if (remoteResponse.status === 200) {
        response.send(await remoteResponse.text());
    } else {
        response.sendStatus(remoteResponse.status);
    }
}
express()
    .get('/', async (request, response) => processRequest(request, response))
    .post('/', async (request, response) => processRequest(request, response))
    .put('/', async (request, response) => processRequest(request, response))
    .patch('/', async (request, response) => processRequest(request, response))
    .delete('/', async (request, response) => processRequest(request, response))
    .listen(PORT, () => console.log(`Server is listening on port ${PORT}.`));