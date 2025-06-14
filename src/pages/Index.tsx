
import React, { useState, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GameBoard } from '@/components/GameBoard';
import { GameControls } from '@/components/GameControls';
import { ScoreBoard } from '@/components/ScoreBoard';
import { initializeBoard, isValidMove, makeMove, getValidMoves, isGameOver, getWinner } from '@/utils/gameLogic';
import { makeAIMove } from '@/utils/aiLogic';
import { toast } from 'sonner';
import { useLanguage } from "@/contexts/LanguageContext";

const LANGS = {
  zh: {
    return: "返回",
    title: "黑白棋",
    subtitle: "经典策略游戏 - 征服棋盘，翻转乾坤",
    mode_ai: "人机对战",
    mode_human: "双人对战",
    game_rule: "黑棋先行 • 包围对方棋子即可翻转 • 无法移动时跳过回合",
    invalid_move: "无效的移动！",
    new_game: "新游戏开始！",
    black: "黑棋",
    white: "白棋",
    win: "获胜！",
    tie: "游戏平局！",
    black_cannot_move: "黑棋无法移动，跳过回合",
    white_cannot_move: "白棋无法移动，跳过回合",
    switch_to_english: "Switch to English",
    switch_to_chinese: "切换到中文",
    change_mode: (mode: string) => `切换到${mode}模式`,
  },
  en: {
    return: "Return",
    title: "Othello",
    subtitle: "Classic strategy game - conquer the board and flip the lines!",
    mode_ai: "Vs AI",
    mode_human: "2 Players",
    game_rule: "Black goes first • Capture opponent's pieces by surrounding them • Skip turn when no valid moves",
    invalid_move: "Invalid move!",
    new_game: "New game started!",
    black: "Black",
    white: "White",
    win: "wins!",
    tie: "It's a tie!",
    black_cannot_move: "Black cannot move, turn skipped",
    white_cannot_move: "White cannot move, turn skipped",
    switch_to_english: "Switch to English",
    switch_to_chinese: "切换到中文",
    change_mode: (mode: string) => `Switched to ${mode} mode`,
  }
};
type SupportedLang = keyof typeof LANGS;

export type Player = 'black' | 'white';
export type GameMode = 'ai' | 'human';
export type BoardState = (Player | null)[][];

const Index = () => {
  const [board, setBoard] = useState<BoardState>(initializeBoard());
  const [currentPlayer, setCurrentPlayer] = useState<Player>('black');
  const [gameMode, setGameMode] = useState<GameMode>('ai');
  const [gameStarted, setGameStarted] = useState(false);
  const [isAIThinking, setIsAIThinking] = useState(false);
  const { lang, setLang } = useLanguage();
  const navigate = useNavigate();

  const texts = LANGS[lang];

  const resetGame = useCallback(() => {
    setBoard(initializeBoard());
    setCurrentPlayer('black');
    setGameStarted(true);
    toast.success(texts.new_game);
  }, [texts.new_game]);

  const handleCellClick = useCallback(async (row: number, col: number) => {
    if (!gameStarted || isAIThinking) return;
    if (!isValidMove(board, row, col, currentPlayer)) {
      toast.error(texts.invalid_move);
      return;
    }
    const newBoard = makeMove(board, row, col, currentPlayer);
    setBoard(newBoard);

    // Check if game is over
    if (isGameOver(newBoard)) {
      const winner = getWinner(newBoard);
      if (winner === 'tie') {
        toast.info(texts.tie);
      } else {
        toast.success(`${texts[winner as 'black' | 'white']}${texts.win}`);
      }
      setGameStarted(false);
      return;
    }

    const nextPlayer: Player = currentPlayer === 'black' ? 'white' : 'black';
    const validMoves = getValidMoves(newBoard, nextPlayer);
    if (validMoves.length === 0) {
      const afterSkipValidMoves = getValidMoves(newBoard, currentPlayer);
      if (afterSkipValidMoves.length === 0) {
        const winner = getWinner(newBoard);
        if (winner === 'tie') {
          toast.info(texts.tie);
        } else {
          toast.success(`${texts[winner as 'black' | 'white']}${texts.win}`);
        }
        setGameStarted(false);
        return;
      } else {
        toast.info(nextPlayer === 'black' ? texts.black_cannot_move : texts.white_cannot_move);
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

          if (isGameOver(aiBoard)) {
            const winner = getWinner(aiBoard);
            if (winner === 'tie') {
              toast.info(texts.tie);
            } else {
              toast.success(`${texts[winner as 'black' | 'white']}${texts.win}`);
            }
            setGameStarted(false);
            return;
          }

          const nextValidMoves = getValidMoves(aiBoard, 'black');
          if (nextValidMoves.length === 0) {
            toast.info(texts.black_cannot_move);
          } else {
            setCurrentPlayer('black');
          }
        }, 1000);
      }
    }
  }, [board, currentPlayer, gameMode, gameStarted, isAIThinking, texts]);

  const switchGameMode = useCallback((mode: GameMode) => {
    setGameMode(mode);
    setGameStarted(false);
    setBoard(initializeBoard());
    setCurrentPlayer('black');
    toast.info(texts.change_mode(mode === 'ai' ? texts.mode_ai : texts.mode_human));
  }, [texts]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative">
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
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent animate-fade-in">
            {texts.title}
          </h1>
          <p className="text-lg text-slate-300 animate-fade-in">
            {texts.subtitle}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
          <div className="flex flex-col gap-6">
            <GameControls
              gameMode={gameMode}
              gameStarted={gameStarted}
              onModeChange={switchGameMode}
              onResetGame={resetGame}
              lang={lang}
              texts={{
                mode_ai: texts.mode_ai,
                mode_human: texts.mode_human,
                restart: lang === "zh" ? "重新开始" : "Restart",
                start_game: lang === "zh" ? "开始游戏" : "Start Game",
                black_first: lang === "zh" ? "• 黑棋先手" : "• Black goes first",
                flip_desc: lang === "zh" ? "• 翻转对方棋子获得分数" : "• Flip the opponent's pieces to score",
                win_desc: lang === "zh" ? "• 棋子多者获胜" : "• Most pieces wins",
              }}
            />
            <ScoreBoard 
              board={board}
              currentPlayer={currentPlayer}
              gameStarted={gameStarted}
              isAIThinking={isAIThinking}
              lang={lang}
              texts={{
                black: texts.black,
                white: texts.white,
              }}
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
            {texts.game_rule}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;

// 文件很长，可考虑后续重构成更小逻辑
