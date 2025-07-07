import React from 'react';
import type { Tetrimino } from '../types';
import Cell from './Cell';

interface InfoPanelProps {
  score: number;
  level: number;
  lines: number;
  nextPiece: Tetrimino | null;
}

const NextPiece: React.FC<{ piece: Tetrimino | null }> = ({ piece }) => {
    const grid = Array.from(Array(4), () => Array(4).fill({ filled: 0, color: 'bg-transparent'}));

    if (piece) {
        piece.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    grid[y][x] = { filled: 1, color: piece.color };
                }
            });
        });
    }

    return (
        <div className="grid grid-cols-4 grid-rows-4 gap-px p-2 bg-slate-800 rounded-lg border-2 border-slate-700">
            {grid.map((row, y) =>
                row.map((cell, x) => (
                    <Cell key={`${y}-${x}`} type={cell.filled} color={cell.color} />
                ))
            )}
        </div>
    )
}

const InfoPanel: React.FC<InfoPanelProps> = ({ score, level, lines, nextPiece }) => {
  return (
    <div className="w-full md:w-48 p-4 bg-slate-900 flex flex-col gap-6 text-slate-300">
      <div className="bg-slate-800 p-4 rounded-lg border-2 border-slate-700 text-center">
        <p className="text-sm font-bold text-cyan-400 uppercase tracking-widest">Score</p>
        <p className="text-3xl font-mono font-bold">{score}</p>
      </div>
      <div className="bg-slate-800 p-4 rounded-lg border-2 border-slate-700 text-center">
        <p className="text-sm font-bold text-cyan-400 uppercase tracking-widest">Level</p>
        <p className="text-3xl font-mono font-bold">{level}</p>
      </div>
      <div className="bg-slate-800 p-4 rounded-lg border-2 border-slate-700 text-center">
        <p className="text-sm font-bold text-cyan-400 uppercase tracking-widest">Lines</p>
        <p className="text-3xl font-mono font-bold">{lines}</p>
      </div>
      <div className="bg-slate-800 p-4 rounded-lg border-2 border-slate-700 text-center">
         <p className="text-sm font-bold text-cyan-400 uppercase tracking-widest mb-2">Next</p>
         <div className="flex justify-center">
           <NextPiece piece={nextPiece} />
         </div>
      </div>
       <div className="hidden md:block text-xs text-slate-500 mt-auto text-center">
        <p>Use Arrow Keys to play.</p>
        <p>Up: Rotate | Down: Soft Drop</p>
        <p>Left/Right: Move</p>
        <p>P: Pause</p>
      </div>
    </div>
  );
};