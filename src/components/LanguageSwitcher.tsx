
import React from "react";
import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LanguageSwitcherProps {
  lang: "zh" | "en";
  onLanguageSwitch: (lang: "zh" | "en") => void;
  t: (key: string) => string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  lang,
  onLanguageSwitch,
  t
}) => {
  return (
    <div className="absolute top-5 right-6 z-10">
      <Button
        variant="ghost"
        size="icon"
        aria-label={lang === "zh" ? t("switch_to_english") : t("switch_to_chinese")}
        onClick={() => onLanguageSwitch(lang === "zh" ? "en" : "zh")}
        className="rounded-full"
      >
        <Languages className="w-5 h-5" />
        <span className="sr-only">
          {lang === "zh" ? t("switch_to_english") : t("switch_to_chinese")}
        </span>
      </Button>
    </div>
  );
};
