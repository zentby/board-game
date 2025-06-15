
import type { Player, BoardState } from "@/pages/Gomoku";
import { isValidMove, makeMove, isGameOver, getWinner } from "./gomokuLogic";

const BOARD_SIZE = 15;

// 评估棋型得分
const PATTERNS = {
  FIVE: 100000,    // 五连
  FOUR: 10000,     // 活四
  BLOCKED_FOUR: 1000, // 冲四
  THREE: 1000,     // 活三
  BLOCKED_THREE: 100, // 眠三
  TWO: 100,        // 活二
  BLOCKED_TWO: 10, // 眠二
};

// 检查方向上的棋型
const checkPattern = (
  board: BoardState,
  row: number,
  col: number,
  dr: number,
  dc: number,
  player: Player
): number => {
  let score = 0;
  let count = 1; // 包含当前位置
  let blocked = 0; // 被阻挡的方向数

  // 向前检查
  let r = row + dr;
  let c = col + dc;
  while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === player) {
    count++;
    r += dr;
    c += dc;
  }
  if (r < 0 || r >= BOARD_SIZE || c < 0 || c >= BOARD_SIZE || board[r][c] !== null) {
    blocked++;
  }

  // 向后检查
  r = row - dr;
  c = col - dc;
  while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === player) {
    count++;
    r -= dr;
    c -= dc;
  }
  if (r < 0 || r >= BOARD_SIZE || c < 0 || c >= BOARD_SIZE || board[r][c] !== null) {
    blocked++;
  }

  // 根据连子数和阻挡情况评分
  if (count >= 5) {
    score = PATTERNS.FIVE;
  } else if (count === 4) {
    score = blocked === 0 ? PATTERNS.FOUR : PATTERNS.BLOCKED_FOUR;
  } else if (count === 3) {
    score = blocked === 0 ? PATTERNS.THREE : PATTERNS.BLOCKED_THREE;
  } else if (count === 2) {
    score = blocked === 0 ? PATTERNS.TWO : PATTERNS.BLOCKED_TWO;
  }

  return score;
};

// 评估位置得分
const evaluatePosition = (board: BoardState, row: number, col: number, player: Player): number => {
  const opponent = player === "black" ? "white" : "black";
  let score = 0;

  // 四个方向：横、竖、斜
  const directions = [
    [0, 1],   // 横向
    [1, 0],   // 纵向
    [1, 1],   // 左上到右下
    [1, -1]   // 右上到左下
  ];

  // 模拟放置棋子
  const newBoard = board.map(row => [...row]);
  newBoard[row][col] = player;

  // 检查每个方向的得分
  for (const [dr, dc] of directions) {
    // 自己的得分
    score += checkPattern(newBoard, row, col, dr, dc, player);
    
    // 阻挡对手的得分（防守）
    const opponentScore = checkPattern(board, row, col, dr, dc, opponent);
    score += opponentScore * 0.8; // 防守权重稍低
  }

  // 位置加分（中心位置更有价值）
  const centerBonus = Math.max(0, 7 - Math.abs(row - 7) - Math.abs(col - 7)) * 10;
  score += centerBonus;

  return score;
};

// 获取所有可能的落子位置（在已有棋子周围）
const getValidPositions = (board: BoardState): [number, number][] => {
  const positions: [number, number][] = [];
  const visited = new Set<string>();

  // 如果是空棋盘，返回中心位置
  const isEmpty = board.every(row => row.every(cell => cell === null));
  if (isEmpty) {
    return [[7, 7]];
  }

  // 在已有棋子周围2格范围内寻找空位
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (board[row][col] !== null) {
        // 检查周围2格范围
        for (let dr = -2; dr <= 2; dr++) {
          for (let dc = -2; dc <= 2; dc++) {
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

  return positions;
};

// AI决策函数
export const makeGomokuAIMove = (board: BoardState, aiPlayer: Player): [number, number] | null => {
  const validPositions = getValidPositions(board);
  
  if (validPositions.length === 0) {
    return null;
  }

  let bestMove: [number, number] = validPositions[0];
  let bestScore = -Infinity;

  // 评估每个可能的位置
  for (const [row, col] of validPositions) {
    if (isValidMove(board, row, col)) {
      const score = evaluatePosition(board, row, col, aiPlayer);
      
      if (score > bestScore) {
        bestScore = score;
        bestMove = [row, col];
      }
    }
  }

  return bestMove;
};
