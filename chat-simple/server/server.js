const {createServer} = require('http');
const express = require('express');
const {join, resolve} = require('path');
const socketio = require('socket.io');
const application = express();
const server = createServer(application);
const io = socketio(server);
const messages = {};
const rooms = ['Romania', 'Hungary'];
application.use(express.static(join(resolve('..'), 'client')))
	.get('/rooms', (request, response) => response.json(rooms));
io.on('connection', socket => {
	socket.on('join', ({user, room}) => {
		if (Object.keys(io.sockets.sockets).find(s => s.user === user)) {
			socket.emit('deny', 'Another user with the same name already exists.');
		} else {
			if (socket.user && socket.room) {
				socket.leave(socket.room);
				io.to(socket.room).emit('userLeft', socket.user);
				delete socket.room;
				socket.emit('exit');
			}
			socket.user = user;
			socket.room = room;
			socket.join(room);
			socket.emit('enter', {
				users: Object.keys(io.sockets.sockets)
						.filter(s => s.user)
						.map(s => s.user),
				messages: messages[room] ? messages[room] : []
			});
			io.to(room).emit('userJoined', {user});
		}
	});
	socket.on('leave', () => {
		if (socket.user && socket.room) {
			socket.leave(socket.room);
			io.to(socket.room).emit('userLeft', socket.user);
			delete socket.room;
			socket.emit('exit');
		}
	});
	socket.on('chat', text => {
		if (socket.user && socket.room) {
			if (!messages[socket.room]) {
				messages[socket.room] = [];
			}
			let message = {user: socket.user, text}
			messages[socket.room].push(message);
			io.to(socket.room).emit('chat', message);
		}
	});
});
const port = process.env.PORT || 8080;
server.listen(port,
	() => console.log(`Server is running on ${port}.`));