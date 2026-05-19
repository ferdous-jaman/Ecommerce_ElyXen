import { useLanguageStore } from "@/store/useLanguageStore";
import { translations } from "@/lib/translations";
import type { TranslationKey } from "@/lib/translations";

export function useTranslation() {
  const { language, toggleLanguage, setLanguage } = useLanguageStore();
  const dict = translations[language];

  function t(key: TranslationKey): string {
    return dict[key] ?? key;
  }

  return { t, language, toggleLanguage, setLanguage };
}
