
import React from 'react';

interface CellProps {
  type: 0 | 1;
  color: string;
}

const Cell: React.FC<CellProps> = ({ type, color }) => {
    const cellColor = type === 1 ? color : 'bg-slate-800';
    const border = type === 1 ? 'border-slate-600' : 'border-slate-800';

    return (
        <div className={`aspect-square ${cellColor} border-[1px] ${border} relative`}>
            {type === 1 && <div className="absolute inset-0 bg-white/20"></div>}
        </div>
    );
};

export default React.memo(Cell);
