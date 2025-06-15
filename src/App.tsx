
import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Landing from "@/pages/Landing";
import Gomoku from "@/pages/Gomoku";
import Othello from "@/pages/Index";
import { LanguageProvider, useLanguage } from "@/contexts/LanguageContext";

const queryClient = new QueryClient();

const TITLE_MAP = {
  en: "BoardBrilliance: Family Gomoku & Othello",
  zh: "棋乐家园：家庭五子棋与黑白棋"
};

// New inner component that uses the language context
const AppWithLanguage = () => {
  const { lang } = useLanguage();

  useEffect(() => {
    let _lang = lang;
    if (!_lang) {
      const browserLang = navigator.language?.toLowerCase();
      if (browserLang.startsWith("zh")) _lang = "zh";
      else _lang = "en";
    }
    document.title = TITLE_MAP[_lang as "en" | "zh"] || TITLE_MAP["en"];
  }, [lang]);

  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/othello" element={<Othello />} />
          <Route path="/gomoku" element={<Gomoku />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AppWithLanguage />
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;

