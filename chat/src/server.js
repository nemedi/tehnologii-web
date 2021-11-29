const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const path = require("path");
const formatMessage = require("./message");
const {
  getActiveUser,
  exitRoom,
  newUser,
  getIndividualRoomUsers
} = require("./users");

const application = express();
const server = http.createServer(application);
const io = socketio(server);

application.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = newUser(socket.id, username, room);
    socket.join(user.room);
    socket.emit(
      "message",
      formatMessage("Administrator", "Messages are limited to this room! ")
    );
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage("Administrator", `${user.username} has joined the room`)
      );
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getIndividualRoomUsers(user.room)
    });
  });
  socket.on("chatMessage", (msg) => {
    const user = getActiveUser(socket.id);

    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });
  socket.on("disconnect", () => {
    const user = exitRoom(socket.id);

    if (user) {
      socket
        .to(user.room)
        .emit(
          "message",
          formatMessage("Administrator", `${user.name} has left the room`)
        );

      // Current active users and room name
      socket.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getIndividualRoomUsers(user.room)
      });
    }
  });
});
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
