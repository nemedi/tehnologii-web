import { useState } from "react";
import Board from "./Board";
function Game(properties) {
    const initialState = {
        history: [{squares: Array(9).fill(null)}],
        next: 0,
        step: 0
    };
    const [state, setState] = useState(initialState);
    const players = ['X', '0'];
    function whoIsTheWinner(squares) {
        const wins = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];
        for (let [a, b, c] of wins) {
            if (squares[a]
                && squares[a] === squares[b]
                && squares[a] === squares[c]) {
                return squares[a];
            }
        }
        return null;
    }
    function handleClick(i) {
        const history = state.history.slice(0, state.step + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (whoIsTheWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = players[state.next];
        setState({
            history: history.concat([{squares}]),
            next: 1 - state.next,
            step: history.length
        });
    }
    function reset() {
        setState(initialState);
    }
    function jumpTo(step) {
        setState({...state, step, next: step % 2});
    }
    const history = state.history;
    const current = history[state.step];
    const winner = whoIsTheWinner(current.squares);
    let status = winner
        ? `Winner: ${winner}`
        : `Next Player: ${players[state.next]}`;
    const moves = history.map((step, move) => {
        const description = move ? `Move #${move}` : 'Game start';
        return (
            <li key={move}>
                <a href="#" onClick={() => jumpTo(move)}>{description}</a>
            </li>
        );
    });
    return (
        <div className="game">
            <div className="game-board">
                <Board squares={current.squares} onClick={i => handleClick(i)}/>
            </div>
            <div className="game-info">
                <div>{status}</div>
                <ol start="0">
                    <li>
                        <a href="#" onClick={() => reset()}>Reset</a>
                    </li>
                    {moves}
                </ol>
            </div>
        </div>
    );
}
export default Game;