import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button className={props.winners.includes(props.id) ? "square winning-square" : "square"} onClick={props.onClick}>
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
            return [squares[a], lines[i]];
        }
    }
    return null;
}

function getMoveSquarePosition(history, move) {
    // compare curr with one before it (so cannot call this with move 0) and return the different element's col and row
    if (move <= 0) {
        console.assert("getMoveSquarePosition called with a move <= 0: " + move);
    }
    const curr = history[move].squares;
    const prev = history[move - 1].squares;
    for (let i = 0; i < 9; i++) {
        if (curr[i] !== prev[i]) {
            return [Math.floor(i / 3) + 1, (i % 3) + 1];
        }
    }
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                key={i}
                value={this.props.move.squares[i]}
                xIsNext={this.props.move.xIsNext}
                onClick={() => this.props.onClick(i)}
                id={i}
                winners={this.props.winners}
            />
        );
    }

    render() {
        const rows = [...Array(3).keys()].map(i => {
            const rowItems = [...Array(3).keys()].map(j => this.renderSquare((3 * i) + j));
            return (
                <div key={i} className="board-row">
                    {rowItems}
                </div>
            );
        });
        return (
            <div>
                {rows}
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
            isOrderAsc: true,
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

    toggleMoveOrder() {
        this.setState({
            isOrderAsc: !this.state.isOrderAsc,
        })
    }

    // Below when rendering Board component, onClick needs to have this bound to it. Can do it manually on constructor or via arrow func.
    render() {
        const current = this.state.history[this.state.move];
        let status = "It's " + (current.xIsNext ? 'X' : 'O') + "'s turn";
        const winnerInfo = calculateWinner(current.squares);
        let winners = Array(3).fill(null);
        if (winnerInfo != null) {
            // Have access to the square id's to set those to winners?
            const winner = winnerInfo[0];
            winners = winnerInfo[1];
            status = winner + " is the winner!";
        }
        else if (!current.squares.includes(null)) {
            // There's no nulls available (everything is taken)
            status = "It's a draw!";
        }

        let moves = this.state.history.map((step, index) => {
            let desc = 'Go to ';
            if (index) {
                const pos = getMoveSquarePosition(this.state.history, index);
                desc += 'move (' + pos[0] + ',' + pos[1] + ')';
            }
            else {
                desc += 'start';
            }
            return (
                <li key={index} className="move-item" onClick={() => this.handleWarp(index)}>
                    {this.state.move === index ? <b>{desc}</b> : desc}
                </li>
            );
        });

        // order here according to state
        if(!this.state.isOrderAsc) {
            // not in ascending, need to "reverse"
            moves.reverse();
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board move={this.state.history[this.state.move]} onClick={this.handleClick} winners={winners}/>
                </div>
                <div className="game-info">
                    <div className="status">{status}</div>
                    <button id="move-sort-toggle" onClick={() => this.toggleMoveOrder(moves)}>Toggle move order</button>
                    <ol start={this.state.isOrderAsc ? "0" : this.state.history.length - 1} reversed={!this.state.isOrderAsc ? true : false}>
                        {moves}
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
