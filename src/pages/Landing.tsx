
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import OthelloSVG from "@/components/svg/OthelloSVG";
import GomokuSVG from "@/components/svg/GomokuSVG";
import { Languages, Crown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const LANGS = {
  zh: {
    mainTitle: "休闲棋类对战",
    subtitle: "选择你想玩的游戏",
    othelloTitle: "黑白棋（Othello）",
    othelloDesc: "经典策略游戏，围捕对手棋子获得胜利",
    gomokuTitle: "五子棋（Gomoku）",
    gomokuDesc: "率先连成五子即可取胜的棋类对战",
    xiangqiTitle: "象棋（Chinese Chess）",
    xiangqiDesc: "中华传统象棋，策略与智慧的较量",
    enter: "进入",
  },
  en: {
    mainTitle: "Casual Board Games",
    subtitle: "Select a game to play",
    othelloTitle: "Othello",
    othelloDesc: "Classic strategy game: outflank your opponent's pieces to win",
    gomokuTitle: "Gomoku",
    gomokuDesc: "Be the first to connect five stones to win the match",
    xiangqiTitle: "Chinese Chess",
    xiangqiDesc: "Traditional Chinese Chess - A battle of strategy and wisdom",
    enter: "Enter",
  },
};

type SupportedLang = keyof typeof LANGS;

const Landing = () => {
  const { lang, setLang } = useLanguage();
  const navigate = useNavigate();

  const texts = LANGS[lang];

  const games = [
    {
      title: texts.othelloTitle,
      description: texts.othelloDesc,
      url: "/othello",
      icon: <OthelloSVG className="mx-auto mb-1"/>,
    },
    {
      title: texts.gomokuTitle,
      description: texts.gomokuDesc,
      url: "/gomoku",
      icon: <GomokuSVG className="mx-auto mb-1"/>,
    },
    {
      title: texts.xiangqiTitle,
      description: texts.xiangqiDesc,
      url: "/xiangqi",
      icon: <Crown className="mx-auto mb-1 w-16 h-16 text-amber-600"/>,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center relative">
      {/* 语言切换按钮 */}
      <div className="absolute top-5 right-6">
        <Button
          variant="ghost"
          size="icon"
          aria-label={lang === "zh" ? "切换到英文" : "Switch to Chinese"}
          onClick={() => setLang(lang === "zh" ? "en" : "zh")}
          className="rounded-full"
        >
          <Languages className="w-5 h-5" />
          <span className="sr-only">
            {lang === "zh" ? "Switch to English" : "切换到中文"}
          </span>
        </Button>
      </div>

      <div className="w-full max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8 text-center animate-fade-in">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent mb-3">
            {texts.mainTitle}
          </h1>
          <p className="text-slate-300 text-lg">{texts.subtitle}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {games.map(game => (
            <Card key={game.title} className="animate-scale-in">
              <CardHeader>
                <CardTitle className="text-center">{game.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-3">
                <div className="w-28 h-28 flex items-center justify-center rounded-xl shadow bg-white/20">
                  {game.icon}
                </div>
                <div className="text-slate-400 text-sm text-center">{game.description}</div>
                <Button className="mt-3 px-7 py-2" onClick={() => navigate(game.url)}>
                  {texts.enter}
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
