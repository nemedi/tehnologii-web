const express = require('express');
const PORT = 8080;

express()
    .get('/', (request, response) => {
        if (request.query.login) {
            response.send(`
                Hello, ${request.query.login}!
                <input type="button" value="Logout" onclick="window.location.href = '/'"/>
            `);
        } else {
            response.redirect(301, '/login');
        }
    })
    .get('/login', (request, response) => {
        response.send(`
            <form action="/" method="get">
                User <input type="text" name="login"/>
                <input type="submit" value="Login"/>
            </form>
        `);
    })
    .listen(PORT, () => 
        console.log(`Server is running on port ${PORT}.`)
    );