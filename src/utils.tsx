import { GameHistory } from "./types";

export function calculateWinner(squares: (string | null)[]) {
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
            return {
                player: squares[a],
                winningLine: lines[i]
            };
        }
    }
    return null;
}

export function getMoveSquarePosition(history: GameHistory[], move: number) {
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