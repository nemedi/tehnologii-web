const {createServer} = require('http');
const express = require('express');
const socketio = require('socket.io');
const application = express();
const server = createServer(application);
const io = socketio(server);
const rooms = ['*', 'Hungary', 'Romania'];
const messages = {};
rooms.forEach(room => messages[room] = []);
function enterRoom(socket, room) {
	if (socket.room) {
		socket.leave(socket.room);
	}
	socket.join(room);
	socket.room = room;
	socket.emit('room', messages[room]);
}
application.use(express.static('../client'))
	.get('/rooms', (request, response) => response.json(rooms));
io.on('connection', socket => {
	enterRoom(socket, rooms[0]);
	socket.on('room', room => enterRoom(socket, room));
	socket.on('chat', message => {
		messages[socket.room].push(message);
		io.to(socket.room).emit('chat', message);
	});
});
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`Server is running on ${PORT}.`));