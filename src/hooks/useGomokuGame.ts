
import { useState, useCallback, useEffect } from "react";
import { initializeBoard, isValidMove, makeMove, isGameOver, getWinner } from "@/utils/gomokuLogic";
import { makeGomokuAIMove } from "@/utils/gomokuAI";
import { getStats, saveStats } from "@/utils/gameStats";
import { toast } from "sonner";
import type { Player, BoardState, GameStats } from "@/pages/Gomoku";

export const useGomokuGame = (t: (key: string) => string) => {
  const [board, setBoard] = useState<BoardState>(initializeBoard());
  const [currentPlayer, setCurrentPlayer] = useState<Player>("black");
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

  // AI自动下棋 - AI执白棋
  useEffect(() => {
    if (gameStarted && isAIMode && currentPlayer === "white" && !winner && !isAIThinking) {
      console.log("AI should make a move", { gameStarted, isAIMode, currentPlayer, winner, isAIThinking });
      
      setIsAIThinking(true);
      
      const timer = setTimeout(() => {
        console.log("AI making move...");
        const aiMove = makeGomokuAIMove(board, "white");
        console.log("AI move result:", aiMove);
        
        if (aiMove) {
          const [row, col] = aiMove;
          // 直接在这里处理AI的移动，避免调用handleMove造成循环
          if (isValidMove(board, row, col)) {
            const newBoard = makeMove(board, row, col, "white");
            setBoard(newBoard);
            
            if (isGameOver(newBoard, row, col, "white")) {
              const winRes = getWinner(newBoard, row, col, "white");
              setWinner(winRes);
              setGameStarted(false);

              let newStats = { ...stats, played: stats.played + 1 };
              if (winRes === "tie") {
                toast.info(t("tie"));
                newStats.draws++;
              } else if (winRes === "black") {
                toast.success(t("you_win"));
                newStats.wins++;
              } else if (winRes === "white") {
                toast.success(t("ai_win"));
                newStats.losses++;
              }
              saveStats("gomoku", newStats);
              setStats(newStats);
            } else {
              setCurrentPlayer("black");
            }
          }
        }
        setIsAIThinking(false);
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [gameStarted, isAIMode, currentPlayer, winner, isAIThinking, t, stats]);

  const resetGame = useCallback(() => {
    const newBoard = initializeBoard();
    setBoard(newBoard);
    setCurrentPlayer("black"); // 总是黑棋先手
    setWinner(null);
    setGameStarted(true);
    setHistory([]);
    setCanUndo(false);
    setIsAIThinking(false);
    toast.success(t("new_game"));
  }, [t]);

  const handleMove = useCallback((row: number, col: number, recordHistory: boolean = true) => {
    console.log("handleMove called", { row, col, currentPlayer, recordHistory });
    
    if (!gameStarted || winner || !isValidMove(board, row, col)) {
      console.log("Move rejected", { gameStarted, winner, isValid: isValidMove(board, row, col) });
      return false;
    }

    if (recordHistory && currentPlayer === "black") {
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
        toast.success(isAIMode ? t("you_win") : t("black_win"));
        newStats.wins++;
      } else if (winRes === "white") {
        toast.success(isAIMode ? t("ai_win") : t("white_win"));
        newStats.losses++;
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
      if (isAIMode && currentPlayer === "white") {
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
    setCurrentPlayer("black"); // 总是黑棋先手
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
