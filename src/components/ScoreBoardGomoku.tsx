import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BoardState, Player, GameStats } from "@/pages/Gomoku";
import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";

interface ScoreBoardProps {
  board: BoardState;
  currentPlayer: Player;
  gameStarted: boolean;
  winner: Player | "tie" | null;
  stats: GameStats;
  isAIMode: boolean;
  isAIThinking: boolean;
  lang: "zh" | "en";
  t: (k: string) => string;
}

export const ScoreBoardGomoku: React.FC<ScoreBoardProps> = ({
  currentPlayer,
  gameStarted,
  winner,
  stats,
  isAIMode,
  isAIThinking,
  lang,
  t
}) => (
  <Card className="w-full max-w-sm bg-yellow-900 border-yellow-700 animate-fade-in">
    <CardHeader className="pb-4">
      <CardTitle className="text-white text-center">{lang === "zh" ? "比分/历史" : "Score/Stats"}</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="flex items-center justify-between p-3 rounded-lg transition-all duration-300 bg-yellow-800">
        <span className="text-white font-medium">{t("played")}</span>
        <span className="text-2xl font-bold text-white">{stats.played}</span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="flex flex-col items-center bg-yellow-800 p-2 rounded">
          <span className="text-yellow-100 text-xs">{t("wins")}</span>
          <span className="text-lg font-bold text-green-300">{stats.wins}</span>
        </div>
        <div className="flex flex-col items-center bg-yellow-800 p-2 rounded">
          <span className="text-yellow-100 text-xs">{t("losses")}</span>
          <span className="text-lg font-bold text-red-300">{stats.losses}</span>
        </div>
        <div className="flex flex-col items-center bg-yellow-800 p-2 rounded">
          <span className="text-yellow-100 text-xs">{t("draws")}</span>
          <span className="text-lg font-bold text-yellow-300">{stats.draws}</span>
        </div>
      </div>
      {gameStarted ? (
        <div className="text-center p-3 bg-yellow-800 rounded-lg">
          <div className="flex items-center justify-center gap-2">
            <div
              className={cn(
                "w-4 h-4 rounded-full",
                currentPlayer === "black"
                  ? "bg-gradient-to-br from-gray-800 to-black"
                  : "bg-gradient-to-br from-white to-gray-200"
              )}
            />
            {isAIMode && currentPlayer === "black" ? (
              <User className="w-4 h-4 text-blue-400" />
            ) : isAIMode && currentPlayer === "white" ? (
              <Bot className="w-4 h-4 text-purple-400" />
            ) : null}
            <span className="text-sm text-yellow-100">
              {isAIThinking ? t("ai_thinking") : 
                isAIMode ? 
                  (currentPlayer === "black" ? t("your_turn") : t("ai_turn")) :
                  `${currentPlayer === "black" ? t("player_black") : t("player_white")}${lang === "zh" ? "回合" : "'s turn"}`
              }
            </span>
          </div>
        </div>
      ) : winner ? (
        <div className="text-center p-3 bg-yellow-800 rounded-lg">
          <span className="text-sm text-yellow-300">
            {winner === "tie"
              ? t("tie")
              : isAIMode
                ? (winner === "black" ? t("you_win") : t("ai_wins"))
                : `${winner === "black" ? t("player_black") : t("player_white")}${lang === "zh" ? "获胜！" : " wins!"}`}
          </span>
        </div>
      ) : (
        <div className="text-center p-3 bg-yellow-800 rounded-lg">
          <span className="text-sm text-yellow-200">{lang === "zh" ? "点击开始游戏" : "Click to start the game"}</span>
        </div>
      )}
    </CardContent>
  </Card>
);
