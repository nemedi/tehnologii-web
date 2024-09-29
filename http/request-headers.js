const express = require('express');
const PORT = process.env.PORT || 8080;

function printRequestHeaders(request) {
    let output = '<p><h1> Request Headers</h1>';
    output += '<ul>';
    for (const key in request.headers) {
        if (request.headers.hasOwnProperty(key)) {
          output += `<li>${key}: ${request.headers[key]}</li>`;
        }
    }
    output += '</ul></p>';
    return output;
}

express()
    .get('/', (request, response) =>
        response.send(printRequestHeaders(request))
    )
    .listen(PORT, () => 
        console.log(`Server is running on port ${PORT}`)
    );