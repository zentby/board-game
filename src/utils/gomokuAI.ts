
import type { Player, BoardState } from "@/pages/Gomoku";
import { isValidMove, makeMove, isGameOver, getWinner } from "./gomokuLogic";

const BOARD_SIZE = 15;

// 简化的 AI 决策函数，避免复杂计算导致卡死
export const makeGomokuAIMove = (board: BoardState, aiPlayer: Player): [number, number] | null => {
  console.log("makeGomokuAIMove started", { aiPlayer });
  
  const startTime = Date.now();
  const MAX_CALCULATION_TIME = 2000; // 最大计算时间 2 秒
  
  try {
    // 检查是否是空棋盘
    const isEmpty = board.every(row => row.every(cell => cell === null));
    if (isEmpty) {
      console.log("Empty board, returning center position");
      return [7, 7]; // 返回棋盘中心
    }

    // 获取所有有效位置
    const validPositions = getValidPositions(board);
    console.log("Valid positions found:", validPositions.length);
    
    if (validPositions.length === 0) {
      console.log("No valid positions found");
      return null;
    }

    // 超时检查
    if (Date.now() - startTime > MAX_CALCULATION_TIME) {
      console.log("Timeout reached, returning random position");
      const randomIndex = Math.floor(Math.random() * validPositions.length);
      return validPositions[randomIndex];
    }

    // 简化的评估：寻找最佳位置
    let bestMove = validPositions[0];
    let bestScore = -1;

    // 限制评估的位置数量，避免过多计算
    const positionsToEvaluate = validPositions.slice(0, Math.min(20, validPositions.length));
    console.log("Evaluating positions:", positionsToEvaluate.length);

    for (let i = 0; i < positionsToEvaluate.length; i++) {
      const [row, col] = positionsToEvaluate[i];
      
      // 超时检查
      if (Date.now() - startTime > MAX_CALCULATION_TIME) {
        console.log("Timeout during evaluation, using current best move");
        break;
      }

      if (isValidMove(board, row, col)) {
        const score = evaluatePositionSimple(board, row, col, aiPlayer);
        
        if (score > bestScore) {
          bestScore = score;
          bestMove = [row, col];
        }
      }
    }

    console.log("Best move found:", bestMove, "with score:", bestScore);
    return bestMove;

  } catch (error) {
    console.error("Error in makeGomokuAIMove:", error);
    // 出错时返回随机有效位置
    const validPositions = getValidPositions(board);
    if (validPositions.length > 0) {
      const randomIndex = Math.floor(Math.random() * validPositions.length);
      return validPositions[randomIndex];
    }
    return null;
  }
};

// 简化的位置评估函数
const evaluatePositionSimple = (board: BoardState, row: number, col: number, player: Player): number => {
  let score = 0;
  
  // 基础位置分数：越靠近中心越好
  const centerDistance = Math.abs(row - 7) + Math.abs(col - 7);
  score += Math.max(0, 14 - centerDistance);

  // 检查是否能形成威胁或阻挡对手
  const opponent = player === "black" ? "white" : "black";
  
  // 简单检查四个方向的连子情况
  const directions = [[0, 1], [1, 0], [1, 1], [1, -1]];
  
  for (const [dr, dc] of directions) {
    // 检查自己的连子
    const myCount = countConsecutive(board, row, col, dr, dc, player);
    score += myCount * 10;
    
    // 检查对手的连子（防守）
    const opponentCount = countConsecutive(board, row, col, dr, dc, opponent);
    score += opponentCount * 8;
  }

  return score;
};

// 简化的连子计算
const countConsecutive = (
  board: BoardState,
  row: number,
  col: number,
  dr: number,
  dc: number,
  player: Player
): number => {
  let count = 0;
  
  // 向前计算
  let r = row + dr;
  let c = col + dc;
  while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === player) {
    count++;
    r += dr;
    c += dc;
    if (count >= 4) break; // 避免过度计算
  }
  
  // 向后计算
  r = row - dr;
  c = col - dc;
  while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === player) {
    count++;
    r -= dr;
    c -= dc;
    if (count >= 4) break; // 避免过度计算
  }
  
  return count;
};

// 简化的有效位置获取
const getValidPositions = (board: BoardState): [number, number][] => {
  console.log("Getting valid positions...");
  const positions: [number, number][] = [];
  const visited = new Set<string>();

  // 在已有棋子周围1格范围内寻找空位（缩小搜索范围）
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (board[row][col] !== null) {
        // 检查周围1格范围（缩小了搜索范围）
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

  console.log("Valid positions generated:", positions.length);
  
  // 如果没有找到位置，返回所有空位
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
