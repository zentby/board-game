
import React from "react";
import { cn } from "@/lib/utils";
import type { BoardState, Player, Position } from "@/types/xiangqi";
import { getPieceAt } from "@/utils/xiangqiLogic";

interface GameBoardXiangqiProps {
  board: BoardState;
  onCellClick: (row: number, col: number) => void;
  currentPlayer: Player;
  gameStarted: boolean;
  winner: Player | "draw" | null;
  isAIMode?: boolean;
  isAIThinking?: boolean;
  selectedPosition: Position | null;
  validMoves: Position[];
  t: (key: string) => string;
}

const getPieceSymbols = (t: (key: string) => string) => ({
  red: {
    general: t("piece_general"),
    advisor: t("piece_advisor"), 
    elephant: t("piece_elephant"),
    horse: t("piece_horse"),
    chariot: t("piece_chariot"),
    cannon: t("piece_cannon"),
    soldier: t("piece_soldier")
  },
  black: {
    general: "將",
    advisor: "士",
    elephant: "象", 
    horse: "馬",
    chariot: "車",
    cannon: "砲",
    soldier: "卒"
  }
});

export const GameBoardXiangqi: React.FC<GameBoardXiangqiProps> = ({
  board,
  onCellClick,
  currentPlayer,
  gameStarted,
  winner,
  isAIMode = false,
  isAIThinking = false,
  selectedPosition,
  validMoves,
  t
}) => {
  const PIECE_SYMBOLS = getPieceSymbols(t);

  const isValidMovePosition = (row: number, col: number) => {
    return validMoves.some(move => move.row === row && move.col === col);
  };

  const isSelected = (row: number, col: number) => {
    return selectedPosition?.row === row && selectedPosition?.col === col;
  };

  return (
    <div className={cn(
      "p-4 bg-gradient-to-br from-amber-100 to-yellow-200 rounded-2xl shadow-2xl animate-scale-in transition-all duration-300",
      isAIThinking && "opacity-75"
    )}>
      {/* AI thinking indicator */}
      {isAIThinking && (
        <div className="absolute inset-0 bg-black bg-opacity-30 rounded-lg flex items-center justify-center z-10">
          <div className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm">{t("ai_thinking")}</span>
          </div>
        </div>
      )}

      <div className="relative bg-amber-50 p-4 rounded-lg border-2 border-amber-800">
        {/* River */}
        <div className="absolute left-4 right-4 top-1/2 transform -translate-y-1/2 h-8 bg-blue-100 border-t-2 border-b-2 border-blue-300 flex items-center justify-center">
          <div className="text-blue-600 font-bold text-lg">楚河 ——————— 漢界</div>
        </div>

        {/* Palace markers */}
        <div className="absolute left-16 top-4 w-12 h-12 border-2 border-red-600 bg-red-50 opacity-30"></div>
        <div className="absolute left-16 bottom-4 w-12 h-12 border-2 border-red-600 bg-red-50 opacity-30"></div>

        <div
          className="gap-0 grid relative"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(9, minmax(0, 1fr))',
            gridTemplateRows: 'repeat(10, minmax(0, 1fr))'
          }}
        >
          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
              const piece = getPieceAt(board, { row: rowIndex, col: colIndex });
              const isValidMove = isValidMovePosition(rowIndex, colIndex);
              const isSelectedPiece = isSelected(rowIndex, colIndex);
              
              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={cn(
                    "w-12 h-12 md:w-14 md:h-14 relative flex items-center justify-center cursor-pointer transition-all duration-200",
                    "border-r border-b border-amber-600",
                    !gameStarted && "cursor-not-allowed opacity-80",
                    isAIMode && currentPlayer === "black" && "cursor-not-allowed",
                    isAIThinking && "pointer-events-none",
                    isValidMove && "bg-green-200 hover:bg-green-300",
                    isSelectedPiece && "bg-blue-200",
                    // River styling
                    (rowIndex === 4 || rowIndex === 5) && "border-b-4 border-blue-400"
                  )}
                  onClick={() => gameStarted && !winner && !isAIThinking && onCellClick(rowIndex, colIndex)}
                >
                  {/* Cross lines for intersections */}
                  {colIndex < 8 && (
                    <div className="absolute right-0 top-1/2 w-px h-full bg-amber-600 transform -translate-y-1/2"></div>
                  )}
                  {rowIndex < 9 && rowIndex !== 4 && (
                    <div className="absolute bottom-0 left-1/2 w-full h-px bg-amber-600 transform -translate-x-1/2"></div>
                  )}

                  {/* Palace diagonal lines */}
                  {((rowIndex <= 2 || rowIndex >= 7) && colIndex >= 3 && colIndex <= 5) && (
                    <>
                      <div className="absolute inset-0 border-amber-600" style={{
                        background: `linear-gradient(45deg, transparent 49%, currentColor 49%, currentColor 51%, transparent 51%)`
                      }}></div>
                      <div className="absolute inset-0 border-amber-600" style={{
                        background: `linear-gradient(-45deg, transparent 49%, currentColor 49%, currentColor 51%, transparent 51%)`
                      }}></div>
                    </>
                  )}

                  {/* Valid move indicator */}
                  {isValidMove && !piece && (
                    <div className="w-3 h-3 bg-green-500 rounded-full opacity-70"></div>
                  )}

                  {/* Piece */}
                  {piece && (
                    <div
                      className={cn(
                        "w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-lg transition-all duration-300 border-2",
                        piece.player === "red"
                          ? "bg-red-500 text-white border-red-700 hover:bg-red-600"
                          : "bg-gray-800 text-white border-gray-900 hover:bg-gray-700",
                        isSelectedPiece && "ring-4 ring-blue-400 scale-110",
                        isValidMove && "ring-2 ring-green-400"
                      )}
                    >
                      {PIECE_SYMBOLS[piece.player][piece.type]}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
