import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.move.squares[i]}
        xIsNext={this.props.move.xIsNext}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    let status = "It's " + (this.props.move.xIsNext ? 'X' : 'O') + "'s turn";
    const winner = calculateWinner(this.props.move.squares);
    if(winner != null) {
      status = winner + " is the winner!";
    }
    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        xIsNext: true
      }],
      move: 0,
    };
  }

  handleClick(i) {
    let history = this.state.history.slice();
    const squares = history[this.state.move].squares.slice();
    const xIsNext = history[this.state.move].xIsNext;

    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    const newSquares = squares;
    newSquares[i] = xIsNext ? 'X' : 'O';
    if (history[this.state.move + 1] != null) {
      history = history.slice(0, this.state.move + 1);
    }
    history.push({ squares: newSquares, xIsNext: !xIsNext });
    this.setState({
      history: history,
      move: this.state.move + 1,
    });
  }

  handleWarp(i) {
    this.setState({
      history: this.state.history,
      move: i,
    });
  }

  // Below when rendering Board component, onClick needs to have this bound to it. Can do it manually on constructor or via arrow func.
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board move={this.state.history[this.state.move]} onClick={this.handleClick} />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol start="0">
            {
              this.state.history.map((_, index) => <li class="move-item" onClick={() => this.handleWarp(index)}>{index === 0 ? "Go to start" : "Go to move"}</li>)
            }
          </ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
