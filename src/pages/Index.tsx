
import React, { useState, useCallback } from 'react';
import { GameBoard } from '@/components/GameBoard';
import { GameControls } from '@/components/GameControls';
import { ScoreBoard } from '@/components/ScoreBoard';
import { initializeBoard, isValidMove, makeMove, getValidMoves, isGameOver, getWinner } from '@/utils/gameLogic';
import { makeAIMove } from '@/utils/aiLogic';
import { toast } from 'sonner';

export type Player = 'black' | 'white';
export type GameMode = 'ai' | 'human';
export type BoardState = (Player | null)[][];

const Index = () => {
  const [board, setBoard] = useState<BoardState>(initializeBoard());
  const [currentPlayer, setCurrentPlayer] = useState<Player>('black');
  const [gameMode, setGameMode] = useState<GameMode>('ai');
  const [gameStarted, setGameStarted] = useState(false);
  const [isAIThinking, setIsAIThinking] = useState(false);

  const resetGame = useCallback(() => {
    setBoard(initializeBoard());
    setCurrentPlayer('black');
    setGameStarted(true);
    toast.success('新游戏开始！');
  }, []);

  const handleCellClick = useCallback(async (row: number, col: number) => {
    if (!gameStarted || isAIThinking) return;
    
    if (!isValidMove(board, row, col, currentPlayer)) {
      toast.error('无效的移动！');
      return;
    }

    const newBoard = makeMove(board, row, col, currentPlayer);
    setBoard(newBoard);

    // Check if game is over
    if (isGameOver(newBoard)) {
      const winner = getWinner(newBoard);
      if (winner === 'tie') {
        toast.info('游戏平局！');
      } else {
        toast.success(`${winner === 'black' ? '黑棋' : '白棋'}获胜！`);
      }
      setGameStarted(false);
      return;
    }

    const nextPlayer: Player = currentPlayer === 'black' ? 'white' : 'black';
    const validMoves = getValidMoves(newBoard, nextPlayer);
    
    if (validMoves.length === 0) {
      // No valid moves for next player, skip turn
      const afterSkipValidMoves = getValidMoves(newBoard, currentPlayer);
      if (afterSkipValidMoves.length === 0) {
        // Game over
        const winner = getWinner(newBoard);
        if (winner === 'tie') {
          toast.info('游戏平局！');
        } else {
          toast.success(`${winner === 'black' ? '黑棋' : '白棋'}获胜！`);
        }
        setGameStarted(false);
        return;
      } else {
        toast.info(`${nextPlayer === 'black' ? '黑棋' : '白棋'}无法移动，跳过回合`);
        // Don't change current player
      }
    } else {
      setCurrentPlayer(nextPlayer);
      
      // AI move in AI mode
      if (gameMode === 'ai' && nextPlayer === 'white') {
        setIsAIThinking(true);
        setTimeout(() => {
          const aiBoard = makeAIMove(newBoard, 'white');
          setBoard(aiBoard);
          setIsAIThinking(false);
          
          // Check if game is over after AI move
          if (isGameOver(aiBoard)) {
            const winner = getWinner(aiBoard);
            if (winner === 'tie') {
              toast.info('游戏平局！');
            } else {
              toast.success(`${winner === 'black' ? '黑棋' : '白棋'}获胜！`);
            }
            setGameStarted(false);
            return;
          }
          
          const nextValidMoves = getValidMoves(aiBoard, 'black');
          if (nextValidMoves.length === 0) {
            toast.info('黑棋无法移动，跳过回合');
          } else {
            setCurrentPlayer('black');
          }
        }, 1000);
      }
    }
  }, [board, currentPlayer, gameMode, gameStarted, isAIThinking]);

  const switchGameMode = useCallback((mode: GameMode) => {
    setGameMode(mode);
    setGameStarted(false);
    setBoard(initializeBoard());
    setCurrentPlayer('black');
    toast.info(`切换到${mode === 'ai' ? '人机对战' : '双人对战'}模式`);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent animate-fade-in">
            黑白棋
          </h1>
          <p className="text-lg text-slate-300 animate-fade-in">
            经典策略游戏 - 征服棋盘，翻转乾坤
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
          <div className="flex flex-col gap-6">
            <GameControls
              gameMode={gameMode}
              gameStarted={gameStarted}
              onModeChange={switchGameMode}
              onResetGame={resetGame}
            />
            <ScoreBoard 
              board={board}
              currentPlayer={currentPlayer}
              gameStarted={gameStarted}
              isAIThinking={isAIThinking}
            />
          </div>
          
          <div className="flex-1 flex justify-center">
            <GameBoard
              board={board}
              onCellClick={handleCellClick}
              currentPlayer={currentPlayer}
              gameStarted={gameStarted}
            />
          </div>
        </div>

        <div className="text-center mt-8 text-slate-400">
          <p className="text-sm">
            黑棋先行 • 包围对方棋子即可翻转 • 无法移动时跳过回合
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
