import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface GlowButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost";
}

export const GlowButton = forwardRef<HTMLButtonElement, GlowButtonProps>(
  ({ className, variant = "primary", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "relative w-full flex items-center justify-center px-4 py-3 rounded-xl font-semibold transition-all duration-300",
          "focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed",
          variant === "primary" && [
            "bg-linear-to-r from-primary to-accent-pink text-primary-content",
            "hover:shadow-[0_0_20px_rgba(124,58,237,0.5)] hover:scale-[1.02]",
            "border border-white/10"
          ],
          variant === "ghost" && [
            "bg-transparent text-white/70 border border-white/10",
            "hover:bg-white/5 hover:text-white hover:border-white/20"
          ],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
GlowButton.displayName = "GlowButton";
