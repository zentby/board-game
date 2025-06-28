
import React from "react";
import { useNavigate } from "react-router-dom";
import { GameBoardXiangqi } from "@/components/GameBoardXiangqi";
import { GameControlsXiangqi } from "@/components/GameControlsXiangqi";
import { ScoreBoardXiangqi } from "@/components/ScoreBoardXiangqi";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { XiangqiHeader } from "@/components/XiangqiHeader";
import { useXiangqiGame } from "@/hooks/useXiangqiGame";
import { XIANGQI_LANGS } from "@/i18n/xiangqi";
import { useI18n } from "@/hooks/useI18n";
import { useLanguage } from "@/contexts/LanguageContext";

const Xiangqi = () => {
  const navigate = useNavigate();
  const { lang, setLang } = useLanguage();
  const { t } = useI18n(XIANGQI_LANGS, lang);
  
  const {
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
  } = useXiangqiGame(t);

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 text-white relative">
      <LanguageSwitcher 
        lang={lang}
        onLanguageSwitch={setLang}
        t={t}
      />
      
      <div className="container mx-auto px-4 py-8">
        <XiangqiHeader 
          onNavigateBack={() => navigate("/")}
          t={t}
        />
        
        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
          <div className="flex flex-col gap-6">
            <GameControlsXiangqi 
              gameStarted={gameStarted}
              onResetGame={resetGame}
              onUndo={handleUndo}
              canUndo={canUndo && !isAIMode}
              isAIMode={isAIMode}
              onToggleAI={toggleAIMode}
              lang={lang}
              t={t}
            />
            <ScoreBoardXiangqi 
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
            <GameBoardXiangqi 
              board={board}
              onCellClick={handleCellClick}
              currentPlayer={currentPlayer}
              gameStarted={gameStarted}
              winner={winner}
              isAIMode={isAIMode}
              isAIThinking={isAIThinking}
              selectedPosition={selectedPosition}
              validMoves={validMoves}
              t={t}
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

export default Xiangqi;
