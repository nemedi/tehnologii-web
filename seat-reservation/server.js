const express = require('express');
const session = require('express-session');
const {join, resolve} = require('path');
const {getSeats, reserveSeat, unreserveSeat} = require('./service');

const PORT = process.env.PORT || 8080;
express()
	.use(express.static(join(resolve(), 'public')))
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
		response.sendStatus(
			reserveSeat(
				parseInt(request.query.row),
				parseInt(request.query.column),
				request.session
			)
			? 204 : 403
		);
	})
	.delete('/seats', (request, response) => {
		response.sendStatus(
			unreserveSeat(
				parseInt(request.query.row),
				parseInt(request.query.column),
				request.session
			)
			? 204 : 403
		);
	})
	.listen(PORT, () => console.log(`Server is running on port ${PORT}.`));