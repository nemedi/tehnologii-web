import { useState } from 'react';
import Board from './Board.jsx';

const PLAYERS = ['X', '0'];
const WINS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

function whoIsTheWinner(squares) {
  for (const [a, b, c] of WINS) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

const initialState = () => ({
  history: [{ squares: Array(9).fill(null) }],
  next: 0,
  step: 0,
});

function Game() {
  const [state, setState] = useState(initialState);

  function handleClick(index) {
    const history = state.history.slice(0, state.step + 1);
    const squares = [...history[history.length - 1].squares];
    if (whoIsTheWinner(squares) || squares[index]) {
      return;
    }
    squares[index] = PLAYERS[state.next];
    setState({
      history: [...history, { squares }],
      next: 1 - state.next,
      step: history.length,
    });
  }

  function jumpTo(step) {
    setState({ ...state, step, next: step % 2 });
  }

  const current = state.history[state.step];
  const winner = whoIsTheWinner(current.squares);
  const status = winner
    ? `Winner: ${winner}`
    : state.step < 9
      ? `Next Player: ${PLAYERS[state.next]}`
      : 'Game Over';

  return (
    <div className="game">
      <div className="game-board">
        <Board squares={current.squares} onClick={handleClick} />
      </div>
      <div className="game-info">
        <div className="status">{status}</div>
        <div>
          <button type="button" className="link" onClick={() => setState(initialState())}>
            Reset
          </button>
        </div>
        <ol start="0">
          {state.history.map((_, move) => (
            <li key={move}>
              <button type="button" className="link" onClick={() => jumpTo(move)}>
                {move ? `Move #${move}` : 'Game Start'}
              </button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export default Game;
