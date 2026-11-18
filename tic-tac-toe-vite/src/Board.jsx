import Square from './Square.jsx';

function Board({ squares, onClick }) {
  return (
    <div>
      {[0, 1, 2].map(row => (
        <div className="board-row" key={row}>
          {[0, 1, 2].map(col => {
            const index = row * 3 + col;
            return (
              <Square
                key={index}
                value={squares[index]}
                onClick={() => onClick(index)}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default Board;
