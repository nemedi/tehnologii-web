const {createServer} = require('http');
const express = require('express');
const socketio = require('socket.io');
const application = express();
const server = createServer(application);
const io = socketio(server);
const messages = [];
const PORT = process.env.PORT || 8080;
application.use(express.static('../client'));
io.on('connection', socket => {
	socket.emit('messages', messages);
	socket.on('message',  message => {
		messages.push(message);
		io.emit('message', message);
	});
});
server.listen(PORT, () => console.log(`Server is running on port ${PORT}.`));