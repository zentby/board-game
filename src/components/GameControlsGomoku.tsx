
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RotateCcw } from "lucide-react";

interface GameControlsProps {
  gameStarted: boolean;
  onResetGame: () => void;
}

export const GameControlsGomoku: React.FC<GameControlsProps> = ({
  gameStarted,
  onResetGame,
}) => (
  <Card className="w-full max-w-sm bg-yellow-900 border-yellow-700 animate-fade-in">
    <CardHeader className="pb-4">
      <CardTitle className="text-white text-center">游戏控制</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <Button
        onClick={onResetGame}
        className="w-full flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600"
      >
        <RotateCcw className="w-4 h-4" />
        {gameStarted ? "重新开始" : "开始游戏"}
      </Button>
      <div className="text-xs text-yellow-200 space-y-1">
        <p>• 黑棋先手</p>
        <p>• 率先连成五子者获胜</p>
      </div>
    </CardContent>
  </Card>
);
