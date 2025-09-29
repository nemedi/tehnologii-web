const express = require('express');
const PORT = 8080;

function printCollection(collection) {
    let output = '<p><h1>Form</h1>';
    output += '<ul>';
    for (const key in collection) {
        if (collection.hasOwnProperty(key)) {
          output += `<li>${key}: ${collection[key]}</li>`;
        }
    }
    output += '</ul></p>';
    return output;
}

express()
    .use(express.static('../client'))
    .use(express.urlencoded({extended : true}))
    .use(express.json())
    .get('/form', (request, response) => 
        response.send(printCollection(request.query))
    )
    .post('/form', (request, response) => 
        response.send(printCollection(request.body))
    )
    .listen(PORT, () => 
        console.log(`Server is running on port ${PORT}.`)
    );