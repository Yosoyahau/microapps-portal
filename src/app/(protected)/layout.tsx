import { ReactNode } from "react";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-base-100 text-base-content relative">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent-pink/20 blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] rounded-full bg-accent-blue/20 blur-[100px] pointer-events-none" />

      {/* Top right Language Switcher */}
      <div className="absolute top-6 right-6 z-50">
        <LanguageSwitcher />
      </div>

      <div className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
        <main className="flex-1 overflow-y-auto w-full p-6 lg:p-8 flex items-center justify-center">
          {children}
        </main>
      </div>
    </div>
  );
}
