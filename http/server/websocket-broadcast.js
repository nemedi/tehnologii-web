const express = require('express');
const application = express();
require('express-ws')(application);
const sockets = [];
const PORT = 8080;
application.use(express.static('../client'))
	.ws('/', (socket, request) => {
		sockets.push(socket);
		socket.on('message', message =>
            sockets.forEach(s =>
                s.send(message)
            )
		);
		socket.on('close', (code, reason) => {
			let index = sockets.indexOf(socket);
			if (index !== -1) {
				sockets.splice(index, 1);
			}
		});
	})
	.listen(PORT, () => console.log(`Server is running on ${PORT}.`));

