const {createServer} = require('http');
const express = require('express');
const socketio = require('socket.io');
const application = express();
const server = createServer(application);
const io = socketio(server);
const rooms = ['*', 'Hungary', 'Romania'];
const messages = [];
application.use(express.static(`${__dirname}/public`))
	.get('/rooms', (request, response) => response.json(rooms));
io.on('connection', socket => {
	socket.join(rooms[0]);
	socket.room = rooms[0];
	socket.emit('room',
			messages
			.filter(m => m.room === socket.room)
			.map(m => m.text));
	socket.on('room', room => {
		socket.leave(socket.room);
		socket.join(room);
		socket.room = room;
		socket.emit('room',
			messages
			.filter(m => m.room === socket.room)
			.map(m => m.text));
	});
	socket.on('chat', message => {
		messages.push({room: socket.room, text: message});
		io.to(socket.room).emit('chat', message);
	});
});
server.listen(process.env.PORT || 8080,
	() => console.log('Server is running.'));