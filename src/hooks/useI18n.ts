import { useState, useMemo } from "react";
import { DICT } from "@/lib/constants";

export function useI18n(initial: string) {
  const [lang, setLang] = useState(initial);
  const t = useMemo(
    () => (key: string) => {
      const langDict = DICT[lang as keyof typeof DICT];
      return langDict ? langDict[key as keyof typeof langDict] || key : key;
    },
    [lang]
  );
  return { lang, setLang, t };
} 