"use client";

import { InputHTMLAttributes, ReactNode, forwardRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, icon, error, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const currentType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
      <div className="w-full flex flex-col gap-1.5">
        <div className="relative group">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40 group-focus-within:text-accent-blue transition-colors">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            type={currentType}
            className={cn(
              "w-full bg-base-300/50 border border-base-content/10 rounded-xl px-4 py-3 text-base-content placeholder:text-base-content/30 transition-all duration-300",
              "focus:outline-none focus:border-accent-blue/50 focus:ring-1 focus:ring-accent-blue/50 focus:bg-base-300/80",
              icon && "pl-11",
              isPassword && "pr-11",
              error && "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/50",
              className
            )}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content transition-colors focus:outline-none"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          )}
        </div>
        {error && <span className="text-sm text-red-400 pl-1">{error}</span>}
      </div>
    );
  }
);
Input.displayName = "Input";
