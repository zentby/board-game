
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const games = [
  {
    title: "黑白棋（Othello）",
    description: "经典策略游戏，围捕对手棋子获得胜利",
    url: "/othello",
    img: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=256&q=80",
  },
  {
    title: "五子棋（Gomoku）",
    description: "率先连成五子即可取胜的棋类对战",
    url: "/gomoku",
    img: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=256&q=80",
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
                <img
                  src={game.img}
                  alt={game.title}
                  className="w-28 h-28 mx-auto rounded-xl shadow"
                  draggable={false}
                />
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
