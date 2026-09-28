const express = require('express');
const {printCollection} = require('./utils');
const PORT = 8080;

express()
    .get('/', (request, response) =>
        response.send(printCollection("Request Headers", request.headers))
    )
    .listen(PORT, () => 
        console.log(`Server is running on port ${PORT}.`)
    );