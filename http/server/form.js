const express = require('express');
const PORT = 8080;

function printCollection(title, collection) {
    let output = `<p><h1>${title}</h1>`;
    output += '<ul>';
    for (const [key, value] of Object.entries(collection)) {
        output += `<li>${key}: ${value}</li>`;
    }
    output += '</ul></p>';
    return output;
}

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