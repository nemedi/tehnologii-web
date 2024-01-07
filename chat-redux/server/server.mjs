import express from 'express';
import {join, resolve} from 'path';
import { WebSocketServer } from 'ws';
const application = express();
const port = process.env.PORT || 8080;
const httpServer = application.listen(port, () => `Server ia running on port ${port}.`);
const wsServer = new WebSocketServer({server: httpServer});
application.use(express.static(join(resolve('..'), 'client/build')));
wsServer.on('connection', socket =>
	socket.on('message', data =>
		wsServer.clients.forEach(client =>
			client.send(data)
		)
	)
);
