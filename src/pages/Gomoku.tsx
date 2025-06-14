
import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GameBoardGomoku } from "@/components/GameBoardGomoku";
import { GameControlsGomoku } from "@/components/GameControlsGomoku";
import { ScoreBoardGomoku } from "@/components/ScoreBoardGomoku";
import { initializeBoard, isValidMove, makeMove, isGameOver, getWinner } from "@/utils/gomokuLogic";
import { getStats, saveStats } from "@/utils/gameStats";
import { toast } from "sonner";

const LANGS = {
  zh: {
    return: "返回",
    title: "五子棋",
    subtitle: "谁能先连成五子？快来挑战吧！",
    game_rule: "黑棋先行 • 横、竖、斜连续五子获胜 • 棋盘下方可重新开始",
    invalid_move: "无效落子！",
    new_game: "新五子棋游戏开始！",
    black_win: "黑棋获胜！",
    white_win: "白棋获胜！",
    tie: "平局！",
    switch_to_english: "Switch to English",
    switch_to_chinese: "切换到中文",
    played: "总局数",
    wins: "胜",
    losses: "负",
    draws: "和",
    player_black: "黑棋",
    player_white: "白棋",
  },
  en: {
    return: "Return",
    title: "Gomoku",
    subtitle: "Who can be first to align five? Come and challenge yourself!",
    game_rule: "Black moves first • 5 in a row (horizontally, vertically or diagonally) wins • Start new game below",
    invalid_move: "Invalid move!",
    new_game: "New Gomoku game started!",
    black_win: "Black wins!",
    white_win: "White wins!",
    tie: "Draw!",
    switch_to_english: "Switch to English",
    switch_to_chinese: "切换到中文",
    played: "Played",
    wins: "Wins",
    losses: "Losses",
    draws: "Draws",
    player_black: "Black",
    player_white: "White",
  }
};
type SupportedLang = keyof typeof LANGS;

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
  const [lang, setLang] = useState<SupportedLang>("zh");
  const navigate = useNavigate();

  const texts = LANGS[lang];

  useEffect(() => {
    setStats(getStats("gomoku"));
    // eslint-disable-next-line
  }, [winner]);

  const resetGame = useCallback(() => {
    setBoard(initializeBoard());
    setCurrentPlayer("black");
    setWinner(null);
    setGameStarted(true);
    toast.success(texts.new_game);
  }, [texts.new_game]);

  const handleCellClick = useCallback(
    (row: number, col: number) => {
      if (!gameStarted || winner) return;
      if (!isValidMove(board, row, col)) {
        toast.error(texts.invalid_move);
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
          toast.info(texts.tie);
          newStats.draws++;
        } else if (winRes === "black") {
          toast.success(texts.black_win);
          newStats.wins++;
        } else if (winRes === "white") {
          toast.success(texts.white_win);
          newStats.losses++;
        }
        saveStats("gomoku", newStats);
        setStats(newStats);
        return;
      }
      setCurrentPlayer(currentPlayer === "black" ? "white" : "black");
    },
    [board, currentPlayer, gameStarted, stats, winner, texts]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 text-white relative">
      {/* 语言切换按钮 */}
      <div className="absolute top-5 right-6 z-10">
        <Button
          variant="ghost"
          size="icon"
          aria-label={lang === "zh" ? texts.switch_to_english : texts.switch_to_chinese}
          onClick={() => setLang(lang === "zh" ? "en" : "zh")}
          className="rounded-full"
        >
          <Languages className="w-5 h-5" />
          <span className="sr-only">
            {lang === "zh" ? texts.switch_to_english : texts.switch_to_chinese}
          </span>
        </Button>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-5 flex items-center">
          <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
            <ArrowLeft className="w-5 h-5 mr-1" />
            {texts.return}
          </Button>
        </div>
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-pink-500 bg-clip-text text-transparent animate-fade-in">{texts.title}</h1>
          <p className="text-lg text-slate-300 animate-fade-in">{texts.subtitle}</p>
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
            {texts.game_rule}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Gomoku;

