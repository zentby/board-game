
import React from 'react';
import { BoardState, Player } from '@/pages/Index';
import { isValidMove } from '@/utils/gameLogic';
import { cn } from '@/lib/utils';

interface GameBoardProps {
  board: BoardState;
  onCellClick: (row: number, col: number) => void;
  currentPlayer: Player;
  gameStarted: boolean;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  board,
  onCellClick,
  currentPlayer,
  gameStarted,
}) => {
  return (
    <div className="p-4 bg-gradient-to-br from-green-800 to-green-900 rounded-2xl shadow-2xl animate-scale-in">
      <div className="grid grid-cols-8 gap-1 bg-green-700 p-2 rounded-xl">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const isValid = gameStarted && isValidMove(board, rowIndex, colIndex, currentPlayer);
            
            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={cn(
                  "w-12 h-12 md:w-14 md:h-14 bg-green-600 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-green-500 border border-green-700",
                  isValid && "ring-2 ring-yellow-400 ring-opacity-60",
                  !gameStarted && "cursor-not-allowed"
                )}
                onClick={() => onCellClick(rowIndex, colIndex)}
              >
                {cell && (
                  <div
                    className={cn(
                      "w-8 h-8 md:w-10 md:h-10 rounded-full shadow-lg transform transition-all duration-300 animate-scale-in",
                      cell === 'black' 
                        ? "bg-gradient-to-br from-gray-800 to-black border-2 border-gray-600" 
                        : "bg-gradient-to-br from-white to-gray-200 border-2 border-gray-300",
                      "hover:scale-105"
                    )}
                  />
                )}
                {isValid && (
                  <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-yellow-400 bg-opacity-40" />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
