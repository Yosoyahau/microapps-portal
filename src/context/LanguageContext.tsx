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
    // Sync from localStorage AFTER hydration (wrapped in try/catch for Safari Incognito)
    try {
      const stored = localStorage.getItem("language");
      if (stored === "en" || stored === "es") {
        startTransition(() => {
          setLanguageState(stored as Language);
        });
      }
    } catch (error) {
      console.warn("localStorage is blocked");
    }
  }, []);

  const setLanguage = (lang: Language) => {
    try {
      localStorage.setItem("language", lang);
    } catch (error) {
      console.warn("localStorage is blocked");
    }
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
