
import type { Player, BoardState } from "@/pages/Gomoku";

export const BOARD_SIZE = 15;

export const initializeBoard = (): BoardState =>
  Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(null));

export const isValidMove = (board: BoardState, row: number, col: number): boolean =>
  board[row][col] === null;

export const makeMove = (
  board: BoardState,
  row: number,
  col: number,
  player: Player
): BoardState => {
  const newBoard = board.map(r => [...r]);
  newBoard[row][col] = player;
  return newBoard;
};

const directions = [
  [0, 1], // 横向
  [1, 0], // 纵向
  [1, 1], // 左上->右下
  [1, -1], // 右上->左下
];

function countInDirection(
  board: BoardState,
  row: number,
  col: number,
  dr: number,
  dc: number,
  player: Player
) {
  let count = 0;
  let r = row + dr;
  let c = col + dc;
  while (
    r >= 0 && r < BOARD_SIZE &&
    c >= 0 && c < BOARD_SIZE &&
    board[r][c] === player
  ) {
    count++;
    r += dr;
    c += dc;
  }
  return count;
}

export const isGameOver = (
  board: BoardState,
  row: number,
  col: number,
  player: Player
): boolean => {
  for (const [dr, dc] of directions) {
    let count = 1;
    count += countInDirection(board, row, col, dr, dc, player);
    count += countInDirection(board, row, col, -dr, -dc, player);
    if (count >= 5) return true;
  }
  // 平局判断
  return board.flat().every(cell => cell !== null);
};

export const getWinner = (
  board: BoardState,
  row: number,
  col: number,
  player: Player
): Player | "tie" => {
  for (const [dr, dc] of directions) {
    let count = 1;
    count += countInDirection(board, row, col, dr, dc, player);
    count += countInDirection(board, row, col, -dr, -dc, player);
    if (count >= 5) return player;
  }
  // 检查平局（棋盘满）
  return board.flat().every(cell => cell !== null) ? "tie" : null!;
};
