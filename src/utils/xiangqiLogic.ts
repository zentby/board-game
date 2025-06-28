
import type { Player, BoardState, Piece, Position, Move, PieceType } from "@/types/xiangqi";

export const BOARD_ROWS = 10;
export const BOARD_COLS = 9;

export const initializeBoard = (): BoardState => {
  const board: BoardState = Array.from({ length: BOARD_ROWS }, () => 
    Array(BOARD_COLS).fill(null)
  );

  // Initialize red pieces (bottom)
  const redPieces: [PieceType, number[]][] = [
    ["chariot", [0, 8]],
    ["horse", [1, 7]], 
    ["elephant", [2, 6]],
    ["advisor", [3, 5]],
    ["general", [4]],
    ["cannon", [1, 7]],
    ["soldier", [0, 2, 4, 6, 8]]
  ];

  redPieces.forEach(([type, cols]) => {
    cols.forEach(col => {
      if (type === "cannon") {
        board[7][col] = { type, player: "red" };
      } else if (type === "soldier") {
        board[6][col] = { type, player: "red" };
      } else {
        board[9][col] = { type, player: "red" };
      }
    });
  });

  // Initialize black pieces (top)
  const blackPieces: [PieceType, number[]][] = [
    ["chariot", [0, 8]],
    ["horse", [1, 7]],
    ["elephant", [2, 6]], 
    ["advisor", [3, 5]],
    ["general", [4]],
    ["cannon", [1, 7]],
    ["soldier", [0, 2, 4, 6, 8]]
  ];

  blackPieces.forEach(([type, cols]) => {
    cols.forEach(col => {
      if (type === "cannon") {
        board[2][col] = { type, player: "black" };
      } else if (type === "soldier") {
        board[3][col] = { type, player: "black" };
      } else {
        board[0][col] = { type, player: "black" };
      }
    });
  });

  return board;
};

export const isValidPosition = (row: number, col: number): boolean => {
  return row >= 0 && row < BOARD_ROWS && col >= 0 && col < BOARD_COLS;
};

export const getPieceAt = (board: BoardState, pos: Position): Piece | null => {
  if (!isValidPosition(pos.row, pos.col)) return null;
  return board[pos.row][pos.col];
};

export const isInPalace = (pos: Position, player: Player): boolean => {
  if (player === "red") {
    return pos.row >= 7 && pos.row <= 9 && pos.col >= 3 && pos.col <= 5;
  } else {
    return pos.row >= 0 && pos.row <= 2 && pos.col >= 3 && pos.col <= 5;
  }
};

export const isOnOwnSide = (pos: Position, player: Player): boolean => {
  if (player === "red") {
    return pos.row >= 5;
  } else {
    return pos.row <= 4;
  }
};

export const getValidMoves = (board: BoardState, from: Position): Position[] => {
  const piece = getPieceAt(board, from);
  if (!piece) return [];

  const moves: Position[] = [];
  const { type, player } = piece;

  switch (type) {
    case "general":
      // Can move one point orthogonally within palace
      const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];
      directions.forEach(([dr, dc]) => {
        const newPos = { row: from.row + dr, col: from.col + dc };
        if (isInPalace(newPos, player)) {
          const target = getPieceAt(board, newPos);
          if (!target || target.player !== player) {
            moves.push(newPos);
          }
        }
      });
      break;

    case "advisor":
      // Can move one point diagonally within palace
      const diagonals = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
      diagonals.forEach(([dr, dc]) => {
        const newPos = { row: from.row + dr, col: from.col + dc };
        if (isInPalace(newPos, player)) {
          const target = getPieceAt(board, newPos);
          if (!target || target.player !== player) {
            moves.push(newPos);
          }
        }
      });
      break;

    case "elephant":
      // Can move two points diagonally, cannot cross river
      const elephantMoves = [[2, 2], [2, -2], [-2, 2], [-2, -2]];
      elephantMoves.forEach(([dr, dc]) => {
        const newPos = { row: from.row + dr, col: from.col + dc };
        const blockPos = { row: from.row + dr/2, col: from.col + dc/2 };
        if (isValidPosition(newPos.row, newPos.col) && 
            isOnOwnSide(newPos, player) &&
            !getPieceAt(board, blockPos)) {
          const target = getPieceAt(board, newPos);
          if (!target || target.player !== player) {
            moves.push(newPos);
          }
        }
      });
      break;

    case "horse":
      // Can move in L-shape, but can be blocked
      const horseMoves = [
        [2, 1, 1, 0], [2, -1, 1, 0], [-2, 1, -1, 0], [-2, -1, -1, 0],
        [1, 2, 0, 1], [-1, 2, 0, 1], [1, -2, 0, -1], [-1, -2, 0, -1]
      ];
      horseMoves.forEach(([dr, dc, blockR, blockC]) => {
        const blockPos = { row: from.row + blockR, col: from.col + blockC };
        const newPos = { row: from.row + dr, col: from.col + dc };
        if (isValidPosition(newPos.row, newPos.col) && !getPieceAt(board, blockPos)) {
          const target = getPieceAt(board, newPos);
          if (!target || target.player !== player) {
            moves.push(newPos);
          }
        }
      });
      break;

    case "chariot":
      // Can move any number of points orthogonally
      const orthogonals = [[0, 1], [0, -1], [1, 0], [-1, 0]];
      orthogonals.forEach(([dr, dc]) => {
        for (let i = 1; i < Math.max(BOARD_ROWS, BOARD_COLS); i++) {
          const newPos = { row: from.row + dr * i, col: from.col + dc * i };
          if (!isValidPosition(newPos.row, newPos.col)) break;
          
          const target = getPieceAt(board, newPos);
          if (target) {
            if (target.player !== player) {
              moves.push(newPos);
            }
            break;
          }
          moves.push(newPos);
        }
      });
      break;

    case "cannon":
      // Can move like chariot, but captures by jumping over one piece
      const cannonDirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];
      cannonDirs.forEach(([dr, dc]) => {
        let jumpedOver = false;
        for (let i = 1; i < Math.max(BOARD_ROWS, BOARD_COLS); i++) {
          const newPos = { row: from.row + dr * i, col: from.col + dc * i };
          if (!isValidPosition(newPos.row, newPos.col)) break;
          
          const target = getPieceAt(board, newPos);
          if (target) {
            if (!jumpedOver) {
              jumpedOver = true;
            } else {
              if (target.player !== player) {
                moves.push(newPos);
              }
              break;
            }
          } else if (!jumpedOver) {
            moves.push(newPos);
          }
        }
      });
      break;

    case "soldier":
      // Can move one point forward, and sideways after crossing river
      const forward = player === "red" ? -1 : 1;
      const forwardPos = { row: from.row + forward, col: from.col };
      
      if (isValidPosition(forwardPos.row, forwardPos.col)) {
        const target = getPieceAt(board, forwardPos);
        if (!target || target.player !== player) {
          moves.push(forwardPos);
        }
      }

      // Can move sideways if crossed river
      if (!isOnOwnSide(from, player)) {
        const sideways = [[0, 1], [0, -1]];
        sideways.forEach(([dr, dc]) => {
          const newPos = { row: from.row + dr, col: from.col + dc };
          if (isValidPosition(newPos.row, newPos.col)) {
            const target = getPieceAt(board, newPos);
            if (!target || target.player !== player) {
              moves.push(newPos);
            }
          }
        });
      }
      break;
  }

  return moves;
};

