const express = require('express');
const PORT = 8080;

function printRequestQuery(request) {
    let output = '<p><h1>Request Query</h1>';
    output += '<ul>';
    for (const key in request.query) {
        if (request.query.hasOwnProperty(key)) {
          output += `<li>${key}: ${request.query[key]}</li>`;
        }
    }
    output += '</ul></p>';
    return output;
}

express()
    .get('/', (request, response) => 
        response.send(printRequestQuery(request))
    )
    .listen(PORT, () => 
        console.log(`Server is running on port ${PORT}.`)
    );