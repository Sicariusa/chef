import { en } from "./locales/en";
import { ar } from "./locales/ar";
import type { Translations } from "./locales/en";
import { useLanguage } from "../contexts/LanguageContext";

export function useTranslation() {
  const { language } = useLanguage();
  const translations = language === "ar" ? ar : en;

  function t(key: string, params?: Record<string, string | number>): string {
    const keys = key.split(".");
    let value: any = translations;

    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) {
        console.warn(`Translation key "${key}" not found`);
        return key;
      }
    }

    if (typeof value !== "string") {
      return key;
    }

    // Replace parameters
    if (params) {
      return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
        return params[paramKey]?.toString() || match;
      });
    }

    return value;
  }

  return { t, language, translations };
}

export { en, ar };
export type { Translations };

