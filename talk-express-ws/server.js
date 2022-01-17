const express = require('express');
const application = express();
const wss = require('express-ws')(application).getWss();
const messages = [];
application.use(express.static(`${__dirname}/public`))
	.ws('/', (socket, request) => {
		socket.send(JSON.stringify(messages));
		socket.on('message', message => {
			messages.push(message);
			Array.from(wss.clients).forEach(client =>
				client.send(JSON.stringify(message)));
		});
	})
	.listen(process.env.PORT || 8080,
		() => console.log('Server is running.'));

