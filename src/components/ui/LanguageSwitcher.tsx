"use client";

import { useTranslation } from "@/hooks/useTranslation";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ className }: { className?: string }) {
  const { language, setLanguage } = useTranslation();

  return (
    <button
      onClick={() => setLanguage(language === "es" ? "en" : "es")}
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-full",
        "bg-base-content/5 border border-base-content/10 text-sm font-medium text-base-content/80",
        "hover:bg-base-content/10 hover:text-base-content hover:border-base-content/20 transition-all",
        "backdrop-blur-md shadow-[0_4px_12px_rgba(0,0,0,0.2)]",
        className
      )}
    >
      <span className={cn("transition-colors", language === "es" ? "text-base-content" : "text-base-content/50")}>ES</span>
      <span className="text-base-content/30">|</span>
      <span className={cn("transition-colors", language === "en" ? "text-base-content" : "text-base-content/50")}>EN</span>
    </button>
  );
}
