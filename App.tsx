import React, { useState, useCallback, useEffect } from 'react';
import { BOARD_WIDTH, BOARD_HEIGHT, TETRIMINOS, randomTetrimino } from './constants';
import type { Grid, GridCell, Player, Tetrimino, Shape } from './types';
import Board from './components/Board';
import InfoPanel from './components/InfoPanel';
import Modal from './components/Modal';
import Controls from './components/Controls';

const createEmptyGrid = (): Grid =>
  Array.from(Array(BOARD_HEIGHT), () =>
    new Array(BOARD_WIDTH).fill({ filled: false, color: TETRIMINOS['0'].color })
  );

const App: React.FC = () => {
  const [grid, setGrid] = useState<Grid>(createEmptyGrid());
  const [player, setPlayer] = useState<Player | null>(null);
  const [nextPiece, setNextPiece] = useState<Tetrimino | null>(null);
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [level, setLevel] = useState(0);
  const [dropTime, setDropTime] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const resetPlayer = useCallback(() => {
    const newPiece = nextPiece || randomTetrimino();
    setNextPiece(randomTetrimino());

    const newPlayer: Player = {
      pos: { x: BOARD_WIDTH / 2 - 1, y: 0 },
      tetrimino: newPiece,
      collided: false,
    };

    if (checkCollision(newPlayer, grid)) {
      setIsGameOver(true);
      setDropTime(null);
    } else {
      setPlayer(newPlayer);
    }
  }, [nextPiece]);


  const startGame = () => {
    setGrid(createEmptyGrid());
    setScore(0);
    setLines(0);
    setLevel(0);
    setDropTime(1000);
    setIsGameOver(false);
    setIsPaused(false);
    setGameStarted(true);
    setNextPiece(randomTetrimino());
    resetPlayer();
  };
  
  const checkCollision = (player: Player, grid: Grid): boolean => {
    for (let y = 0; y < player.tetrimino.shape.length; y += 1) {
      for (let x = 0; x < player.tetrimino.shape[y].length; x += 1) {
        if (player.tetrimino.shape[y][x] !== 0) {
          if (
            !grid[y + player.pos.y] ||
            !grid[y + player.pos.y][x + player.pos.x] ||
            grid[y + player.pos.y][x + player.pos.x].filled
          ) {
            return true;
          }
        }
      }
    }
    return false;
  };

  useEffect(() => {
    if (!gameStarted) return;
    const newGrid = createEmptyGrid();
    grid.forEach((row, y) => {
      row.forEach((cell, x) => {
        newGrid[y][x] = cell;
      })
    });

    if (player) {
      player.tetrimino.shape.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value !== 0) {
            const gridY = y + player.pos.y;
            const gridX = x + player.pos.x;
            if (gridY >= 0 && gridY < BOARD_HEIGHT && gridX >= 0 && gridX < BOARD_WIDTH) {
                newGrid[gridY][gridX] = {
                    filled: true,
                    color: player.tetrimino.color,
                };
            }
          }
        });
      });
    }

    if (player && player.collided) {
        setGrid(newGrid);
        resetPlayer();
    } else {
        setGrid(newGrid);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player]);


  const updatePlayerPos = ({ x, y, collided }: { x: number; y: number; collided?: boolean }) => {
    if (!player) return;
    const newPos = { x: player.pos.x + x, y: player.pos.y + y };
    if (!checkCollision({ ...player, pos: newPos }, grid)) {
      setPlayer(prev => prev && {
        ...prev,
        pos: newPos,
        collided: collided !== undefined ? collided : prev.collided,
      });
    } else {
      if(y > 0) { // moving down
          setPlayer(prev => prev && { ...prev, collided: true });
      }
    }
  };
  
  const rotateMatrix = (matrix: Shape): Shape => {
    const rotatedMatrix = matrix.map((_, index) => matrix.map(col => col[index]));
    return rotatedMatrix.map(row => row.reverse());
  };

  const rotatePlayer = () => {
    if (isPaused || isGameOver || !player) return;
    const clonedPlayer = JSON.parse(JSON.stringify(player));
    clonedPlayer.tetrimino.shape = rotateMatrix(clonedPlayer.tetrimino.shape);

    if (!checkCollision(clonedPlayer, grid)) {
      setPlayer(clonedPlayer);
    } else {
      // Wall kick logic could be added here for smoother play
    }
  };

  const drop = () => {
    if (isPaused || isGameOver) return;
    updatePlayerPos({ x: 0, y: 1 });
  };
  
  useEffect(() => {
    if (lines > 0) {
      setScore(prev => prev + [40, 100, 300, 1200][lines - 1] * (level + 1));
      setLines(prev => prev + lines);
    }
  }, [lines, level]);

  useEffect(() => {
    const clearedGrid = grid.reduce((ack, row) => {
      if (row.every(cell => cell.filled)) {
        setLines(prev => prev + 1);
        setLevel(Math.floor((lines + 1) / 10));
        setDropTime(1000 / (level + 1) + 200);
        ack.unshift(new Array(BOARD_WIDTH).fill({ filled: false, color: 'bg-transparent' }));
        return ack;
      }
      ack.push(row);
      return ack;
    }, [] as GridCell[][]);
    
    if (JSON.stringify(clearedGrid) !== JSON.stringify(grid)) {
        setGrid(clearedGrid);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grid]);

  useEffect(() => {
    if (isPaused || isGameOver || !gameStarted) {
        return;
    }
    const interval = setInterval(() => {
      drop();
    }, dropTime || 1000);

    return () => clearInterval(interval);
  }, [dropTime, isPaused, isGameOver, gameStarted, player]);

  const movePlayer = (dir: number) => {
    if (isPaused || isGameOver) return;
    const newPlayer = { ...player! };
    newPlayer.pos.x += dir;
    if (!checkCollision(newPlayer, grid)) {
        updatePlayerPos({x: dir, y: 0});
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (isGameOver) return;
    if (e.key === 'p' || e.key === 'P') {
      setIsPaused(prev => !prev);
      return;
    }
    if(isPaused) return;

    if (e.key === 'ArrowLeft') {
      movePlayer(-1);
    } else if (e.key === 'ArrowRight') {
      movePlayer(1);
    } else if (e.key === 'ArrowDown') {
      drop();
    } else if (e.key === 'ArrowUp') {
      rotatePlayer();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGameOver, isPaused, player]);
  
  const displayGrid = (): Grid => {
    const newGrid = grid.map(row => [...row]);
    
    if (player) {
      player.tetrimino.shape.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value !== 0) {
            const gridY = y + player.pos.y;
            const gridX = x + player.pos.x;
            if (gridY >= 0 && gridY < BOARD_HEIGHT && gridX >= 0 && gridX < BOARD_WIDTH) {
              newGrid[gridY][gridX] = { filled: true, color: player.tetrimino.color };
            }
          }
        });
      });
    }
    return newGrid;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 selection:bg-cyan-300 selection:text-cyan-900">
      <header className="mb-4">
        <h1 className="text-5xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">
            Block Stacker
        </h1>
      </header>
      <main className="flex flex-col md:flex-row gap-4">
        <div className="relative">
          <Board grid={displayGrid()} />
          {!gameStarted && (
             <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-50">
                <button
                    onClick={startGame}
                    className="px-6 py-3 bg-cyan-500 text-white font-bold rounded-lg shadow-lg hover:bg-cyan-600 transition-all transform hover:scale-105"
                >
                    Start Game
                </button>
             </div>
          )}
          {isGameOver && (
            <Modal title="Game Over">
                <div className="mb-6">
                    <p className="text-xl">Final Score: <span className="font-bold text-yellow-400">{score}</span></p>
                </div>
              <button
                onClick={startGame}
                className="px-6 py-3 bg-cyan-500 text-white font-bold rounded-lg shadow-lg hover:bg-cyan-600 transition-all transform hover:scale-105"
              >
                Play Again
              </button>
            </Modal>
          )}
           {isPaused && !isGameOver && (
             <Modal title="Paused">
              <button
                onClick={() => setIsPaused(false)}
                className="px-6 py-3 bg-cyan-500 text-white font-bold rounded-lg shadow-lg hover:bg-cyan-600 transition-all transform hover:scale-105"
              >
                Resume
              </button>
             </Modal>
          )}
        </div>
        <InfoPanel score={score} level={level} lines={lines} nextPiece={nextPiece} />
      </main>
      <Controls 
        onMoveLeft={() => movePlayer(-1)}
        onMoveRight={() => movePlayer(1)}
        onRotate={rotatePlayer}
        onDrop={drop}
        isPaused={isPaused}
        isGameOver={isGameOver}
      />
    </div>
  );
};

export default App;