"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type Theme = "dark" | "light";
export type AccentColor = "purple" | "pink" | "blue" | "orange";

interface SettingsContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  accentColor: AccentColor;
  setAccentColor: (color: AccentColor) => void;
  focusMode: boolean;
  setFocusMode: (focus: boolean) => void;
  notifyPortalChanges: boolean;
  setNotifyPortalChanges: (notify: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [accentColor, setAccentColor] = useState<AccentColor>("purple");
  const [focusMode, setFocusMode] = useState<boolean>(false);
  const [notifyPortalChanges, setNotifyPortalChanges] = useState<boolean>(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Load from local storage
    const savedTheme = localStorage.getItem("app_theme") as Theme;
    const savedColor = localStorage.getItem("app_color") as AccentColor;
    const savedFocus = localStorage.getItem("app_focus");
    const savedNotify = localStorage.getItem("app_notify");

    if (savedTheme) setTheme(savedTheme);
    if (savedColor) setAccentColor(savedColor);
    if (savedFocus !== null) setFocusMode(savedFocus === "true");
    if (savedNotify !== null) setNotifyPortalChanges(savedNotify === "true");
    
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("app_theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme, mounted]);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("app_color", accentColor);
    document.documentElement.setAttribute("data-color", accentColor);
    
    // Set primary color css variable dynamically
    const colors = {
      purple: "#7C3AED",
      pink: "#EC4899",
      blue: "#38BDF8",
      orange: "#F97316"
    };
    document.documentElement.style.setProperty("--app-primary", colors[accentColor]);
  }, [accentColor, mounted]);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("app_focus", String(focusMode));
  }, [focusMode, mounted]);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("app_notify", String(notifyPortalChanges));
  }, [notifyPortalChanges, mounted]);

  return (
    <SettingsContext.Provider value={{
      theme, setTheme,
      accentColor, setAccentColor,
      focusMode, setFocusMode,
      notifyPortalChanges, setNotifyPortalChanges
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
