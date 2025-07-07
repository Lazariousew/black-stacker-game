import React from 'react';
import type { Grid } from '../types';
import Cell from './Cell';

interface BoardProps {
  grid: Grid;
}

const Board: React.FC<BoardProps> = ({ grid }) => {
  return (
    <div className="grid grid-cols-10 grid-rows-20 border-4 border-slate-700 bg-slate-800 shadow-lg shadow-black/50">
      {grid.map((row, y) =>
        row.map((cell, x) => (
          <Cell key={`${y}-${x}`} type={cell.filled ? 1 : 0} color={cell.color} />
        ))
      )}
    </div>
  );
};

export default Board;
