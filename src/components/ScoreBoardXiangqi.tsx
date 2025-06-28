
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BoardState, Player, GameStats } from "@/types/xiangqi";
import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";

interface ScoreBoardProps {
  board: BoardState;
  currentPlayer: Player;
  gameStarted: boolean;
  winner: Player | "draw" | null;
  stats: GameStats;
  isAIMode: boolean;
  isAIThinking: boolean;
  lang: "zh" | "en";
  t: (k: string) => string;
}

export const ScoreBoardXiangqi: React.FC<ScoreBoardProps> = ({
  currentPlayer,
  gameStarted,
  winner,
  stats,
  isAIMode,
  isAIThinking,
  lang,
  t
}) => (
  <Card className="w-full max-w-sm bg-red-900 border-red-700 animate-fade-in">
    <CardHeader className="pb-4">
      <CardTitle className="text-white text-center">{lang === "zh" ? "比分/历史" : "Score/Stats"}</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="flex items-center justify-between p-3 rounded-lg transition-all duration-300 bg-red-800">
        <span className="text-white font-medium">{t("played")}</span>
        <span className="text-2xl font-bold text-white">{stats.played}</span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="flex flex-col items-center bg-red-800 p-2 rounded">
          <span className="text-red-100 text-xs">{t("wins")}</span>
          <span className="text-lg font-bold text-green-300">{stats.wins}</span>
        </div>
        <div className="flex flex-col items-center bg-red-800 p-2 rounded">
          <span className="text-red-100 text-xs">{t("losses")}</span>
          <span className="text-lg font-bold text-red-300">{stats.losses}</span>
        </div>
        <div className="flex flex-col items-center bg-red-800 p-2 rounded">
          <span className="text-red-100 text-xs">{t("draws")}</span>
          <span className="text-lg font-bold text-yellow-300">{stats.draws}</span>
        </div>
      </div>
      {gameStarted ? (
        <div className="text-center p-3 bg-red-800 rounded-lg">
          <div className="flex items-center justify-center gap-2">
            <div
              className={cn(
                "w-4 h-4 rounded-full",
                currentPlayer === "red"
                  ? "bg-gradient-to-br from-red-500 to-red-700"
                  : "bg-gradient-to-br from-gray-800 to-black"
              )}
            />
            {isAIMode && currentPlayer === "red" ? (
              <User className="w-4 h-4 text-blue-400" />
            ) : isAIMode && currentPlayer === "black" ? (
              <Bot className="w-4 h-4 text-purple-400" />
            ) : null}
            <span className="text-sm text-red-100">
              {isAIThinking ? t("ai_thinking") : 
                isAIMode ? 
                  (currentPlayer === "red" ? t("your_turn") : t("ai_turn")) :
                  `${currentPlayer === "red" ? t("player_red") : t("player_black")}${lang === "zh" ? "回合" : "'s turn"}`
              }
            </span>
          </div>
        </div>
      ) : winner ? (
        <div className="text-center p-3 bg-red-800 rounded-lg">
          <span className="text-sm text-red-300">
            {winner === "draw"
              ? t("draw")
              : isAIMode
                ? (winner === "red" ? t("you_win") : t("ai_wins"))
                : `${winner === "red" ? t("player_red") : t("player_black")}${lang === "zh" ? "获胜！" : " wins!"}`}
          </span>
        </div>
      ) : (
        <div className="text-center p-3 bg-red-800 rounded-lg">
          <span className="text-sm text-red-200">{lang === "zh" ? "点击开始游戏" : "Click to start the game"}</span>
        </div>
      )}
    </CardContent>
  </Card>
);
