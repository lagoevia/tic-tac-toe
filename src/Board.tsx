import React from 'react';
import { Square } from './Square'


interface Props {
    squares: (string | null)[],
    xIsNext: boolean,
    onClick: any,
    winners: number[] | null,
}

export default class Board extends React.Component<Props> {
    renderSquare(i: number) {
        return (
            <Square
                key={i}
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
                id={i}
                winners={this.props.winners}
            />
        );
    }

    render() {
        const rows = Array(3).fill(0).map((_, i) => {
            const rowItems = Array(3).fill(0).map((_, j) => this.renderSquare((3 * i) + j));
            return (
                <div key={i} className="board-row">
                    {rowItems}
                </div>
            );
        });
        return (
            <div id="board-container">
                {rows}
            </div>
        );
    }
}
