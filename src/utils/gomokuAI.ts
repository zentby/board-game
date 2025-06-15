
import type { Player, BoardState } from "@/pages/Gomoku";
import { isValidMove, makeMove, isGameOver, getWinner } from "./gomokuLogic";

const BOARD_SIZE = 15;

// New: Helper to see if a move would allow a player to win immediately if played
function isWinningMove(board: BoardState, row: number, col: number, player: Player): boolean {
  if (!isValidMove(board, row, col)) return false;
  const boardAfter = makeMove(board, row, col, player);
  return isGameOver(boardAfter, row, col, player) && getWinner(boardAfter, row, col, player) === player;
}

export const makeGomokuAIMove = (board: BoardState, aiPlayer: Player): [number, number] | null => {
  console.log("makeGomokuAIMove started", { aiPlayer });
  const startTime = Date.now();
  const MAX_CALCULATION_TIME = 2000;

  try {
    // Check if board is empty
    const isEmpty = board.every(row => row.every(cell => cell === null));
    if (isEmpty) {
      return [7, 7];
    }
    const validPositions = getValidPositions(board);
    if (validPositions.length === 0) {
      return null;
    }

    // 1. Block imminent human win: If player can win in one move, block it
    const opponent: Player = aiPlayer === "black" ? "white" : "black";
    for (const [row, col] of validPositions) {
      if (isWinningMove(board, row, col, opponent)) {
        console.log("AI blocks opponent's winning move at", row, col);
        return [row, col];
      }
    }
    // 2. Win if possible: If AI can win in one move, take it
    for (const [row, col] of validPositions) {
      if (isWinningMove(board, row, col, aiPlayer)) {
        console.log("AI plays own winning move at", row, col);
        return [row, col];
      }
    }

    // 3. Evaluate all valid positions to find the best
    let bestMoves: [number, number][] = [];
    let bestScore = -Infinity;
    for (const [row, col] of validPositions) {
      if (Date.now() - startTime > MAX_CALCULATION_TIME) {
        break;
      }
      const score = evaluatePositionAdvanced(board, row, col, aiPlayer);
      if (score > bestScore) {
        bestScore = score;
        bestMoves = [[row, col]];
      } else if (score === bestScore) {
        bestMoves.push([row, col]);
      }
    }
    // Randomize among best moves for unpredictability
    if (bestMoves.length > 0) {
      const pick = bestMoves[Math.floor(Math.random() * bestMoves.length)];
      console.log("AI picks move", pick, "with score", bestScore);
      return pick;
    }
    // Fallback
    const randomIndex = Math.floor(Math.random() * validPositions.length);
    return validPositions[randomIndex];
  } catch (error) {
    console.error("Error in makeGomokuAIMove:", error);
    const validPositions = getValidPositions(board);
    if (validPositions.length > 0) {
      const randomIndex = Math.floor(Math.random() * validPositions.length);
      return validPositions[randomIndex];
    }
    return null;
  }
};

// Enhanced evaluation: recognize open three/four, block opponent's threats, etc
function evaluatePositionAdvanced(board: BoardState, row: number, col: number, player: Player): number {
  let score = 0;
  const opponent = player === "black" ? "white" : "black";
  // Base: proximity to center
  const centerDistance = Math.abs(row - 7) + Math.abs(col - 7);
  score += Math.max(0, 14 - centerDistance);

  // Try the move for self and opponent
  const boardAfterSelf = makeMove(board, row, col, player);
  const boardAfterOppo = makeMove(board, row, col, opponent);

  // Winning move for self?
  if (isGameOver(boardAfterSelf, row, col, player) && getWinner(boardAfterSelf, row, col, player) === player) {
    score += 10000;
  }
  // Dangerous if opponent could win
  if (isGameOver(boardAfterOppo, row, col, opponent) && getWinner(boardAfterOppo, row, col, opponent) === opponent) {
    score += 9000; // almost as high priority as winning
  }

  // Patterns evaluation; reward longer self lines and blocking opponent lines
  const directions: [number, number][] = [[0,1],[1,0],[1,1],[1,-1]];
  for (const [dr, dc] of directions) {
    // Own lines
    const myCount = countConsecutive(board, row, col, dr, dc, player) + 1;
    if (myCount >= 5) score += 5000;
    else score += myCount * myCount * 8;

    // Opponent lines (block them)
    const opCount = countConsecutive(board, row, col, dr, dc, opponent) + 1;
    if (opCount >= 5) score += 4000;
    else score += opCount * opCount * 7;
  }
  return score;
}

function countConsecutive(
  board: BoardState,
  row: number,
  col: number,
  dr: number,
  dc: number,
  player: Player
): number {
  let count = 0;
  // Forward
  let r = row + dr, c = col + dc;
  while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === player) {
    count++;
    r += dr;
    c += dc;
    if (count >= 4) break;
  }
  // Backward
  r = row - dr; c = col - dc;
  while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === player) {
    count++;
    r -= dr;
    c -= dc;
    if (count >= 4) break;
  }
  return count;
}

const getValidPositions = (board: BoardState): [number, number][] => {
  const positions: [number, number][] = [];
  const visited = new Set<string>();

  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (board[row][col] !== null) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const newRow = row + dr;
            const newCol = col + dc;
            const key = `${newRow}-${newCol}`;
            if (
              newRow >= 0 && newRow < BOARD_SIZE &&
              newCol >= 0 && newCol < BOARD_SIZE &&
              board[newRow][newCol] === null &&
              !visited.has(key)
            ) {
              positions.push([newRow, newCol]);
              visited.add(key);
            }
          }
        }
      }
    }
  }
  if (positions.length === 0) {
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if (board[row][col] === null) {
          positions.push([row, col]);
        }
      }
    }
  }
  return positions;
};
