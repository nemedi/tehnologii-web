const express = require('express');
const application = express();
require('express-ws')(application);
const rooms = ['*', 'Hungary', 'Romania'];
const messages = [];
const clients = [];
const PORT = process.env.PORT || 8080;
application.use(express.static('../client'))
	.get('/rooms', (request, response) => response.json(rooms))
	.ws('/', (socket, request) => {
		const client = {socket, room: rooms[0]};
		socket.send(JSON.stringify({
			type: 'room',
			payload: 
				messages
				.filter(m => m.room === client.room)
				.map(m => m.text)
		}));
		clients.push(client);
		socket.on('message', message => {
			const {type, payload} = JSON.parse(message);
			switch (type) {
				case 'room':
					client.room = payload;
					socket.send(JSON.stringify({
						type: 'room',
						payload: messages
							.filter(m => m.room === client.room)
							.map(m => m.text)
					}));
					break;
				case 'chat':
					messages.push({room: client.room, text: payload});
					clients.forEach(c => {
						if (c.room === client.room) {
							c.socket.send(JSON.stringify({
								type: 'chat',
								payload}));
						}
					});
			}
		});
	})
	.listen(PORT, () => console.log(`Server is running on ${PORT}.`));

