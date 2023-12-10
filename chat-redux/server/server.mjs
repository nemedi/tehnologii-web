import { WebSocketServer } from 'ws';
const port = process.env.PORT || 8080;
const server = new WebSocketServer({port});
server.on('connection', socket =>
	socket.on('message', data =>
		server.clients.forEach(client =>
			client.send(data)
		)
	)
);
