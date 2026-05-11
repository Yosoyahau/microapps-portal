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
        "bg-white/5 border border-white/10 text-sm font-medium text-white/80",
        "hover:bg-white/10 hover:text-white hover:border-white/20 transition-all",
        "backdrop-blur-md shadow-[0_4px_12px_rgba(0,0,0,0.2)]",
        className
      )}
    >
      <span className={cn("transition-colors", language === "es" ? "text-white" : "text-white/50")}>ES</span>
      <span className="text-white/30">|</span>
      <span className={cn("transition-colors", language === "en" ? "text-white" : "text-white/50")}>EN</span>
    </button>
  );
}
