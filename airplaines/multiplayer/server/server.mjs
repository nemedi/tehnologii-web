import express from "express";
import { WebSocketServer } from "ws";
import http from "http";

const application = express();
const server = http.createServer(application);
const wss = new WebSocketServer({ server });

application.use(express.static("../client/build"));

const PORT = 8080;

let waitingPlayer = null;
const games = new Map();

wss.on("connection", (ws) => {
  console.log("Jucător conectat");

  if (!waitingPlayer) {
    waitingPlayer = ws;
    ws.send(JSON.stringify({ type: "waiting" }));
  } else {
    const gameId = Date.now().toString();
    const player1 = waitingPlayer;
    const player2 = ws;
    waitingPlayer = null;

    games.set(gameId, { players: [player1, player2] });

    [player1, player2].forEach((player, idx) => {
      player.send(JSON.stringify({ type: "start", playerIndex: idx, gameId }));
      player.gameId = gameId;
      player.playerIndex = idx;
    });
  }

  ws.on("message", (message) => {
    const data = JSON.parse(message.toString());
    const game = games.get(ws.gameId);
    if (!game) return;

    switch (data.type) {
      case "updateBoard":
        const opponent = game.players[1 - ws.playerIndex];
        opponent.send(JSON.stringify({ type: "opponentBoard", board: data.board, planes: data.planes }));
        break;
      case "attack":
        const op = game.players[1 - ws.playerIndex];
        op.send(JSON.stringify({ type: "attacked", row: data.row, col: data.col }));
        break;
      case "hitResult":
        const atk = game.players[1 - ws.playerIndex];
        atk.send(JSON.stringify({ type: "hitResult", ...data }));
        break;
    }
  });

  ws.on("close", () => {
    console.log("Jucător deconectat");
    if (waitingPlayer === ws) waitingPlayer = null;
  });
});

server.listen(PORT, () => {
  console.log(`Serverul rulează pe http://localhost:${PORT}`);
});
