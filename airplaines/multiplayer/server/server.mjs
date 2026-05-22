import express from "express";
import http from "http";
import { WebSocketServer } from "ws";

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const PORT = 8080;

app.use(express.static("../client/build"));

let waitingPlayer = null;
const games = new Map();

/*
game = {
  players: [ws0, ws1],
  boards: [board0, board1],
  planes: [planes0, planes1],
  ready: [false, false],
  turn: 0
}
*/

wss.on("connection", (ws) => {

  /* ===== MATCHMAKING ===== */
  if (!waitingPlayer) {
    waitingPlayer = ws;
    ws.send(JSON.stringify({ type: "waiting" }));
  } else {
    const gameId = Date.now().toString();
    const p1 = waitingPlayer;
    const p2 = ws;
    waitingPlayer = null;

    games.set(gameId, {
      players: [p1, p2],
      boards: [null, null],
      planes: [null, null],
      ready: [false, false],
      turn: 0
    });

    [p1, p2].forEach((p, idx) => {
      p.gameId = gameId;
      p.playerIndex = idx;
      p.send(JSON.stringify({ type: "start", playerIndex: idx }));
    });
  }

  /* ===== GAME LOGIC ===== */
  ws.on("message", (msg) => {
    const data = JSON.parse(msg.toString());
    const game = games.get(ws.gameId);
    if (!game) return;

    const me = ws.playerIndex;
    const enemy = 1 - me;

    switch (data.type) {

      /* === BOARD READY === */
      case "updateBoard":
        game.boards[me] = data.board;
        game.planes[me] = data.planes;
        game.ready[me] = true;

        if (game.ready[0] && game.ready[1]) {
          game.players.forEach((p, i) =>
            p.send(JSON.stringify({
              type: "bothReady",
              yourTurn: i === game.turn
            }))
          );
        }
        break;

      /* === ATTACK === */
      case "attack":
        if (game.turn !== me) return;

        const cell = game.boards[enemy][data.row][data.col];

        let hit = false;
        let destroyed = false;
        let planeId = null;

        if (cell.type === "head") {
          hit = true;
          destroyed = true;
          planeId = cell.planeId;

          game.boards[enemy].forEach(r =>
            r.forEach(c => {
              if (c.planeId === planeId) c.hit = true;
            })
          );

          game.planes[enemy] =
            game.planes[enemy].map(p =>
              p.id === planeId ? { ...p, hits: p.size } : p
            );

        } else if (cell.type === "body") {
          hit = true;
          planeId = cell.planeId;
          cell.hit = true;
        } else {
          cell.miss = true;
        }

        game.turn = enemy;

        game.players[enemy].send(JSON.stringify({
          type: "attacked",
          row: data.row,
          col: data.col,
          hit,
          destroyed,
          planeId
        }));

        game.players[me].send(JSON.stringify({
          type: "attackResult",
          row: data.row,
          col: data.col,
          hit,
          destroyed,
          planeId
        }));

        game.players.forEach((p, i) =>
          p.send(JSON.stringify({
            type: "turn",
            yourTurn: i === game.turn
          }))
        );

        break;
    }
  });
});

server.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
