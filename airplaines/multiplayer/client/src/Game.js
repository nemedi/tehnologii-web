import { useState, useEffect } from "react";
import './Game.css';

const BOARD_SIZE = 10;
const PLANES_COUNT = 3;

// Formă avion mare
const PLANE_SHAPES = {
  up: [
    [0,0], [1,-2],[1,-1],[1,0],[1,1],[1,2],
    [2,0], [3,-1],[3,0],[3,1]
  ],
  down: [
    [0,0], [-1,-2],[-1,-1],[-1,0],[-1,1],[-1,2],
    [-2,0], [-3,-1],[-3,0],[-3,1]
  ],
  left: [
    [0,0], [-2,1],[-1,1],[0,1],[1,1],[2,1],
    [0,2], [-1,3],[0,3],[1,3]
  ],
  right: [
    [0,0], [-2,-1],[-1,-1],[0,-1],[1,-1],[2,-1],
    [0,-2], [-1,-3],[0,-3],[1,-3]
  ]
};

function createEmptyBoard() {
  return Array(BOARD_SIZE).fill(null).map(()=>Array(BOARD_SIZE).fill({ type: null, planeId: null }));
}

function isValidPosition(board,row,col,shape){
  return shape.every(([dr,dc])=>{
    const r=row+dr; const c=col+dc;
    return r>=0 && r<BOARD_SIZE && c>=0 && c<BOARD_SIZE && !board[r][c].type;
  });
}

