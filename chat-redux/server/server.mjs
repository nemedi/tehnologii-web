import express from 'express';
import { WebSocketServer } from 'ws';
const application = express();
const port = process.env.PORT || 8080;
const httpServer = application.listen(port, () => `Server is running on port ${port}.`);
const wsServer = new WebSocketServer({server: httpServer});
application.use(express.static('../client/build'));
wsServer.on('connection', socket =>
	socket.on('message', data =>
		wsServer.clients.forEach(client =>
			client.send(data)
		)
	)
);
