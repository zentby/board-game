
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import OthelloSVG from "@/components/svg/OthelloSVG";
import GomokuSVG from "@/components/svg/GomokuSVG";

const games = [
  {
    title: "黑白棋（Othello）",
    description: "经典策略游戏，围捕对手棋子获得胜利",
    url: "/othello",
    icon: <OthelloSVG className="mx-auto mb-1"/>,
  },
  {
    title: "五子棋（Gomoku）",
    description: "率先连成五子即可取胜的棋类对战",
    url: "/gomoku",
    icon: <GomokuSVG className="mx-auto mb-1"/>,
  },
];

const Landing = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
      <div className="w-full max-w-3xl mx-auto px-4 py-12">
        <div className="mb-8 text-center animate-fade-in">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent mb-3">
            休闲棋类对战
          </h1>
          <p className="text-slate-300 text-lg">选择你想玩的游戏</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {games.map(game => (
            <Card key={game.title} className="animate-scale-in">
              <CardHeader>
                <CardTitle className="text-center">{game.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-3">
                {/* SVG icon */}
                <div className="w-28 h-28 flex items-center justify-center rounded-xl shadow bg-white/20">
                  {game.icon}
                </div>
                <div className="text-slate-400 text-sm text-center">{game.description}</div>
                <Button className="mt-3 px-7 py-2" onClick={() => navigate(game.url)}>
                  进入
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Landing;
