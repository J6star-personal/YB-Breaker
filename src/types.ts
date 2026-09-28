export type BrickType = 'red' | 'green' | 'gray' | 'multi' | 'life';

export interface Brick {
  id: number;
  row: number;
  col: number;
  x: number;
  y: number;
  width: number;
  height: number;
  type: BrickType; // 'gray' is unbreakable
  hp: number; // 1 for normal, -1 for unbreakable
  maxHp: number;
  color: string;
}

export interface Ball {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  stuckToPaddle: boolean;
  stuckOffset: number;
}

export interface Paddle {
  x: number;
  y: number;
  width: number;
  height: number;
  targetX: number;
  speed: number;
}

export interface PowerUp {
  id: number;
  x: number;
  y: number;
  vy: number;
  type: 'extra_balls' | 'split' | 'laser' | 'expand' | 'life';
  text: string;
  color: string;
  radius: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
}

export interface Laser {
  x: number;
  y: number;
  vy: number;
}

export interface LevelData {
  levelNumber: number;
  title: string;
  description?: string;
  cols: number;
  rows: number;
  grid: (BrickType | null)[][];
}
