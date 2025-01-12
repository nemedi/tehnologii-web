const express = require('express');
const application = express();
const wss = require('express-ws')(application).getWss();
const messages = [];
const PORT = process.env.PORT || 8080;
application.use(express.static('../client'))
	.ws('/', (socket, request) => {
		socket.send(JSON.stringify(messages));
		socket.on('message', message => {
			messages.push(message);
			Array.from(wss.clients)
				.forEach(client =>
					client.send(JSON.stringify(message)));
		});
	})
	.listen(PORT, () => console.log(`Server is running on port ${PORT}.`));

