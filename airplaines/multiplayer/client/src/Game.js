import { useState, useEffect } from "react";
import "./Game.css";

const BOARD_SIZE = 10;
const PLANES_COUNT = 3;

/* ================== PLANE SHAPES ================== */
const PLANE_SHAPES = {
  up: [
    [0,0],[1,-2],[1,-1],[1,0],[1,1],[1,2],
    [2,0],[3,-1],[3,0],[3,1]
  ],
  down: [
    [0,0],[-1,-2],[-1,-1],[-1,0],[-1,1],[-1,2],
    [-2,0],[-3,-1],[-3,0],[-3,1]
  ],
  left: [
    [0,0],[-2,1],[-1,1],[0,1],[1,1],[2,1],
    [0,2],[-1,3],[0,3],[1,3]
  ],
  right: [
    [0,0],[-2,-1],[-1,-1],[0,-1],[1,-1],[2,-1],
    [0,-2],[-1,-3],[0,-3],[1,-3]
  ]
};

/* ================== HELPERS ================== */
function createEmptyBoard() {
  return Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, () => ({
      type: null,
      planeId: null,
      hit: false,
      miss: false
    }))
  );
}

function isValidPosition(board, row, col, shape) {
  return shape.every(([dr, dc]) => {
    const r = row + dr;
    const c = col + dc;
    return (
      r >= 0 && r < BOARD_SIZE &&
      c >= 0 && c < BOARD_SIZE &&
      !board[r][c].type
    );
  });
}

/* ================== COMPONENT ================== */
export default function Game() {
  const [ws, setWs] = useState(null);

  const [playerBoard, setPlayerBoard] = useState(createEmptyBoard());
  const [opponentBoard, setOpponentBoard] = useState(createEmptyBoard());

  const [playerPlanes, setPlayerPlanes] = useState([]);

  const [placing, setPlacing] = useState(true);
  const [currentPlaneId, setCurrentPlaneId] = useState(1);
  const [currentDirection, setCurrentDirection] = useState("up");
  const [hoverCell, setHoverCell] = useState(null);

  const [gameStarted, setGameStarted] = useState(false);
  const [playerTurn, setPlayerTurn] = useState(false);

  /* ================== STATUS TEXT ================== */
  const getStatusText = () => {
    if (placing) {
      return `Plasează avionul ${currentPlaneId}`;
    }
    if (!gameStarted) {
      return "Așteptăm adversarul să fie gata...";
    }
    if (playerTurn) {
      return "Este rândul tău să ataci";
    }
    return "Așteaptă atacul adversarului";
  };

  /* ================== SOCKET ================== */
  useEffect(() => {
    const socket = new WebSocket(
      `${window.location.protocol.replace("http","ws")}//${window.location.hostname}:8080`
    );
    setWs(socket);

    socket.onmessage = (msg) => {
      const data = JSON.parse(msg.data);

      switch (data.type) {
        case "waiting":
          alert("Așteptăm al doilea jucător...");
          break;

        case "bothReady":
          setGameStarted(true);
          setPlayerTurn(data.yourTurn);
          break;

        case "attacked":
          handleBeingAttacked(data);
          break;

        case "attackResult":
          updateOpponentAfterAttack(data);
          break;

        case "turn":
          setPlayerTurn(data.yourTurn);
          break;
      }
    };
  }, []);

  /* ================== PLACING ================== */
  const handlePlacePlane = (row, col) => {
    const shape = PLANE_SHAPES[currentDirection];
    if (!isValidPosition(playerBoard, row, col, shape)) return;

    const newBoard = playerBoard.map(r => r.map(c => ({ ...c })));

    shape.forEach(([dr, dc], idx) => {
      newBoard[row + dr][col + dc] = {
        ...newBoard[row + dr][col + dc],
        type: idx === 0 ? "head" : "body",
        planeId: currentPlaneId
      };
    });

    const newPlanes = [
      ...playerPlanes,
      { id: currentPlaneId, hits: 0, size: shape.length }
    ];

    setPlayerBoard(newBoard);
    setPlayerPlanes(newPlanes);

    if (currentPlaneId === PLANES_COUNT) {
      setPlacing(false);
      ws.send(JSON.stringify({
        type: "updateBoard",
        board: newBoard,
        planes: newPlanes
      }));
    } else {
      setCurrentPlaneId(p => p + 1);
    }
  };

  /* ================== ATTACK ================== */
  const handleAttack = (row, col) => {
    if (!gameStarted || !playerTurn || placing) return;
    ws.send(JSON.stringify({ type: "attack", row, col }));
  };

  const handleBeingAttacked = ({ row, col }) => {
    const newBoard = playerBoard.map(r => r.map(c => ({ ...c })));
    const cell = newBoard[row][col];

    if (cell.type) cell.hit = true;
    else cell.miss = true;

    setPlayerBoard(newBoard);
  };

  const updateOpponentAfterAttack = ({ row, col, hit }) => {
    const newBoard = opponentBoard.map(r => r.map(c => ({ ...c })));
    hit ? newBoard[row][col].hit = true : newBoard[row][col].miss = true;
    setOpponentBoard(newBoard);
  };

  /* ================== UI ================== */
  const getCellStyle = (cell, isPlayer = false) => ({
    width: 30,
    height: 30,
    border: "1px solid black",
    backgroundColor:
      cell.hit ? "red" :
      cell.miss ? "lightgray" :
      isPlayer && cell.planeId ? "lightblue" :
      "white",
    cursor:
      placing && isPlayer
        ? "pointer"
        : !placing && !isPlayer && playerTurn
        ? "pointer"
        : "default"
  });

  return (
    <div style={{ padding: 20 }}>
      <h1>Avionașe Multiplayer</h1>

      {/* STATUS */}
      <h2 style={{ marginBottom: 10 }}>
        {getStatusText()}
      </h2>

      {/* DIRECTION BUTTONS */}
      {placing && (
        <div style={{ marginBottom: 10 }}>
          {["up","down","left","right"].map(d =>
            <button key={d} onClick={() => setCurrentDirection(d)}>
              {d}
            </button>
          )}
        </div>
      )}

      {/* PLAYER BOARD */}
      <h3>Tabla ta</h3>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${BOARD_SIZE},30px)` }}>
        {playerBoard.map((row, r) =>
          row.map((cell, c) => {
            let hover = false;
            if (hoverCell && placing) {
              hover = PLANE_SHAPES[currentDirection]
                .some(([dr, dc]) => r === hoverCell.row + dr && c === hoverCell.col + dc);
            }
            return (
              <div
                key={`${r}-${c}`}
                className={hover ? "hover-cell" : ""}
                style={getCellStyle(cell, true)}
                onClick={() => placing && handlePlacePlane(r, c)}
                onMouseEnter={() => placing && setHoverCell({ row: r, col: c })}
                onMouseLeave={() => placing && setHoverCell(null)}
              />
            );
          })
        )}
      </div>

      {/* OPPONENT BOARD */}
      <h3>Tabla adversarului {playerTurn && gameStarted ? "(Tura ta)" : ""}</h3>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${BOARD_SIZE},30px)` }}>
        {opponentBoard.map((row, r) =>
          row.map((cell, c) => (
            <div
              key={`${r}-${c}`}
              style={getCellStyle(cell)}
              onClick={() => handleAttack(r, c)}
            />
          ))
        )}
      </div>
    </div>
  );
}
