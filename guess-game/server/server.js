
const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const PORT = 8080;
const application = express();
application.use(express.static("../client/build"))
const server = http.createServer(application);
const wss = new WebSocket.Server({ server });
let secret = generateSecret();
const players = new Map();
function generateSecret() {
  const digits = [];
  while (digits.length < 4) {
    const d = Math.floor(Math.random() * 10);
    if (!digits.includes(d)) digits.push(d);
  }
  const secret = digits.join("");
  console.log(`A new secret has been generated: ${secret}`);
  return secret;
}
function broadcast(message) {
  const data = JSON.stringify(message);
  wss.clients.forEach(c => c.readyState === WebSocket.OPEN && players.get(c) && c.send(data));
}
wss.on("connection", ws => {
  ws.on("message", data => {
    const message = JSON.parse(data);
    switch (message.type) {
      case "join":
        players.set(ws, message.name);
        broadcast({ type: "join", player: message.name });
        break;
      case "leave":
        broadcast({ type: "leave", player: players.get(ws) });
        players.set(ws, undefined);
        break;
      case "guess":
        const guess = message.value;
        const name = players.get(ws);
        let cd = 0, cp = 0;
        for (let i = 0; i < 4; i++) {
          if (secret.includes(guess[i])) {
            cd++;
          }
          if (secret[i] === guess[i]) {
            cp++;
          }
        }
        broadcast({ type: "guess", player: name, guess, correctDigits: cd, correctPositions: cp });
        if (cp === 4) {
          broadcast({ type: "win", player: name, secret });
          secret = generateSecret();
          broadcast({ type: "new-game" });
        }
        break;
    }
  });
  ws.on("close", () => {
    const name = players.get(ws);
    players.delete(ws);
    if (name) broadcast({ type: "leave", player: name });
  });
});
server.listen(PORT, () => console.log(`Server is running on port ${PORT}.`));
