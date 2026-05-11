"use client";

import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error";

interface ToastMessage {
  id: number;
  title: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (options: { title: string; type: ToastType }) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

let toastIdCounter = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const toast = useCallback(({ title, type }: { title: string; type: ToastType }) => {
    const id = ++toastIdCounter;
    setToasts((prev) => [...prev, { id, title, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-2xl backdrop-blur-xl border border-white/10 shadow-2xl transition-all duration-300 animate-in slide-in-from-right-8 fade-in pointer-events-auto",
              "bg-[#0A0520]/80"
            )}
          >
            <div
              className={cn(
                "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
                t.type === "success" ? "bg-green-950/70 text-green-400" : "bg-red-950/70 text-red-400"
              )}
            >
              {t.type === "success" ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
            </div>
            <span className="text-sm font-medium text-white/90">{t.title}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
