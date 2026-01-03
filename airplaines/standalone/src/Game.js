import { useState, useEffect } from "react";
import "./Game.css";

const BOARD_SIZE = 10;
const PLANES_COUNT = 3;

const PLANE_SHAPES = {
  up: [
    [0,0],
    [1,-2],[1,-1],[1,0],[1,1],[1,2],
    [2,0],
    [3,-1],[3,0],[3,1]
  ],
  down: [
    [0,0],
    [-1,-2],[-1,-1],[-1,0],[-1,1],[-1,2],
    [-2,0],
    [-3,-1],[-3,0],[-3,1]
  ],
  left: [
    [0,0],
    [-2,1],[-1,1],[0,1],[1,1],[2,1],
    [0,2],
    [-1,3],[0,3],[1,3]
  ],
  right: [
    [0,0],
    [-2,-1],[-1,-1],[0,-1],[1,-1],[2,-1],
    [0,-2],
    [-1,-3],[0,-3],[1,-3]
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

function placeRandomPlanes(board){
  const directions = Object.keys(PLANE_SHAPES);
  const planes=[]; let planeId=1;
  while(planes.length<PLANES_COUNT){
    const row=Math.floor(Math.random()*BOARD_SIZE);
    const col=Math.floor(Math.random()*BOARD_SIZE);
    const dir=directions[Math.floor(Math.random()*directions.length)];
    const shape=PLANE_SHAPES[dir];
    if(isValidPosition(board,row,col,shape)){
      shape.forEach(([dr,dc],idx)=>board[row+dr][col+dc]={type:idx===0?"head":"body",planeId});
      planes.push({id:planeId,hits:0,size:shape.length,shape,dir});
      planeId++;
    }
  }
  return {board,planes};
}

export default function Game() {
  const [playerBoard,setPlayerBoard]=useState(createEmptyBoard());
  const [playerPlanes,setPlayerPlanes]=useState([]);
  const [placing,setPlacing]=useState(true);
  const [currentPlaneId,setCurrentPlaneId]=useState(1);
  const [currentDirection,setCurrentDirection]=useState("up");
  const [hoverCell, setHoverCell] = useState(null);

  const [{board:aiBoard,planes:aiPlanes},setAi]=useState(()=>placeRandomPlanes(createEmptyBoard()));
  const [playerTurn,setPlayerTurn]=useState(true);
  const [gameOver,setGameOver]=useState(false);
  const [winner,setWinner]=useState(null);
  const [aiMemory,setAiMemory]=useState([]);

  const handlePlacePlane=(row,col)=>{
    if(!placing) return;
    const shape=PLANE_SHAPES[currentDirection];
    if(isValidPosition(playerBoard,row,col,shape)){
      const newBoard=playerBoard.map(r=>r.map(c=>({...c})));
      shape.forEach(([dr,dc],idx)=>{
        newBoard[row+dr][col+dc]={type:idx===0?"head":"body",planeId:currentPlaneId, row:row+dr, col:col+dc, baseRow:row, baseCol:col};
      });
      setPlayerBoard(newBoard);
      setPlayerPlanes([...playerPlanes,{id:currentPlaneId,hits:0,size:shape.length,shape,dir:currentDirection,baseRow:row,baseCol:col}]);
      if(currentPlaneId===PLANES_COUNT) setPlacing(false);
      else setCurrentPlaneId(currentPlaneId+1);
    } else alert("Poziție invalidă sau suprapunere!");
  };

  const checkWinner=(planes)=>planes.filter(p=>p.hits===p.size).length===PLANES_COUNT;

  const handlePlayerAttack=(row,col)=>{
    if(!playerTurn||gameOver) return;
    const newBoard=aiBoard.map(r=>r.map(c=>({...c})));
    const cell=newBoard[row][col];

    if(!cell.type) newBoard[row][col].type="miss";
    else if(cell.type==="head"){
      aiPlanes.forEach(p=>{
        if(p.id===cell.planeId){
          p.hits=p.size;
          newBoard.forEach((r,rIdx)=>r.forEach((c,cIdx)=>{
            if(c.planeId===p.id) newBoard[rIdx][cIdx].type="hit";
          }));
        }
      });
    } else if(cell.type==="body") newBoard[row][col].type="hit";

    setAi({board:newBoard,planes:aiPlanes});
    if(checkWinner(aiPlanes)){ setGameOver(true); setWinner("Jucătorul"); return;}
    setPlayerTurn(false);
  };

  const aiAttack=()=>{
    const newBoard=playerBoard.map(r=>r.map(c=>({...c})));
    let row,col;
    let targetFound=false;

    for(let m of aiMemory){
      const adj=[[0,1],[0,-1],[1,0],[-1,0]];
      for(let [dr,dc] of adj){
        const r=m[0]+dr; const c=m[1]+dc;
        if(r>=0 && r<BOARD_SIZE && c>=0 && c<BOARD_SIZE && newBoard[r][c].type!=="hit" && newBoard[r][c].type!=="miss"){
          row=r; col=c; targetFound=true; break;
        }
      }
      if(targetFound) break;
    }

    while(!targetFound){
      row=Math.floor(Math.random()*BOARD_SIZE);
      col=Math.floor(Math.random()*BOARD_SIZE);
      const cell=newBoard[row][col];
      if(!cell.type || (cell.type!=="hit"&&cell.type!=="miss")) break;
    }

    const cell=newBoard[row][col];
    if(cell.type==="head"){
      playerPlanes.forEach(p=>{
        if(p.id===cell.planeId){
          p.hits = p.size;
          newBoard.forEach((r,rIdx)=>r.forEach((c,cIdx)=>{
            if(c.planeId===p.id) newBoard[rIdx][cIdx].type="hit";
          }));
        }
      });
      setAiMemory([...aiMemory,[row,col]]);
    } else if(cell.type==="body") {
      newBoard[row][col].type="hit";
    } else newBoard[row][col].type="miss";

    setPlayerBoard(newBoard);
    if(checkWinner(playerPlanes)){ setGameOver(true); setWinner("Calculatorul"); return;}
    setPlayerTurn(true);
  };

  useEffect(()=>{
    if(!playerTurn && !gameOver){
      const timer=setTimeout(aiAttack,500);
      return ()=>clearTimeout(timer);
    }
  },[playerTurn]);

  const getCellStyle=(cell, board, planes, isPlayerBoard = false)=>{
    let style={
      width:30,
      height:30,
      display:"flex",
      alignItems:"center",
      justifyContent:"center",
      fontWeight:"bold",
      fontSize:14,
      transition:"all 0.2s ease",
      cursor:placing && isPlayerBoard?"pointer":"default",
      border:"1px solid black"
    };

    if(cell.type==="miss") style.backgroundColor="lightgray";
    else if(cell.type==="hit"){
      const plane=planes.find(p=>p.id===cell.planeId);
      if(plane && plane.hits===plane.size){
        style.backgroundColor="black";
        style.color="white";
      } else style.backgroundColor="red";
    } else {
      if(isPlayerBoard && cell.planeId) style.backgroundColor="lightblue";
      else style.backgroundColor="white";
    }

    return style;
  };

  const getCellContent=(cell)=>cell.type==="hit"?"X":"";

  const directionLabels = {
    "up": "sus",
    "down": "jos",
    "left": "stânga",
    "right": "dreapta"
  }

  const handleReset=()=>{
    setPlayerBoard(createEmptyBoard());
    setPlayerPlanes([]);
    setPlacing(true);
    setCurrentPlaneId(1);
    setCurrentDirection("up");
    setAi(placeRandomPlanes(createEmptyBoard()));
    setPlayerTurn(true);
    setGameOver(false);
    setWinner(null);
    setAiMemory([]);
    setHoverCell(null);
  };

  return (
    <div style={{padding:20}}>
      <h1>Jocul "Avionașele"</h1>
      {placing && <div style={{marginBottom:10}}>
        <p>Plasează avionul {currentPlaneId} - Orientare: {directionLabels[currentDirection]}</p>
        <button onClick={()=>setCurrentDirection("up")}>↑ Sus</button>
        <button onClick={()=>setCurrentDirection("down")}>↓ Jos</button>
        <button onClick={()=>setCurrentDirection("left")}>← Stânga</button>
        <button onClick={()=>setCurrentDirection("right")}>→ Dreapta</button>
      </div>}

      <h2>Tabla jucătorului</h2>
      <div style={{display:"grid",gridTemplateColumns:`repeat(${BOARD_SIZE},30px)`,gap:2}}>
        {playerBoard.map((row,rIdx)=>row.map((cell,cIdx)=>{
          let isHover=false;
          if(hoverCell && placing){
            const shape=PLANE_SHAPES[currentDirection];
            isHover=shape.some(([dr,dc])=>rIdx===hoverCell.row+dr && cIdx===hoverCell.col+dc);
          }
          return (
            <div key={`${rIdx}-${cIdx}`}
                 style={{
                   ...getCellStyle(cell, playerBoard, playerPlanes, true),
                   backgroundColor: isHover ? "lightgreen" : getCellStyle(cell, playerBoard, playerPlanes, true).backgroundColor
                 }}
                 onClick={()=>placing && handlePlacePlane(rIdx,cIdx)}
                 onMouseEnter={()=>placing && setHoverCell({row:rIdx,col:cIdx})}
                 onMouseLeave={()=>placing && setHoverCell(null)}>
              {getCellContent(cell)}
            </div>
          )
        }))}
      </div>

      {!placing && <>
        <h2>Tabla calculatorului</h2>
        <div style={{display:"grid",gridTemplateColumns:`repeat(${BOARD_SIZE},30px)`,gap:2}}>
          {aiBoard.map((row,rIdx)=>row.map((cell,cIdx)=>
            <div key={`${rIdx}-${cIdx}`} style={getCellStyle({...cell,row:rIdx,col:cIdx}, aiBoard, aiPlanes)}
                 onClick={()=>handlePlayerAttack(rIdx,cIdx)}>
              {getCellContent(cell)}
            </div>
          ))}
        </div>
      </>}

      {gameOver && <h2 style={{color:"green"}}>🎉 {winner} a câștigat! 🎉</h2>}
      <p>
        <button onClick={handleReset} style={{marginTop:10}}>🔄 Resetare joc</button>
      </p>
    </div>
  );
}
