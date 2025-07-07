
export type Shape = (0 | 1)[][];

export interface Tetrimino {
  shape: Shape;
  color: string;
}

export type GridCell = {
    filled: boolean;
    color: string;
};

export type Grid = GridCell[][];

export type Player = {
    pos: { x: number; y: number };
    tetrimino: Tetrimino;
    collided: boolean;
};
