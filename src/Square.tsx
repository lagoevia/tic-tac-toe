import React from 'react';

interface Props {
    winners: number[] | null,
    id: number,
    value: string | null,
    onClick: any,
}

export const Square = ({ winners, id, value, onClick }: Props) => {
    return (
        <button className={winners && winners.includes(id) ? "square winning-square" : "square"} onClick={onClick}>
            {value}
        </button>
    );
}