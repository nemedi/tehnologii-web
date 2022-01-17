const {createServer} = require('http');
const express = require('express');
const socketio = require('socket.io');
const application = express();
const server = createServer(application);
const io = socketio(server);
const messages = [];
application.use(express.static(`${__dirname}/public`));
io.on('connection', socket => {
	socket.emit('messages', messages);
	socket.on('message',  message => {
		messages.push(message);
		io.emit('message', message);
	});
});
server.listen(process.env.PORT || 8080,
	() => console.log('Server is running.'));