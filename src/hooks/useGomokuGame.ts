
import { useState, useCallback, useEffect } from "react";
import { initializeBoard, isValidMove, makeMove, isGameOver, getWinner } from "@/utils/gomokuLogic";
import { makeGomokuAIMove } from "@/utils/gomokuAI";
import { getStats, saveStats } from "@/utils/gameStats";
import { toast } from "sonner";
import type { Player, BoardState, GameStats } from "@/pages/Gomoku";

export const useGomokuGame = (t: (key: string) => string) => {
  const [board, setBoard] = useState<BoardState>(initializeBoard());
  const [currentPlayer, setCurrentPlayer] = useState<Player>("white");
  const [gameStarted, setGameStarted] = useState(false);
  const [winner, setWinner] = useState<Player | "tie" | null>(null);
  const [stats, setStats] = useState<GameStats>(() => getStats("gomoku"));
  const [isAIMode, setIsAIMode] = useState(false);
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [history, setHistory] = useState<{ board: BoardState; player: Player }[]>([]);
  const [canUndo, setCanUndo] = useState(false);

  useEffect(() => {
    setStats(getStats("gomoku"));
  }, [winner]);

  // AI自动下棋
  useEffect(() => {
    if (gameStarted && isAIMode && currentPlayer === "black" && !winner) {
      console.log("AI should make a move", { gameStarted, isAIMode, currentPlayer, winner, isAIThinking });
      
      if (!isAIThinking) {
        setIsAIThinking(true);
        
        const timer = setTimeout(() => {
          console.log("AI making move...");
          const aiMove = makeGomokuAIMove(board, "black");
          console.log("AI move result:", aiMove);
          
          if (aiMove) {
            const [row, col] = aiMove;
            handleMove(row, col, false);
          }
          setIsAIThinking(false);
        }, 800);

        return () => clearTimeout(timer);
      }
    }
  }, [gameStarted, isAIMode, currentPlayer, winner, board, isAIThinking]);

  const resetGame = useCallback(() => {
    const newBoard = initializeBoard();
    setBoard(newBoard);
    setCurrentPlayer(isAIMode ? "black" : "white");
    setWinner(null);
    setGameStarted(true);
    setHistory([]);
    setCanUndo(false);
    setIsAIThinking(false);
    toast.success(t("new_game"));
  }, [t, isAIMode]);

  const handleMove = useCallback((row: number, col: number, recordHistory: boolean = true) => {
    console.log("handleMove called", { row, col, currentPlayer, recordHistory });
    
    if (!gameStarted || winner || !isValidMove(board, row, col)) {
      console.log("Move rejected", { gameStarted, winner, isValid: isValidMove(board, row, col) });
      return false;
    }

    if (recordHistory && currentPlayer === "white") {
      setHistory((prev) => [...prev, { board: board.map(r => [...r]), player: currentPlayer }]);
      setCanUndo(true);
    }

    const newBoard = makeMove(board, row, col, currentPlayer);
    setBoard(newBoard);
    console.log("Move made", { row, col, currentPlayer });

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
    setBoard(initializeBoard());
    setCurrentPlayer(!isAIMode ? "black" : "white");
    setWinner(null);
    setGameStarted(false);
    setHistory([]);
    setCanUndo(false);
    setIsAIThinking(false);
  }, [isAIMode]);

  return {
    board,
    currentPlayer,
    gameStarted,
    winner,
    stats,
    isAIMode,
    isAIThinking,
    canUndo,
    resetGame,
    handleCellClick,
    handleUndo,
    toggleAIMode
  };
};
