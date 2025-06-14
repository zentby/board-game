
import { BoardState, Player } from '@/pages/Index';

export const initializeBoard = (): BoardState => {
  const board: BoardState = Array(8).fill(null).map(() => Array(8).fill(null));
  
  // Initial setup
  board[3][3] = 'white';
  board[3][4] = 'black';
  board[4][3] = 'black';
  board[4][4] = 'white';
  
  return board;
};

export const isValidMove = (board: BoardState, row: number, col: number, player: Player): boolean => {
  if (board[row][col] !== null) return false;
  
  const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1],  [1, 0],  [1, 1]
  ];
  
  for (const [dx, dy] of directions) {
    if (canFlipInDirection(board, row, col, dx, dy, player)) {
      return true;
    }
  }
  
  return false;
};

const canFlipInDirection = (
  board: BoardState, 
  row: number, 
  col: number, 
  dx: number, 
  dy: number, 
  player: Player
): boolean => {
  const opponent = player === 'black' ? 'white' : 'black';
  let x = row + dx;
  let y = col + dy;
  let hasOpponent = false;
  
  while (x >= 0 && x < 8 && y >= 0 && y < 8) {
    if (board[x][y] === null) return false;
    if (board[x][y] === opponent) {
      hasOpponent = true;
    } else if (board[x][y] === player) {
      return hasOpponent;
    }
    x += dx;
    y += dy;
  }
  
  return false;
};

export const makeMove = (board: BoardState, row: number, col: number, player: Player): BoardState => {
  const newBoard = board.map(row => [...row]);
  newBoard[row][col] = player;
  
  const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1],  [1, 0],  [1, 1]
  ];
  
  for (const [dx, dy] of directions) {
    if (canFlipInDirection(board, row, col, dx, dy, player)) {
      flipInDirection(newBoard, row, col, dx, dy, player);
    }
  }
  
  return newBoard;
};

const flipInDirection = (
  board: BoardState, 
  row: number, 
  col: number, 
  dx: number, 
  dy: number, 
  player: Player
): void => {
  const opponent = player === 'black' ? 'white' : 'black';
  let x = row + dx;
  let y = col + dy;
  
  while (x >= 0 && x < 8 && y >= 0 && y < 8 && board[x][y] === opponent) {
    board[x][y] = player;
    x += dx;
    y += dy;
  }
};

export const getValidMoves = (board: BoardState, player: Player): [number, number][] => {
  const moves: [number, number][] = [];
  
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      if (isValidMove(board, row, col, player)) {
        moves.push([row, col]);
      }
    }
  }
  
  return moves;
};

export const getScore = (board: BoardState): { black: number; white: number } => {
  let black = 0;
  let white = 0;
  
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      if (board[row][col] === 'black') black++;
      else if (board[row][col] === 'white') white++;
    }
  }
  
  return { black, white };
};

export const isGameOver = (board: BoardState): boolean => {
  const blackMoves = getValidMoves(board, 'black');
  const whiteMoves = getValidMoves(board, 'white');
  return blackMoves.length === 0 && whiteMoves.length === 0;
};

export const getWinner = (board: BoardState): Player | 'tie' => {
  const { black, white } = getScore(board);
  if (black > white) return 'black';
  if (white > black) return 'white';
  return 'tie';
};
