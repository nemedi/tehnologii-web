import express from 'express';
import session from 'express-session';
import {join, resolve} from 'path';
import chat from './service.mjs';


const PORT = process.env.PORT || 8080;
express()
	.use(express.static(join(resolve(), 'public')))
	.use(session({
		secret: 'szervusz',
		resave: false,
		saveUninitialized: true
	}))
	.use(express.text())
	.post('/users', (request, response) => {
		if (chat.login(request.body, request.session.id)) {
			response.sendStatus(202);
		} else {
			response.sendStatus(403);
		}
	})
	.get('/messages', (request, response) => {
		const messages = chat.getMessages(request.query.index);
		if (messages.length > 0) {
			response.json(messages);
		} else {
			response.sendStatus(204);
		}
	})
	.post('/messages', (request, response) => {
		if (chat.addMessage(request.body, request.session.id)) {
			response.sendStatus(202);
		} else {
			response.sendStatus(403);
		}
	})
	.delete('/users', (request, response) => {
		if (chat.logout(request.session.id)) {
			request.session.destroy();
			response.sendStatus(202);
		} else {
			response.sendStatus(403);
		}
	})
	.listen(PORT, () =>
		console.log(`Server is running on port ${PORT}.`));