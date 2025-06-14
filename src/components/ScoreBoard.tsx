
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BoardState, Player } from '@/pages/Index';
import { getScore } from '@/utils/gameLogic';
import { cn } from '@/lib/utils';
import { Brain, Loader2 } from 'lucide-react';

interface ScoreBoardProps {
  board: BoardState;
  currentPlayer: Player;
  gameStarted: boolean;
  isAIThinking: boolean;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({
  board,
  currentPlayer,
  gameStarted,
  isAIThinking,
}) => {
  const { black, white } = getScore(board);

  return (
    <Card className="w-full max-w-sm bg-slate-800 border-slate-700 animate-fade-in">
      <CardHeader className="pb-4">
        <CardTitle className="text-white text-center">比分</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className={cn(
            "flex items-center justify-between p-3 rounded-lg transition-all duration-300",
            currentPlayer === 'black' && gameStarted ? "bg-slate-700 ring-2 ring-blue-500" : "bg-slate-900"
          )}>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-800 to-black border-2 border-gray-600" />
              <span className="text-white font-medium">黑棋</span>
            </div>
            <span className="text-2xl font-bold text-white">{black}</span>
          </div>
          
          <div className={cn(
            "flex items-center justify-between p-3 rounded-lg transition-all duration-300",
            currentPlayer === 'white' && gameStarted ? "bg-slate-700 ring-2 ring-blue-500" : "bg-slate-900"
          )}>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-white to-gray-200 border-2 border-gray-300" />
              <span className="text-white font-medium">白棋</span>
            </div>
            <span className="text-2xl font-bold text-white">{white}</span>
          </div>
        </div>
        
        {gameStarted && (
          <div className="text-center p-3 bg-slate-900 rounded-lg">
            {isAIThinking ? (
              <div className="flex items-center justify-center gap-2 text-blue-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">AI思考中...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <div className={cn(
                  "w-4 h-4 rounded-full",
                  currentPlayer === 'black' 
                    ? "bg-gradient-to-br from-gray-800 to-black" 
                    : "bg-gradient-to-br from-white to-gray-200"
                )} />
                <span className="text-sm text-slate-300">
                  {currentPlayer === 'black' ? '黑棋' : '白棋'}回合
                </span>
              </div>
            )}
          </div>
        )}
        
        {!gameStarted && (
          <div className="text-center p-3 bg-slate-900 rounded-lg">
            <span className="text-sm text-slate-400">点击开始游戏</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
