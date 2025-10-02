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
    .get('/', (request, response) =>
        response.send(printCollection("Request Headers", request.headers))
    )
    .listen(PORT, () => 
        console.log(`Server is running on port ${PORT}.`)
    );