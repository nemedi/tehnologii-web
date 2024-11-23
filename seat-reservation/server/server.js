const express = require('express');
const session = require('express-session');
const {getSeats, reserveSeat, unreserveSeat} = require('./service');

const PORT = process.env.PORT || 8080;
express()
	.use(express.static('../client'))
	.use(session({
		secret: 'szervusz',
		resave: false,
		saveUninitialized: true
	}))	
	.get('/seats', (request, response) => {
		const seats = getSeats();
		if (seats.length > 0) {
			response.json(seats);
		} else {
			response.sendStatus(204);
		}
	})
	.post('/seats', (request, response) => {
		const done = reserveSeat(
			parseInt(request.query.row),
			parseInt(request.query.column),
			request.session
		);
		response.sendStatus(done ? 204 : 403);
	})
	.delete('/seats', (request, response) => {
		const done = unreserveSeat(
			parseInt(request.query.row),
			parseInt(request.query.column),
			request.session
		);
		response.sendStatus(done ? 204 : 403);
	})
	.listen(PORT, () => console.log(`Server is running on port ${PORT}.`));