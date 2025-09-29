const express = require('express');
const PORT = 8080;

express()
    .get('/', (request, response) => {
        response.send('<h1>Hello World!</h1>');
    })
    .listen(PORT, () => 
        console.log(`Server is running on port ${PORT}.`)
    );