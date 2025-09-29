const express = require('express');
const PORT = 8080;

express()
    .use(express.static('../client'))
    .listen(PORT, () => 
        console.log(`Server is running on port ${PORT}.`)
    );