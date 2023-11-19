const express = require('express');
const session = require('express-session');
const port = process.env.port || 8080;
express()
	.use(session({
		secret: 'no secret at all',
		resave: false,
		saveUninitialized: true
	}))
	.get('/', (request, response) => {
        let html = '<html><head><title>Session</title></head><body>';
		if (request.session.user) {
            html += `
                <p>Your name is <b>${request.session.user}</b></p>
                <p><a href='/logout'>Logout</a></p>
            `;
        } else {
            html += `
                <p>
                    <form action="/login" method="get">
                    User <input name="user" placeholder="enter your name" required>
                    <input type="submit" value="Login">
                    </form>
                </p>
            `;
        }
        html += '</body></html>';
        response.send(html);
	})
    .get('/login', (request, response) => {
        request.session.user = request.query.user;
        response.redirect('/');
    })
    .get('/logout', (request, response) => {
        delete request.session.user;
        response.redirect('/');
    })
	.listen(port, () => console.log(`Server is running on port ${port}.`));