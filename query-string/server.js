const express = require('express');
const port = process.env.port || 8080;
express()
    .get('/', (request, response) => {
        if (Object.keys(request.query).length > 0) {
            response.send(
                '<ul>'
                + Object.entries(request.query)
                    .map(([key, value]) =>
                        `<li><b>${key}</b>: <i>${decodeURI(value)}</i></li>`)
                    .join('')
                + '</ul>'
            );
        } else {
            response.send('Query-string is empty.');
        }
    })
    .listen(port, () => console.log(`Server is running on port ${port}.`));