export default function Game() {
  const [ws,setWs] = useState(null);
  const [playerBoard,setPlayerBoard]=useState(createEmptyBoard());
  const [opponentBoard,setOpponentBoard]=useState(createEmptyBoard());
  const [playerPlanes,setPlayerPlanes]=useState([]);
  const [opponentPlanes,setOpponentPlanes]=useState([]);
  const [placing,setPlacing]=useState(true);
  const [currentPlaneId,setCurrentPlaneId]=useState(1);
  const [currentDirection,setCurrentDirection]=useState("up");
  const [hoverCell, setHoverCell] = useState(null);
  const [playerTurn,setPlayerTurn] = useState(false);
  const [gameStarted,setGameStarted] = useState(false);
  const [winner,setWinner] = useState(null);

  useEffect(()=>{
    const endpoint = `${window.location.protocol.replace('http', 'ws')}//${window.location.hostname}${window.location.port ? ':8080' : ''}`;
    const socket = new WebSocket(endpoint);
    setWs(socket);

    socket.onmessage = (message) => {
      const data = JSON.parse(message.data);
      switch(data.type){
        case "waiting":
          alert("Așteptăm al doilea jucător...");
          break;
        case "start":
          setGameStarted(true);
          setPlayerTurn(data.playerIndex === 0);
          break;
        case "opponentBoard":
          setOpponentBoard(data.board);
          setOpponentPlanes(data.planes);
          break;
        case "attacked":
          handleBeingAttacked(data.row,data.col);
          break;
        case "hitResult":
          updateOpponentAfterAttack(data.row,data.col,data.hit,data.destroyed,data.planeId);
          break;
      }
    }
  }, []);

  const handlePlacePlane=(row,col)=>{
    const shape=PLANE_SHAPES[currentDirection];
    if(isValidPosition(playerBoard,row,col,shape)){
      const newBoard=playerBoard.map(r=>r.map(c=>({...c})));
      shape.forEach(([dr,dc],idx)=>{
        newBoard[row+dr][col+dc]={type:idx===0?"head":"body",planeId:currentPlaneId};
      });
      setPlayerBoard(newBoard);
      const newPlanes = [...playerPlanes,{id:currentPlaneId,hits:0,size:shape.length}];
      setPlayerPlanes(newPlanes);
      if(currentPlaneId===PLANES_COUNT){
        setPlacing(false);
        ws.send(JSON.stringify({type:"updateBoard", board:newBoard, planes:newPlanes}));
      } else setCurrentPlaneId(currentPlaneId+1);
    }
  };

  const handleAttack=(row,col)=>{
    if(!playerTurn || placing || winner) return;
    ws.send(JSON.stringify({type:"attack", row, col}));
  };

  const handleBeingAttacked=(row,col)=>{
    const newBoard = playerBoard.map(r=>r.map(c=>({...c})));
    let hit=false, destroyed=false, planeId=null;
    const cell = newBoard[row][col];
    if(cell.type==="head"){
      planeId = cell.planeId;
      playerPlanes.forEach(p=>{
        if(p.id===planeId) p.hits = p.size;
      });
      newBoard.forEach((r,rIdx)=>r.forEach((c,cIdx)=>{
        if(c.planeId===planeId) newBoard[rIdx][cIdx].type="hit";
      }));
      hit=true;
      destroyed=true;
    } else if(cell.type==="body"){
      newBoard[row][col].type="hit";
      hit=true;
      planeId = cell.planeId;
    } else newBoard[row][col].type="miss";

    setPlayerBoard(newBoard);
    ws.send(JSON.stringify({type:"hitResult", row, col, hit, destroyed, planeId}));
    setPlayerTurn(true);
    checkWinner(playerPlanes, "Calculator");
  };

  const updateOpponentAfterAttack=(row,col,hit,destroyed,planeId)=>{
    const newBoard = opponentBoard.map(r=>r.map(c=>({...c})));
    if(hit) newBoard[row][col].type="hit";
    else newBoard[row][col].type="miss";

    if(hit && destroyed && planeId){
      opponentPlanes.forEach(p=>{
        if(p.id===planeId){
          newBoard.forEach((r,rIdx)=>r.forEach((c,cIdx)=>{
            if(c.planeId===planeId) newBoard[rIdx][cIdx].destroyed=true;
          }));
        }
      });
      const newPlanes = opponentPlanes.map(p=>p.id===planeId ? {...p, hits:p.size} : p);
      setOpponentPlanes(newPlanes);
      checkWinner(newPlanes, "Jucător");
    }

    setOpponentBoard(newBoard);
    setPlayerTurn(false);
  };

  const checkWinner=(planes, who)=>{
    if(planes.every(p=>p.hits===p.size)){
      setWinner(who);
    }
  };

  const getCellStyle=(cell, isPlayerBoard=false)=>{
    let style={
      width:30, height:30,
      display:"flex",
      alignItems:"center",
      justifyContent:"center",
      fontWeight:"bold",
      fontSize:14,
      transition:"all 0.2s ease",
      cursor:placing && isPlayerBoard?"pointer":(!placing && !isPlayerBoard && playerTurn && !winner?"pointer":"default"),
      border:"1px solid black",
      backgroundColor: "white"
    };

    if(cell.type==="miss") style.backgroundColor="lightgray";
    else if(cell.type==="hit") style.backgroundColor="red";
    else if(isPlayerBoard && cell.planeId) style.backgroundColor="lightblue";

    return style;
  };

  const getCellContent=(cell)=>cell.type==="hit"?"X":"";

  const handleReset=()=>{
    setPlayerBoard(createEmptyBoard());
    setOpponentBoard(createEmptyBoard());
    setPlayerPlanes([]);
    setOpponentPlanes([]);
    setPlacing(true);
    setCurrentPlaneId(1);
    setCurrentDirection("up");
    setWinner(null);
  };

  return (
    <div style={{padding:20}}>
      <h1>Avionașe Multiplayer</h1>
      {placing && <div style={{marginBottom:10}}>
        <p>Plasează avionul {currentPlaneId} - Orientare: {currentDirection}</p>
        <button onClick={()=>setCurrentDirection("up")}>↑ Up</button>
        <button onClick={()=>setCurrentDirection("down")}>↓ Down</button>
        <button onClick={()=>setCurrentDirection("left")}>← Left</button>
        <button onClick={()=>setCurrentDirection("right")}>→ Right</button>
      </div>}

      <h2>Tabla Jucător</h2>
      <div style={{display:"grid", gridTemplateColumns:`repeat(${BOARD_SIZE},30px)`, gap:2}}>
        {playerBoard.map((row,rIdx)=>row.map((cell,cIdx)=>{
          let isHover=false;
          if(hoverCell && placing){
            const shape=PLANE_SHAPES[currentDirection];
            isHover=shape.some(([dr,dc])=>rIdx===hoverCell.row+dr && cIdx===hoverCell.col+dc);
          }
          return (
            <div key={`${rIdx}-${cIdx}`}
                 className={isHover ? "hover-cell" : ""}
                 style={getCellStyle(cell,true)}
                 onClick={()=>placing && handlePlacePlane(rIdx,cIdx)}
                 onMouseEnter={()=>placing && setHoverCell({row:rIdx,col:cIdx})}
                 onMouseLeave={()=>placing && setHoverCell(null)}>
              {getCellContent(cell)}
            </div>
          )
        }))}
      </div>

      <h2>Tabla Adversarului {playerTurn && !placing && !winner ? "(Tura ta)" : ""}</h2>
      <div style={{display:"grid", gridTemplateColumns:`repeat(${BOARD_SIZE},30px)`, gap:2}}>
        {opponentBoard.map((row,rIdx)=>row.map((cell,cIdx)=>
          <div key={`${rIdx}-${cIdx}`} 
               className={cell.destroyed ? "destroyed-cell" : cell.type==="hit" ? "hit-cell" : cell.type==="miss" ? "miss-cell" : ""}
               style={{...getCellStyle(cell)}}
               onClick={()=>handleAttack(rIdx,cIdx)}>
            {getCellContent(cell)}
          </div>
        ))}
      </div>

      <h3>Avioane rămase Jucător: {playerPlanes.filter(p=>p.hits<p.size).length}</h3>
      <h3>Avioane rămase Adversar: {opponentPlanes.filter(p=>p.hits<p.size).length}</h3>

      {winner && <h2 style={{color:"green"}}>🎉 {winner} a câștigat! 🎉</h2>}
      <button onClick={handleReset} style={{marginTop:10}}>🔄 Reset Joc</button>
    </div>
  );
}
