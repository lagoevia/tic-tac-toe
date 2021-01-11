import React from 'react';
import Board from './Board';
import { GameHistory } from './types';
import { calculateWinner, getMoveSquarePosition } from './utils';

interface State {
    history: GameHistory[],
    move: number,
    isOrderAsc: boolean,
}

export default class Game extends React.Component<{}, State> {
    constructor(props: any) {
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

    handleClick(i: number) {
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

    handleWarp(i: number) {
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
        let winners = null;
        if (winnerInfo != null) {
            // Have access to the square id's to set those to winners?
            const winner = winnerInfo.player;
            winners = winnerInfo.winningLine;
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
                desc += pos ? 'move (' + pos[0] + ',' + pos[1] + ')' : 'move';
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
        if (!this.state.isOrderAsc) {
            // not in ascending, need to "reverse"
            moves.reverse();
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={this.state.history[this.state.move].squares}
                        xIsNext={this.state.history[this.state.move].xIsNext}
                        onClick={this.handleClick}
                        winners={winners}
                    />
                </div>
                <div className="game-info">
                    <div className="status">{status}</div>
                    <button id="move-sort-toggle" onClick={() => this.toggleMoveOrder()}>Toggle move order</button>
                    <ol
                        start={this.state.isOrderAsc ? 0 : this.state.history.length - 1}
                        reversed={!this.state.isOrderAsc ? true : false}
                    >
                        {moves}
                    </ol>
                </div>
            </div>
        );
    }
}