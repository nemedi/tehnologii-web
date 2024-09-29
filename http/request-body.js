const express = require('express');
const PORT = process.env.PORT || 8080;

function printRequestBody(request) {
    return `<p>
                <h1>RequestBody</h1>
                <div>${JSON.stringify(request.body)}</div>
            </p>`;
}

express()
    .use(express.json())
    .use(express.urlencoded({extended: true}))
    .post('/', (request, response) =>
        response.send(printRequestBody(request))
    )
    .listen(PORT, () => 
        console.log(`Server is running on port ${PORT}`)
    );