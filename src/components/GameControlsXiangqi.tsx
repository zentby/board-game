
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RotateCcw, Undo, Bot, User } from "lucide-react";

interface GameControlsProps {
  gameStarted: boolean;
  onResetGame: () => void;
  onUndo: () => void;
  canUndo: boolean;
  isAIMode: boolean;
  onToggleAI: () => void;
  lang: "zh" | "en";
  t: (k: string) => string;
}

export const GameControlsXiangqi: React.FC<GameControlsProps> = ({
  gameStarted,
  onResetGame,
  onUndo,
  canUndo,
  isAIMode,
  onToggleAI,
  lang,
  t
}) => (
  <Card className="w-full max-w-sm bg-red-900 border-red-700 animate-fade-in">
    <CardHeader className="pb-4">
      <CardTitle className="text-white text-center">{lang === "zh" ? "游戏控制" : "Controls"}</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="flex gap-2">
        <Button
          onClick={onToggleAI}
          className={`flex-1 flex items-center gap-2 ${
            isAIMode 
              ? "bg-purple-500 hover:bg-purple-600" 
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {isAIMode ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
          {isAIMode ? t("ai_mode") : t("pvp_mode")}
        </Button>
      </div>
      <div className="flex gap-2">
        <Button
          onClick={onResetGame}
          className="flex-1 flex items-center gap-2 bg-red-500 hover:bg-red-600"
        >
          <RotateCcw className="w-4 h-4" />
          {gameStarted ? t("restart") : t("start_game")}
        </Button>
        <Button
          onClick={onUndo}
          disabled={!canUndo}
          className="flex-1 flex items-center gap-2 bg-red-400 hover:bg-red-500 disabled:opacity-50"
        >
          <Undo className="w-4 h-4" />
          {t("undo")}
        </Button>
      </div>
      <div className="text-xs text-red-200 space-y-1">
        <p>{t("red_first")}</p>
        <p>{t("win_desc")}</p>
        {isAIMode && <p>{t("ai_mode_desc")}</p>}
      </div>
    </CardContent>
  </Card>
);
