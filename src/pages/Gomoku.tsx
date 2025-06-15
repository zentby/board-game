
import React from "react";
import { useNavigate } from "react-router-dom";
import { GameBoardGomoku } from "@/components/GameBoardGomoku";
import { GameControlsGomoku } from "@/components/GameControlsGomoku";
import { ScoreBoardGomoku } from "@/components/ScoreBoardGomoku";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { GomokuHeader } from "@/components/GomokuHeader";
import { useGomokuGame } from "@/hooks/useGomokuGame";
import { GOMOKU_LANGS } from "@/i18n/gomoku";
import { useI18n } from "@/hooks/useI18n";
import { useLanguage } from "@/contexts/LanguageContext";

export type Player = "black" | "white";
export type BoardState = (Player | null)[][];

export interface GameStats {
  wins: number;
  losses: number;
  draws: number;
  played: number;
}

const Gomoku = () => {
  const navigate = useNavigate();
  const { lang, setLang } = useLanguage();
  const { t } = useI18n(GOMOKU_LANGS, lang);
  
  const {
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
  } = useGomokuGame(t);

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 text-white relative">
      <LanguageSwitcher 
        lang={lang}
        onLanguageSwitch={setLang}
        t={t}
      />
      
      <div className="container mx-auto px-4 py-8">
        <GomokuHeader 
          onNavigateBack={() => navigate("/")}
          t={t}
        />
        
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
