
import type { Player, BoardState, Position, Move, Piece } from "@/types/xiangqi";
import { getValidMoves, makeMove, getPieceAt, isInCheck, getGameResult } from "./xiangqiLogic";

const PIECE_VALUES = {
  general: 1000,
  advisor: 20,
  elephant: 20,
  horse: 40,
  chariot: 90,
  cannon: 45,
  soldier: 10
};

const POSITION_BONUS = {
  general: [
    [0, 0, 0, 8, 8, 8, 0, 0, 0],
    [0, 0, 0, 8, 8, 8, 0, 0, 0],
    [0, 0, 0, 8, 8, 8, 0, 0, 0]
  ],
  soldier: [
    [0, 3, 6, 9, 12, 9, 6, 3, 0],
    [19, 24, 34, 42, 44, 42, 34, 24, 19],
    [19, 24, 32, 37, 37, 37, 32, 24, 19],
    [19, 23, 27, 29, 30, 29, 27, 23, 19]
  ]
};

export const makeXiangqiAIMove = (board: BoardState, aiPlayer: Player): Move | null => {
  console.log("makeXiangqiAIMove started", { aiPlayer });
  
  try {
    const allMoves = getAllValidMoves(board, aiPlayer);
    if (allMoves.length === 0) return null;

    // Check for immediate checkmate
    for (const move of allMoves) {
      const newBoard = makeMove(board, move);
      const result = getGameResult(newBoard, aiPlayer === "red" ? "black" : "red");
      if (result === aiPlayer) {
        console.log("AI found checkmate move");
        return move;
      }
    }

    // Check for moves that prevent checkmate
    const opponent = aiPlayer === "red" ? "black" : "red";
    const opponentMoves = getAllValidMoves(board, opponent);
    const dangerousMoves = opponentMoves.filter(move => {
      const newBoard = makeMove(board, move);
      const result = getGameResult(newBoard, aiPlayer);
      return result === opponent;
    });

    if (dangerousMoves.length > 0) {
      // Try to block the dangerous moves
      for (const move of allMoves) {
        const newBoard = makeMove(board, move);
        const stillDangerous = dangerousMoves.some(dangerMove => {
          if (dangerMove.to.row === move.to.row && dangerMove.to.col === move.to.col) {
            return false; // This move blocks the dangerous move
          }
          const testBoard = makeMove(newBoard, dangerMove);
          const result = getGameResult(testBoard, aiPlayer);
          return result === opponent;
        });
        if (!stillDangerous) {
          console.log("AI blocks dangerous move");
          return move;
        }
      }
    }

    // Evaluate all moves and pick the best
    let bestMoves: Move[] = [];
    let bestScore = -Infinity;

    for (const move of allMoves) {
      const score = evaluateMove(board, move, aiPlayer);
      if (score > bestScore) {
        bestScore = score;
        bestMoves = [move];
      } else if (score === bestScore) {
        bestMoves.push(move);
      }
    }

    if (bestMoves.length > 0) {
      const selectedMove = bestMoves[Math.floor(Math.random() * bestMoves.length)];
      console.log("AI selected move with score", bestScore);
      return selectedMove;
    }

    return allMoves[Math.floor(Math.random() * allMoves.length)];
  } catch (error) {
    console.error("Error in makeXiangqiAIMove:", error);
    const allMoves = getAllValidMoves(board, aiPlayer);
    if (allMoves.length > 0) {
      return allMoves[Math.floor(Math.random() * allMoves.length)];
    }
    return null;
  }
};

function getAllValidMoves(board: BoardState, player: Player): Move[] {
  const moves: Move[] = [];
  
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 9; col++) {
      const piece = board[row][col];
      if (piece && piece.player === player) {
        const validMoves = getValidMoves(board, { row, col });
        for (const to of validMoves) {
          const move: Move = {
            from: { row, col },
            to,
            piece,
            captured: getPieceAt(board, to) || undefined
          };
          
          // Only include moves that don't leave king in check
          const newBoard = makeMove(board, move);
          if (!isInCheck(newBoard, player)) {
            moves.push(move);
          }
        }
      }
    }
  }
  
  return moves;
}

function evaluateMove(board: BoardState, move: Move, player: Player): number {
  let score = 0;
  
  // Capture value
  if (move.captured) {
    score += PIECE_VALUES[move.captured.type];
  }
  
  // Piece position value
  const piece = move.piece;
  if (piece.type === "general" && POSITION_BONUS.general) {
    const palaceRow = player === "red" ? 9 - move.to.row : move.to.row;
    if (palaceRow >= 0 && palaceRow < 3) {
      score += POSITION_BONUS.general[palaceRow][move.to.col] || 0;
    }
  }
  
  if (piece.type === "soldier" && POSITION_BONUS.soldier) {
    const soldierRow = player === "red" ? 9 - move.to.row : move.to.row;
    if (soldierRow >= 0 && soldierRow < 4) {
      score += POSITION_BONUS.soldier[soldierRow][move.to.col] || 0;
    }
  }
  
  // Center control
  const centerCols = [3, 4, 5];
  if (centerCols.includes(move.to.col)) {
    score += 5;
  }
  
  // Advance pieces
  if (piece.type === "soldier" || piece.type === "horse" || piece.type === "chariot") {
    if (player === "red" && move.to.row < move.from.row) {
      score += 3;
    } else if (player === "black" && move.to.row > move.from.row) {
      score += 3;
    }
  }
  
  return score;
}
