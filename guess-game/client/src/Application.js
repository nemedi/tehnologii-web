
import { useEffect, useRef, useState } from "react";

export default function App() {
  const ws = useRef(null);
  const [logs, setLogs] = useState([]);
  const [name, setName] = useState("");
  const [guess, setGuess] = useState("");
  const [logged, setLogged] = useState(false);

  useEffect(() => {
    const endpoint = `${window.location.protocol.replace('http', 'ws')}//${window.location.hostname}${window.location.port ? ':8080' : ''}`;
    ws.current = new WebSocket(endpoint);
    ws.current.onmessage = e => setLogs(logs => [...logs, JSON.parse(e.data)]);
  }, []);

  function handleConnection() {
    if (logged) {
      ws.current.send(JSON.stringify({type: "leave"}));
    } else {
      ws.current.send(JSON.stringify({ type: "join", name }));
      setLogged(!logged);
    }
    setLogged(!logged);
    setLogs([]);
  }

  function handleGuess() {
    ws.current.send(JSON.stringify({ type: "guess", value: guess }));
  }

  function getMessage(log) {
    switch (log.type) {
      case "guess":
        return `Atempt from player "${log.player}": (correct digits: ${log.correctDigits}, correct positions: ${log.correctPositions}).`;
      case "join":
        return `Player "${log.player}" has joined the game.`;
      case "leave":
        return `Player "${log.player}" has left the game.`;
      case "win":
          return `Player "${log.player}" has guessed the secret: ${log.secret}.`;
      case "new-game": 
        return "A new game has started.";
      default:
        return JSON.stringify(log);
    }
  }

  return (
    <div>
      <h1>Guess Game</h1>
      <pre>Guess a 4-digits number having different digits.</pre>
      <p>
        <input placeholder="name" onChange={e => setName(e.target.value)} readOnly={logged} /> &nbsp;
        <button onClick={handleConnection}>
          {logged ? "Leave": "Join"}
        </button>
      </p>
      {
        logged && (
          <div>
            <p>
              <input placeholder="guess" onChange={e => setGuess(e.target.value)} /> &nbsp;
              <button onClick={handleGuess}>Guess</button>
            </p>
            <ul>
              {logs.map((log, index) => (
                <li key={index}>{getMessage(log)}</li>
              ))}
            </ul>
        </div>
        )
      }
    </div>
  );
}
