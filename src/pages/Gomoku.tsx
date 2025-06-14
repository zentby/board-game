
import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Languages, Undo } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GameBoardGomoku } from "@/components/GameBoardGomoku";
import { GameControlsGomoku } from "@/components/GameControlsGomoku";
import { ScoreBoardGomoku } from "@/components/ScoreBoardGomoku";
import { initializeBoard, isValidMove, makeMove, isGameOver, getWinner } from "@/utils/gomokuLogic";
import { getStats, saveStats } from "@/utils/gameStats";
import { toast } from "sonner";
import { GOMOKU_LANGS } from "@/i18n/gomoku";
import { useI18n } from "@/hooks/useI18n";

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
  const [lang, setLang] = useState<SupportedLang>("zh");
  // 新增悔棋：增加步数记录
  const [history, setHistory] = useState<{ board: BoardState; player: Player }[]>([]);
  const [canUndo, setCanUndo] = useState(false);

  const navigate = useNavigate();
  const { t } = useI18n(GOMOKU_LANGS, lang);

  useEffect(() => {
    setStats(getStats("gomoku"));
    // eslint-disable-next-line
  }, [winner]);

  const resetGame = useCallback(() => {
    setBoard(initializeBoard());
    setCurrentPlayer("black");
    setWinner(null);
    setGameStarted(true);
    setHistory([]);
    setCanUndo(false);
    toast.success(t("new_game"));
  }, [t]);

  const handleCellClick = useCallback(
    (row: number, col: number) => {
      if (!gameStarted || winner) return;
      if (!isValidMove(board, row, col)) {
        toast.error(t("invalid_move"));
        return;
      }
      // 每次落子先保存历史用于悔棋
      setHistory((prev) => [...prev, { board: board.map(r => [...r]), player: currentPlayer }]);
      setCanUndo(true);

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
          toast.success(t("black_win"));
          newStats.wins++;
        } else if (winRes === "white") {
          toast.success(t("white_win"));
          newStats.losses++;
        }
        saveStats("gomoku", newStats);
        setStats(newStats);
        setCanUndo(false); // 游戏结束不能悔棋
        return;
      }
      setCurrentPlayer(currentPlayer === "black" ? "white" : "black");
    },
    [board, currentPlayer, gameStarted, stats, winner, t]
  );

  // 悔棋功能，只允许悔一次（可拓展多次）
  const handleUndo = useCallback(() => {
    if (!canUndo || !history.length) {
      toast.error(t("no_undo"));
      return;
    }
    const last = history[history.length - 1];
    setBoard(last.board);
    setCurrentPlayer(last.player);
    setHistory([]);
    setWinner(null);
    setGameStarted(true);
    setCanUndo(false); // 只允许悔一次
    toast.success(t("undo_success"));
  }, [canUndo, history, t]);

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
              canUndo={canUndo}
              lang={lang}
              t={t}
            />
            <ScoreBoardGomoku 
              board={board}
              currentPlayer={currentPlayer}
              gameStarted={gameStarted}
              winner={winner}
              stats={stats}
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
