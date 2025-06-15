
import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Languages, Undo } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GameBoardGomoku } from "@/components/GameBoardGomoku";
import { GameControlsGomoku } from "@/components/GameControlsGomoku";
import { ScoreBoardGomoku } from "@/components/ScoreBoardGomoku";
import { initializeBoard, isValidMove, makeMove, isGameOver, getWinner } from "@/utils/gomokuLogic";
import { makeGomokuAIMove } from "@/utils/gomokuAI";
import { getStats, saveStats } from "@/utils/gameStats";
import { toast } from "sonner";
import { GOMOKU_LANGS } from "@/i18n/gomoku";
import { useI18n } from "@/hooks/useI18n";
import { useLanguage } from "@/contexts/LanguageContext";

type SupportedLang = keyof typeof GOMOKU_LANGS;
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
  const [isAIMode, setIsAIMode] = useState(false);
  const [isAIThinking, setIsAIThinking] = useState(false);
  const { lang, setLang } = useLanguage();
  
  const [history, setHistory] = useState<{ board: BoardState; player: Player }[]>([]);
  const [canUndo, setCanUndo] = useState(false);

  const navigate = useNavigate();
  const { t } = useI18n(GOMOKU_LANGS, lang);

  useEffect(() => {
    setStats(getStats("gomoku"));
  }, [winner]);

  // AI自动下棋 - AI现在执黑棋先手
  useEffect(() => {
    if (gameStarted && isAIMode && currentPlayer === "black" && !winner && !isAIThinking) {
      setIsAIThinking(true);
      
      // 添加延迟让AI思考更自然
      const timer = setTimeout(() => {
        const aiMove = makeGomokuAIMove(board, "black");
        if (aiMove) {
          const [row, col] = aiMove;
          handleMove(row, col, false); // false表示不记录历史（AI下棋不能悔棋）
        }
        setIsAIThinking(false);
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [gameStarted, isAIMode, currentPlayer, winner, board, isAIThinking]);

  const resetGame = useCallback(() => {
    setBoard(initializeBoard());
    setCurrentPlayer("black");
    setWinner(null);
    setGameStarted(true);
    setHistory([]);
    setCanUndo(false);
    setIsAIThinking(false);
    toast.success(t("new_game"));
  }, [t]);

  const handleMove = useCallback((row: number, col: number, recordHistory: boolean = true) => {
    if (!gameStarted || winner || !isValidMove(board, row, col)) {
      return false;
    }

    // 记录历史用于悔棋（只记录玩家的棋步）
    if (recordHistory && currentPlayer === "white") {
      setHistory((prev) => [...prev, { board: board.map(r => [...r]), player: currentPlayer }]);
      setCanUndo(true);
    }

    const newBoard = makeMove(board, row, col, currentPlayer);
    setBoard(newBoard);

    if (isGameOver(newBoard, row, col, currentPlayer)) {
      const winRes = getWinner(newBoard, row, col, currentPlayer);
      setWinner(winRes);
      setGameStarted(false);

      let newStats = { ...stats, played: stats.played + 1 };
      if (winRes === "tie") {
        toast.info(t("tie"));
        newStats.draws++;
      } else if (winRes === "black") {
        toast.success(isAIMode ? t("ai_win") : t("black_win"));
        newStats.losses++;
      } else if (winRes === "white") {
        toast.success(isAIMode ? t("you_win") : t("white_win"));
        newStats.wins++;
      }
      saveStats("gomoku", newStats);
      setStats(newStats);
      setCanUndo(false);
      return true;
    }

    setCurrentPlayer(currentPlayer === "black" ? "white" : "black");
    return true;
  }, [board, currentPlayer, gameStarted, stats, winner, t, isAIMode]);

  const handleCellClick = useCallback(
    (row: number, col: number) => {
      // AI模式下只允许玩家（白棋）下棋
      if (isAIMode && currentPlayer === "black") {
        return;
      }
      
      if (!isValidMove(board, row, col)) {
        toast.error(t("invalid_move"));
        return;
      }

      handleMove(row, col, true);
    },
    [board, currentPlayer, isAIMode, handleMove, t]
  );

  const handleUndo = useCallback(() => {
    if (!canUndo || !history.length || isAIMode) {
      toast.error(t("no_undo"));
      return;
    }
    const last = history[history.length - 1];
    setBoard(last.board);
    setCurrentPlayer(last.player);
    setHistory([]);
    setWinner(null);
    setGameStarted(true);
    setCanUndo(false);
    toast.success(t("undo_success"));
  }, [canUndo, history, isAIMode, t]);

  const toggleAIMode = useCallback(() => {
    setIsAIMode(!isAIMode);
    // 切换模式时重置游戏
    setBoard(initializeBoard());
    setCurrentPlayer("black");
    setWinner(null);
    setGameStarted(false);
    setHistory([]);
    setCanUndo(false);
    setIsAIThinking(false);
  }, [isAIMode]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 text-white relative">
      {/* 语言切换按钮 */}
      <div className="absolute top-5 right-6 z-10">
        <Button
          variant="ghost"
          size="icon"
          aria-label={lang === "zh" ? t("switch_to_english") : t("switch_to_chinese")}
          onClick={() => setLang(lang === "zh" ? "en" : "zh")}
          className="rounded-full"
        >
          <Languages className="w-5 h-5" />
          <span className="sr-only">
            {lang === "zh" ? t("switch_to_english") : t("switch_to_chinese")}
          </span>
        </Button>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-5 flex items-center">
          <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
            <ArrowLeft className="w-5 h-5 mr-1" />
            {t("return")}
          </Button>
        </div>
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-pink-500 bg-clip-text text-transparent animate-fade-in">{t("title")}</h1>
          <p className="text-lg text-slate-300 animate-fade-in">{t("subtitle")}</p>
        </div>
        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
          <div className="flex flex-col gap-6">
            <GameControlsGomoku 
              gameStarted={gameStarted}
              onResetGame={resetGame}
              onUndo={handleUndo}
              canUndo={canUndo && !isAIMode}
              isAIMode={isAIMode}
              onToggleAI={toggleAIMode}
              lang={lang}
              t={t}
            />
            <ScoreBoardGomoku 
              board={board}
              currentPlayer={currentPlayer}
              gameStarted={gameStarted}
              winner={winner}
              stats={stats}
              isAIMode={isAIMode}
              isAIThinking={isAIThinking}
              lang={lang}
              t={t}
            />
          </div>
          <div className="flex-1 flex justify-center">
            <GameBoardGomoku 
              board={board}
              onCellClick={handleCellClick}
              currentPlayer={currentPlayer}
              gameStarted={gameStarted}
              winner={winner}
              isAIMode={isAIMode}
              isAIThinking={isAIThinking}
            />
          </div>
        </div>
        <div className="text-center mt-8 text-slate-400">
          <p className="text-sm">{t("game_rule")}</p>
        </div>
      </div>
    </div>
  );
};
export default Gomoku;
