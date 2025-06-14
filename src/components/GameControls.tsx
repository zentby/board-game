
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GameMode } from '@/pages/Index';
import { Users, Bot, RotateCcw } from 'lucide-react';

interface GameControlsProps {
  gameMode: GameMode;
  gameStarted: boolean;
  onModeChange: (mode: GameMode) => void;
  onResetGame: () => void;
}

export const GameControls: React.FC<GameControlsProps> = ({
  gameMode,
  gameStarted,
  onModeChange,
  onResetGame,
}) => {
  return (
    <Card className="w-full max-w-sm bg-slate-800 border-slate-700 animate-fade-in">
      <CardHeader className="pb-4">
        <CardTitle className="text-white text-center">游戏控制</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-slate-300 mb-3">选择游戏模式：</p>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={gameMode === 'ai' ? 'default' : 'outline'}
              onClick={() => onModeChange('ai')}
              disabled={gameStarted}
              className="flex items-center gap-2 text-sm"
            >
              <Bot className="w-4 h-4" />
              人机对战
            </Button>
            <Button
              variant={gameMode === 'human' ? 'default' : 'outline'}
              onClick={() => onModeChange('human')}
              disabled={gameStarted}
              className="flex items-center gap-2 text-sm"
            >
              <Users className="w-4 h-4" />
              双人对战
            </Button>
          </div>
        </div>
        
        <Button
          onClick={onResetGame}
          className="w-full flex items-center gap-2 bg-green-600 hover:bg-green-700"
        >
          <RotateCcw className="w-4 h-4" />
          {gameStarted ? '重新开始' : '开始游戏'}
        </Button>
        
        <div className="text-xs text-slate-400 space-y-1">
          <p>• 黑棋先手</p>
          <p>• 翻转对方棋子获得分数</p>
          <p>• 棋子多者获胜</p>
        </div>
      </CardContent>
    </Card>
  );
};
