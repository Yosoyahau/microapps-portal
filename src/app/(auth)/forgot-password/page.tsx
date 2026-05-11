"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Loader2, ArrowLeft } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { createClient } from "@/lib/supabase/client";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/ToastProvider";

export default function ForgotPasswordPage() {
  const { language } = useTranslation();
  const { toast } = useToast();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const origin = window.location.origin;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/auth/callback?next=/reset-password`,
    });

    setLoading(false);

    if (error) {
      toast({
        title: error.message,
        type: "error",
      });
    } else {
      toast({
        title: language === "en" ? "Recovery link sent to your email." : "Enlace de recuperación enviado a tu correo.",
        type: "success",
      });
      setEmail("");
    }
  };

  return (
    <GlassCard className="w-full">
      <div className="flex flex-col items-center mb-8">
        <div className="w-12 h-12 rounded-xl bg-linear-to-br from-primary to-accent-pink flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(124,58,237,0.5)]">
          <span className="text-white text-2xl font-bold">M</span>
        </div>
        <h1 
          className="text-2xl font-bold bg-linear-to-r from-primary via-accent-pink to-accent-warm bg-clip-text text-transparent text-center"
          style={{ color: "transparent", WebkitTextFillColor: "transparent" }}
        >
          Micro-Apps Portal
        </h1>
      </div>

      <form onSubmit={handleReset} className="space-y-4">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          icon={<Mail className="w-5 h-5" />}
        />
        
        <GlowButton type="submit" disabled={loading} className="mt-4">
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            language === "en" ? "Send recovery link" : "Enviar enlace de recuperación"
          )}
        </GlowButton>

        <div className="text-center mt-6">
          <Link 
            href="/login" 
            className="text-sm text-white/60 hover:text-white transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {language === "en" ? "Back to sign in" : "Volver a iniciar sesión"}
          </Link>
        </div>
      </form>
    </GlassCard>
  );
}
