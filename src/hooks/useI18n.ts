
import React from "react";

interface LangMap {
  [key: string]: Record<string, string>;
}
type Lang = "zh" | "en";

export function useI18n<T extends LangMap>(
  langs: T,
  lang: Lang
): { t: (k: keyof T["zh"]) => string; lang: Lang } {
  const current = langs[lang];
  function t(key: keyof T["zh"]) {
    return current[key] || key;
  }
  return { t, lang };
}
