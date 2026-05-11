"use client";

import React, { createContext, useState, useEffect, useTransition, ReactNode } from "react";

type Language = "es" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Always initialize with the server-safe default
  const [language, setLanguageState] = useState<Language>("es");
  const [, startTransition] = useTransition();

  useEffect(() => {
    // Sync from localStorage AFTER hydration
    const stored = localStorage.getItem("language");
    if (stored === "en" || stored === "es") {
      startTransition(() => {
        setLanguageState(stored as Language);
      });
    }
  }, []);

  const setLanguage = (lang: Language) => {
    localStorage.setItem("language", lang);
    startTransition(() => {
      setLanguageState(lang);
    });
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}
