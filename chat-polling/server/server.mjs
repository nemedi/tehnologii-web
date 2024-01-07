import express from 'express';
import session from 'express-session';
import {join, resolve} from 'path';
import service from './service.mjs';


const port = process.env.PORT || 8080;
express()
	.use(express.static(join(resolve('..'), 'client')))
	.use(session({
		secret: 'szervusz',
		resave: false,
		saveUninitialized: true
	}))
	.use(express.text())
	.post('/users', (request, response) => {
		if (service.login(request.body, request.session.id)) {
			response.sendStatus(202);
		} else {
			response.sendStatus(403);
		}
	})
	.get('/messages', (request, response) => {
		const messages = service.getMessages(request.query.index);
		if (messages.length > 0) {
			response.json(messages);
		} else {
			response.sendStatus(204);
		}
	})
	.post('/messages', (request, response) => {
		if (service.addMessage(request.body, request.session.id)) {
			response.sendStatus(202);
		} else {
			response.sendStatus(403);
		}
	})
	.delete('/users', (request, response) => {
		if (service.logout(request.session.id)) {
			request.session.destroy();
			response.sendStatus(202);
		} else {
			response.sendStatus(403);
		}
	})
	.listen(port, () =>
		console.log(`Server is running on port ${port}.`));