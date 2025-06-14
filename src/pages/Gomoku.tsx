
import React, { useState, useCallback, useEffect } from 'react';
import { GameBoardGomoku } from "@/components/GameBoardGomoku";
import { GameControlsGomoku } from "@/components/GameControlsGomoku";
import { ScoreBoardGomoku } from "@/components/ScoreBoardGomoku";
import { initializeBoard, isValidMove, makeMove, isGameOver, getWinner } from "@/utils/gomokuLogic";
import { getStats, saveStats } from "@/utils/gameStats";
import { toast } from "sonner";

export type Player = "black" | "white";
export type BoardState = (Player | null)[][];

export interface GameStats {
  wins: number;
  losses: number;
  draws: number;
  played: number;
}

const Gomoku = () => {
  const [board, setBoard] = useState<BoardState>(initializeBoard());
  const [currentPlayer, setCurrentPlayer] = useState<Player>("black");
  const [gameStarted, setGameStarted] = useState(false);
  const [winner, setWinner] = useState<Player | "tie" | null>(null);
  const [stats, setStats] = useState<GameStats>(() => getStats("gomoku"));

  useEffect(() => {
    setStats(getStats("gomoku"));
  }, [winner]);

  const resetGame = useCallback(() => {
    setBoard(initializeBoard());
    setCurrentPlayer("black");
    setWinner(null);
    setGameStarted(true);
    toast.success("新五子棋游戏开始！");
  }, []);

  const handleCellClick = useCallback(
    (row: number, col: number) => {
      if (!gameStarted || winner) return;
      if (!isValidMove(board, row, col)) {
        toast.error("无效落子！");
        return;
      }
      const newBoard = makeMove(board, row, col, currentPlayer);
      setBoard(newBoard);

      if (isGameOver(newBoard, row, col, currentPlayer)) {
        const winRes = getWinner(newBoard, row, col, currentPlayer);
        setWinner(winRes);
        setGameStarted(false);

        let newStats = { ...stats, played: stats.played + 1 };
        if (winRes === "tie") {
          toast.info("平局！");
          newStats.draws++;
        } else {
          toast.success(`${winRes === "black" ? "黑棋" : "白棋"}获胜！`);
          (winRes === "black") ? newStats.wins++ : newStats.losses++;
        }
        saveStats("gomoku", newStats);
        setStats(newStats);
        return;
      }
      setCurrentPlayer(currentPlayer === "black" ? "white" : "black");
    },
    [board, currentPlayer, gameStarted, stats, winner]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-pink-500 bg-clip-text text-transparent animate-fade-in">五子棋</h1>
          <p className="text-lg text-slate-300 animate-fade-in">谁能先连成五子？快来挑战吧！</p>
        </div>
        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
          <div className="flex flex-col gap-6">
            <GameControlsGomoku 
              gameStarted={gameStarted}
              onResetGame={resetGame}
            />
            <ScoreBoardGomoku 
              board={board}
              currentPlayer={currentPlayer}
              gameStarted={gameStarted}
              winner={winner}
              stats={stats}
            />
          </div>
          <div className="flex-1 flex justify-center">
            <GameBoardGomoku 
              board={board}
              onCellClick={handleCellClick}
              currentPlayer={currentPlayer}
              gameStarted={gameStarted}
              winner={winner}
            />
          </div>
        </div>
        <div className="text-center mt-8 text-slate-400">
          <p className="text-sm">
            黑棋先行 • 横、竖、斜连续五子获胜 • 棋盘下方可重新开始
          </p>
        </div>
      </div>
    </div>
  );
};

export default Gomoku;
