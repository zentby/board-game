
import { BoardState, Player } from '@/pages/Index';
import { getValidMoves, makeMove, getScore } from './gameLogic';

const CORNER_POSITIONS = [
  [0, 0], [0, 7], [7, 0], [7, 7]
];

const EDGE_POSITIONS = [
  // Top and bottom edges
  [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6],
  [7, 1], [7, 2], [7, 3], [7, 4], [7, 5], [7, 6],
  // Left and right edges
  [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0],
  [1, 7], [2, 7], [3, 7], [4, 7], [5, 7], [6, 7]
];

const DANGEROUS_POSITIONS = [
  [0, 1], [1, 0], [1, 1], // Near top-left corner
  [0, 6], [1, 7], [1, 6], // Near top-right corner
  [6, 0], [7, 1], [6, 1], // Near bottom-left corner
  [6, 7], [7, 6], [6, 6]  // Near bottom-right corner
];

const evaluateBoard = (board: BoardState, player: Player): number => {
  const opponent = player === 'black' ? 'white' : 'black';
  let score = 0;
  
  // Basic piece count
  const { black, white } = getScore(board);
  const pieceScore = player === 'black' ? black - white : white - black;
  score += pieceScore;
  
  // Corner control (very important)
  for (const [row, col] of CORNER_POSITIONS) {
    if (board[row][col] === player) {
      score += 25;
    } else if (board[row][col] === opponent) {
      score -= 25;
    }
  }
  
  // Edge control
  for (const [row, col] of EDGE_POSITIONS) {
    if (board[row][col] === player) {
      score += 5;
    } else if (board[row][col] === opponent) {
      score -= 5;
    }
  }
  
  // Penalize dangerous positions (next to corners)
  for (const [row, col] of DANGEROUS_POSITIONS) {
    if (board[row][col] === player) {
      score -= 10;
    } else if (board[row][col] === opponent) {
      score += 10;
    }
  }
  
  // Mobility (number of valid moves)
  const playerMoves = getValidMoves(board, player).length;
  const opponentMoves = getValidMoves(board, opponent).length;
  score += (playerMoves - opponentMoves) * 2;
  
  return score;
};

const minimax = (
  board: BoardState, 
  depth: number, 
  isMaximizing: boolean, 
  player: Player,
  alpha: number = -Infinity,
  beta: number = Infinity
): number => {
  if (depth === 0) {
    return evaluateBoard(board, player);
  }
  
  const currentPlayer = isMaximizing ? player : (player === 'black' ? 'white' : 'black');
  const validMoves = getValidMoves(board, currentPlayer);
  
  if (validMoves.length === 0) {
    const otherPlayer = currentPlayer === 'black' ? 'white' : 'black';
    const otherPlayerMoves = getValidMoves(board, otherPlayer);
    
    if (otherPlayerMoves.length === 0) {
      // Game over
      return evaluateBoard(board, player);
    } else {
      // Skip turn
      return minimax(board, depth - 1, !isMaximizing, player, alpha, beta);
    }
  }
  
  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const [row, col] of validMoves) {
      const newBoard = makeMove(board, row, col, currentPlayer);
      const eval_ = minimax(newBoard, depth - 1, false, player, alpha, beta);
      maxEval = Math.max(maxEval, eval_);
      alpha = Math.max(alpha, eval_);
      if (beta <= alpha) break; // Alpha-beta pruning
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const [row, col] of validMoves) {
      const newBoard = makeMove(board, row, col, currentPlayer);
      const eval_ = minimax(newBoard, depth - 1, true, player, alpha, beta);
      minEval = Math.min(minEval, eval_);
      beta = Math.min(beta, eval_);
      if (beta <= alpha) break; // Alpha-beta pruning
    }
    return minEval;
  }
};

export const makeAIMove = (board: BoardState, aiPlayer: Player): BoardState => {
  const validMoves = getValidMoves(board, aiPlayer);
  
  if (validMoves.length === 0) {
    return board;
  }
  
  let bestMove = validMoves[0];
  let bestScore = -Infinity;
  const depth = 4; // Adjust depth for difficulty
  
  for (const [row, col] of validMoves) {
    const newBoard = makeMove(board, row, col, aiPlayer);
    const score = minimax(newBoard, depth, false, aiPlayer);
    
    if (score > bestScore) {
      bestScore = score;
      bestMove = [row, col];
    }
  }
  
  return makeMove(board, bestMove[0], bestMove[1], aiPlayer);
};
