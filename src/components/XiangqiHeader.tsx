
import React from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface XiangqiHeaderProps {
  onNavigateBack: () => void;
  t: (key: string) => string;
}

export const XiangqiHeader: React.FC<XiangqiHeaderProps> = ({
  onNavigateBack,
  t
}) => {
  return (
    <>
      <div className="mb-5 flex items-center">
        <Button variant="ghost" size="sm" onClick={onNavigateBack}>
          <ArrowLeft className="w-5 h-5 mr-1" />
          {t("return")}
        </Button>
      </div>
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-red-400 to-amber-500 bg-clip-text text-transparent animate-fade-in">
          {t("title")}
        </h1>
        <p className="text-lg text-slate-300 animate-fade-in">{t("subtitle")}</p>
      </div>
    </>
  );
};
