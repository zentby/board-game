
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface LangMap {
  [key: string]: Record<string, string>;
}
type Lang = "zh" | "en";

/**
 * 新增：如果未传 lang，则自动从 context 获取。
 */
export function useI18n<T extends LangMap>(
  langs: T,
  customLang?: Lang
): { t: (k: string) => string; lang: Lang } {
  const ctx = (() => {
    try {
      return useLanguage();
    } catch {
      return undefined;
    }
  })();
  const lang = customLang || ctx?.lang || "zh";
  const current = langs[lang];

  function t(key: string) {
    return current[key] || key;
  }
  return { t, lang };
}
