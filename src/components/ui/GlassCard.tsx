import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
}

export function GlassCard({ children, className }: GlassCardProps) {
  return (
    <div
      className={cn(
        "bg-base-content/[0.03] backdrop-blur-2xl border border-base-content/[0.08]",
        "shadow-[0_8px_32px_rgba(0,0,0,0.4)] rounded-2xl p-8 relative overflow-hidden",
        className
      )}
    >
      <div className="absolute inset-0 bg-linear-to-br from-base-content/[0.02] to-transparent pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
