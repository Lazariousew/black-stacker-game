import React from 'react';

interface ControlsProps {
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onRotate: () => void;
  onDrop: () => void;
  isPaused: boolean;
  isGameOver: boolean;
}

const ControlButton: React.FC<{onClick: () => void, children: React.ReactNode, className?: string, disabled: boolean}> = ({ onClick, children, className, disabled }) => {
    const handleTouchStart = (e: React.TouchEvent) => {
        e.preventDefault();
        if(!disabled) onClick();
    }
    return (
        <button
            onTouchStart={handleTouchStart}
            onClick={(e) => { e.preventDefault(); }} // Prevent click events which can fire after touch
            onMouseDown={(e) => { e.preventDefault(); if(!disabled) onClick()}} // For mouse testing
            className={`w-20 h-20 rounded-full bg-slate-700/80 text-cyan-400 active:bg-cyan-500 active:text-slate-900 flex items-center justify-center shadow-lg backdrop-blur-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
            disabled={disabled}
        >
            {children}
        </button>
    );
};


const Controls: React.FC<ControlsProps> = ({ onMoveLeft, onMoveRight, onRotate, onDrop, isPaused, isGameOver }) => {
  const disabled = isPaused || isGameOver;
  
  return (
    <div className="md:hidden w-full mt-4 flex justify-between items-center px-4">
        {/* Left/Right Controls */}
        <div className="flex gap-4">
             <ControlButton onClick={onMoveLeft} disabled={disabled}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
             </ControlButton>
             <ControlButton onClick={onMoveRight} disabled={disabled}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
             </ControlButton>
        </div>

        {/* Rotate/Drop Controls */}
        <div className="flex gap-4">
             <ControlButton onClick={onRotate} disabled={disabled}>
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5m7 10v-5h-5m-7-5l16-16" />
                 </svg>
             </ControlButton>
              <ControlButton onClick={onDrop} disabled={disabled}>
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                 </svg>
             </ControlButton>
        </div>
    </div>
  );
};
