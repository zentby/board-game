
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RotateCcw, Undo } from "lucide-react";

interface GameControlsProps {
  gameStarted: boolean;
  onResetGame: () => void;
  onUndo: () => void;
  canUndo: boolean;
  lang: "zh" | "en";
  t: (k: string) => string;
}

export const GameControlsGomoku: React.FC<GameControlsProps> = ({
  gameStarted,
  onResetGame,
  onUndo,
  canUndo,
  lang,
  t
}) => (
  <Card className="w-full max-w-sm bg-yellow-900 border-yellow-700 animate-fade-in">
    <CardHeader className="pb-4">
      <CardTitle className="text-white text-center">{lang === "zh" ? "游戏控制" : "Controls"}</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="flex gap-2">
        <Button
          onClick={onResetGame}
          className="flex-1 flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600"
        >
          <RotateCcw className="w-4 h-4" />
          {gameStarted ? t("restart") : t("start_game")}
        </Button>
        <Button
          onClick={onUndo}
          disabled={!canUndo}
          className="flex-1 flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 disabled:opacity-50"
        >
          <Undo className="w-4 h-4" />
          {t("undo")}
        </Button>
      </div>
      <div className="text-xs text-yellow-200 space-y-1">
        <p>{t("black_first")}</p>
        <p>{t("win_desc")}</p>
      </div>
    </CardContent>
  </Card>
);
