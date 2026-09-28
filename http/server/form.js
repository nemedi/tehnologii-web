const express = require('express');
const {printCollection} = require('./utils');
const PORT = 8080;

express()
    .use(express.static('../client'))
    .use(express.urlencoded({extended : true}))
    .use(express.json())
    .get('/form', (request, response) => 
        response.send(printCollection("Form " + request.method, request.query))
    )
    .post('/form', (request, response) => 
        response.send(printCollection("Form " + request.method, request.body))
    )
    .put('/form', (request, response) => 
        response.send(printCollection("Form " + request.method, request.body))
    )    
    .listen(PORT, () => 
        console.log(`Server is running on port ${PORT}.`)
    );