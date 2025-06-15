
import React from "react";
import { cn } from "@/lib/utils";
import type { BoardState, Player } from "@/pages/Gomoku";

interface GameBoardGomokuProps {
  board: BoardState;
  onCellClick: (row: number, col: number) => void;
  currentPlayer: Player;
  gameStarted: boolean;
  winner: Player | "tie" | null;
  isAIMode?: boolean;
  isAIThinking?: boolean;
}

export const GameBoardGomoku: React.FC<GameBoardGomokuProps> = ({
  board,
  onCellClick,
  currentPlayer,
  gameStarted,
  winner,
  isAIMode = false,
  isAIThinking = false,
}) => {
  return (
    <div className={cn(
      "p-4 bg-gradient-to-br from-yellow-800 to-pink-900 rounded-2xl shadow-2xl animate-scale-in transition-all duration-300",
      isAIThinking && "opacity-75"
    )}>
      <div
        className="gap-1 bg-yellow-700 p-1 rounded-lg grid relative"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(15, minmax(0, 1fr))',
          gridTemplateRows: 'repeat(15, minmax(0, 1fr))'
        }}
      >
        {/* AI思考提示 */}
        {isAIThinking && (
          <div className="absolute inset-0 bg-black bg-opacity-30 rounded-lg flex items-center justify-center z-10">
            <div className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm">AI思考中...</span>
            </div>
          </div>
        )}
        
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={cn(
                "w-6 h-6 md:w-9 md:h-9 bg-yellow-600 rounded relative flex items-center justify-center border border-yellow-700 cursor-pointer transition-all duration-200 hover:bg-yellow-500",
                !gameStarted && "cursor-not-allowed opacity-80",
                !!cell && "cursor-default",
                isAIMode && currentPlayer === "white" && "cursor-not-allowed",
                isAIThinking && "pointer-events-none"
              )}
              onClick={() => gameStarted && !cell && !winner && !isAIThinking && onCellClick(rowIndex, colIndex)}
            >
              {cell && (
                <div
                  className={cn(
                    "w-5 h-5 md:w-7 md:h-7 rounded-full shadow-lg transition-all duration-300 animate-scale-in",
                    cell === "black"
                      ? "bg-gradient-to-br from-gray-800 to-black border-2 border-gray-600"
                      : "bg-gradient-to-br from-white to-gray-200 border-2 border-gray-300"
                  )}
                />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
