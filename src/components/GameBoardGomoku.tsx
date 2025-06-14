
import React from "react";
import { cn } from "@/lib/utils";
import type { BoardState, Player } from "@/pages/Gomoku";

interface GameBoardGomokuProps {
  board: BoardState;
  onCellClick: (row: number, col: number) => void;
  currentPlayer: Player;
  gameStarted: boolean;
  winner: Player | "tie" | null;
}

export const GameBoardGomoku: React.FC<GameBoardGomokuProps> = ({
  board,
  onCellClick,
  currentPlayer,
  gameStarted,
  winner,
}) => {
  return (
    <div className="p-4 bg-gradient-to-br from-yellow-800 to-pink-900 rounded-2xl shadow-2xl animate-scale-in">
      <div className="grid grid-cols-15 gap-1 bg-yellow-700 p-1 rounded-lg">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={cn(
                "w-6 h-6 md:w-9 md:h-9 bg-yellow-600 rounded relative flex items-center justify-center border border-yellow-700 cursor-pointer transition-all duration-200 hover:bg-yellow-500",
                !gameStarted && "cursor-not-allowed opacity-80",
                !!cell && "cursor-default"
              )}
              onClick={() => gameStarted && !cell && !winner && onCellClick(rowIndex, colIndex)}
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