export const makeMove = (board: BoardState, move: Move): BoardState => {
  const newBoard = board.map(row => [...row]);
  newBoard[move.to.row][move.to.col] = move.piece;
  newBoard[move.from.row][move.from.col] = null;
  return newBoard;
};

export const isInCheck = (board: BoardState, player: Player): boolean => {
  // Find the general
  let generalPos: Position | null = null;
  for (let row = 0; row < BOARD_ROWS; row++) {
    for (let col = 0; col < BOARD_COLS; col++) {
      const piece = board[row][col];
      if (piece && piece.type === "general" && piece.player === player) {
        generalPos = { row, col };
        break;
      }
    }
    if (generalPos) break;
  }

  if (!generalPos) return false;

  // Check if any opponent piece can attack the general
  const opponent = player === "red" ? "black" : "red";
  for (let row = 0; row < BOARD_ROWS; row++) {
    for (let col = 0; col < BOARD_COLS; col++) {
      const piece = board[row][col];
      if (piece && piece.player === opponent) {
        const moves = getValidMoves(board, { row, col });
        if (moves.some(move => move.row === generalPos!.row && move.col === generalPos!.col)) {
          return true;
        }
      }
    }
  }

  return false;
};

export const isCheckmate = (board: BoardState, player: Player): boolean => {
  if (!isInCheck(board, player)) return false;

  // Try all possible moves to see if any can escape check
  for (let row = 0; row < BOARD_ROWS; row++) {
    for (let col = 0; col < BOARD_COLS; col++) {
      const piece = board[row][col];
      if (piece && piece.player === player) {
        const moves = getValidMoves(board, { row, col });
        for (const move of moves) {
          const testMove: Move = {
            from: { row, col },
            to: move,
            piece,
            captured: getPieceAt(board, move) || undefined
          };
          const newBoard = makeMove(board, testMove);
          if (!isInCheck(newBoard, player)) {
            return false;
          }
        }
      }
    }
  }

  return true;
};

export const getGameResult = (board: BoardState, currentPlayer: Player): Player | "draw" | null => {
  if (isCheckmate(board, currentPlayer)) {
    return currentPlayer === "red" ? "black" : "red";
  }
  
  // Simple draw condition - if no pieces can move (stalemate)
  let hasValidMove = false;
  for (let row = 0; row < BOARD_ROWS && !hasValidMove; row++) {
    for (let col = 0; col < BOARD_COLS && !hasValidMove; col++) {
      const piece = board[row][col];
      if (piece && piece.player === currentPlayer) {
        const moves = getValidMoves(board, { row, col });
        if (moves.length > 0) {
          hasValidMove = true;
        }
      }
    }
  }
  
  if (!hasValidMove) return "draw";
  return null;
};
