
import { useState, useCallback, useEffect, useRef } from "react";
import { initializeBoard, getValidMoves, makeMove, isInCheck, getGameResult, getPieceAt } from "@/utils/xiangqiLogic";
import { makeXiangqiAIMove } from "@/utils/xiangqiAI";
import { getStats, saveStats } from "@/utils/gameStats";
import { toast } from "sonner";
import type { Player, BoardState, Position, Move, GameStats } from "@/types/xiangqi";

export const useXiangqiGame = (t: (key: string) => string) => {
  const [board, setBoard] = useState<BoardState>(initializeBoard());
  const [currentPlayer, setCurrentPlayer] = useState<Player>("red");
  const [gameStarted, setGameStarted] = useState(false);
  const [winner, setWinner] = useState<Player | "draw" | null>(null);
  const [stats, setStats] = useState<GameStats>(() => getStats("xiangqi"));
  const [isAIMode, setIsAIMode] = useState(false);
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
  const [validMoves, setValidMoves] = useState<Position[]>([]);
  const [history, setHistory] = useState<{ board: BoardState; player: Player }[]>([]);
  const [canUndo, setCanUndo] = useState(false);

  const boardRef = useRef(board);
  boardRef.current = board;

  useEffect(() => {
    setStats(getStats("xiangqi"));
  }, [winner]);

  // AI auto move - AI plays black
  useEffect(() => {
    console.log("AI useEffect triggered", { gameStarted, isAIMode, currentPlayer, winner });
    
    if (gameStarted && isAIMode && currentPlayer === "black" && !winner) {
      console.log("AI should make a move - setting thinking state");
      setIsAIThinking(true);
      setSelectedPosition(null);
      setValidMoves([]);
      
      const timer = setTimeout(() => {
        try {
          console.log("AI timer fired, making move...");
          const currentBoard = boardRef.current;
          const aiMove = makeXiangqiAIMove(currentBoard, "black");
          console.log("AI move result:", aiMove);
          
          if (aiMove) {
            const newBoard = makeMove(currentBoard, aiMove);
            setBoard(newBoard);
            
            const result = getGameResult(newBoard, "red");
            if (result) {
              setWinner(result);
              setGameStarted(false);
              
              const currentStats = getStats("xiangqi");
              let newStats = { ...currentStats, played: currentStats.played + 1 };
              if (result === "draw") {
                toast.info(t("draw"));
                newStats.draws++;
              } else if (result === "red") {
                toast.success(t("you_win"));
                newStats.wins++;
              } else if (result === "black") {
                toast.success(t("ai_wins"));
                newStats.losses++;
              }
              saveStats("xiangqi", newStats);
              setStats(newStats);
            } else {
              setCurrentPlayer("red");
              if (isInCheck(newBoard, "red")) {
                toast.warning(t("in_check"));
              }
            }
          }
        } catch (error) {
          console.error("Error in AI move:", error);
        } finally {
          setIsAIThinking(false);
        }
      }, 1000);

      return () => {
        console.log("AI useEffect cleanup");
        clearTimeout(timer);
        setIsAIThinking(false);
      };
    }
  }, [gameStarted, isAIMode, currentPlayer, winner, t]);

  const resetGame = useCallback(() => {
    const newBoard = initializeBoard();
    setBoard(newBoard);
    setCurrentPlayer("red");
    setWinner(null);
    setGameStarted(true);
    setSelectedPosition(null);
    setValidMoves([]);
    setHistory([]);
    setCanUndo(false);
    setIsAIThinking(false);
    toast.success(t("new_game"));
  }, [t]);

  const handleCellClick = useCallback((row: number, col: number) => {
    if (!gameStarted || winner || isAIThinking) return;
    if (isAIMode && currentPlayer === "black") return;

    const clickedPiece = getPieceAt(board, { row, col });
    
    // If no piece is selected
    if (!selectedPosition) {
      if (clickedPiece && clickedPiece.player === currentPlayer) {
        setSelectedPosition({ row, col });
        const moves = getValidMoves(board, { row, col });
        // Filter moves that don't leave king in check
        const safeMoves = moves.filter(move => {
          const testMove: Move = {
            from: { row, col },
            to: move,
            piece: clickedPiece,
            captured: getPieceAt(board, move) || undefined
          };
          const newBoard = makeMove(board, testMove);
          return !isInCheck(newBoard, currentPlayer);
        });
        setValidMoves(safeMoves);
        toast.info(t("piece_selected"));
      }
      return;
    }

    // If clicking the same piece, deselect
    if (selectedPosition.row === row && selectedPosition.col === col) {
      setSelectedPosition(null);
      setValidMoves([]);
      return;
    }

    // If clicking another piece of the same color, select it
    if (clickedPiece && clickedPiece.player === currentPlayer) {
      setSelectedPosition({ row, col });
      const moves = getValidMoves(board, { row, col });
      const safeMoves = moves.filter(move => {
        const testMove: Move = {
          from: { row, col },
          to: move,
          piece: clickedPiece,
          captured: getPieceAt(board, move) || undefined
        };
        const newBoard = makeMove(board, testMove);
        return !isInCheck(newBoard, currentPlayer);
      });
      setValidMoves(safeMoves);
      return;
    }

    // Try to make a move
    const isValidMove = validMoves.some(move => move.row === row && move.col === col);
    if (!isValidMove) {
      toast.error(t("invalid_move"));
      return;
    }

    const selectedPiece = getPieceAt(board, selectedPosition)!;
    const move: Move = {
      from: selectedPosition,
      to: { row, col },
      piece: selectedPiece,
      captured: clickedPiece || undefined
    };

    // Record history
    if (currentPlayer === "red") {
      setHistory(prev => [...prev, { board: board.map(r => [...r]), player: currentPlayer }]);
      setCanUndo(true);
    }

    const newBoard = makeMove(board, move);
    setBoard(newBoard);
    setSelectedPosition(null);
    setValidMoves([]);

    const result = getGameResult(newBoard, currentPlayer === "red" ? "black" : "red");
    if (result) {
      setWinner(result);
      setGameStarted(false);
      
      let newStats = { ...stats, played: stats.played + 1 };
      if (result === "draw") {
        toast.info(t("draw"));
        newStats.draws++;
      } else if (result === "red") {
        toast.success(isAIMode ? t("you_win") : t("red_win"));
        newStats.wins++;
      } else if (result === "black") {
        toast.success(isAIMode ? t("ai_wins") : t("black_win"));
        newStats.losses++;
      }
      saveStats("xiangqi", newStats);
      setStats(newStats);
      setCanUndo(false);
    } else {
      const nextPlayer = currentPlayer === "red" ? "black" : "red";
      setCurrentPlayer(nextPlayer);
      if (isInCheck(newBoard, nextPlayer)) {
        toast.warning(t("in_check"));
      }
    }
  }, [board, currentPlayer, gameStarted, winner, isAIMode, isAIThinking, selectedPosition, validMoves, stats, t]);

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
    setSelectedPosition(null);
    setValidMoves([]);
    toast.success(t("undo_success"));
  }, [canUndo, history, isAIMode, t]);

  const toggleAIMode = useCallback(() => {
    setIsAIMode(!isAIMode);
    setBoard(initializeBoard());
    setCurrentPlayer("red");
    setWinner(null);
    setGameStarted(false);
    setSelectedPosition(null);
    setValidMoves([]);
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
    selectedPosition,
    validMoves,
    canUndo,
    resetGame,
    handleCellClick,
    handleUndo,
    toggleAIMode
  };
};
