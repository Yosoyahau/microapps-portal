"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Sparkles } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { createClient } from "@/lib/supabase/client";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";

export default function WelcomePage() {
  const { language } = useTranslation();
  const router = useRouter();
  const supabase = createClient();
  const [firstName, setFirstName] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setFirstName(user.user_metadata?.first_name || "");
      }
    };
    fetchUser();
  }, [supabase.auth]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <GlassCard className="w-full max-w-2xl flex flex-col items-center text-center">
      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary-content text-sm font-medium mb-8 shadow-[0_0_15px_rgba(124,58,237,0.3)] animate-pulse">
        <Sparkles className="w-4 h-4 text-accent-warm" />
        {language === "en" ? "Coming Soon" : "Próximamente"}
      </div>

      <div className="w-24 h-24 rounded-full bg-linear-to-br from-primary to-accent-pink flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(124,58,237,0.4)]">
        <span className="text-white text-4xl font-bold">M</span>
      </div>

      <h1 
        className="text-4xl md:text-5xl font-bold mb-4 bg-linear-to-r from-primary via-accent-pink to-accent-warm bg-clip-text text-transparent"
        style={{ color: "transparent", WebkitTextFillColor: "transparent" }}
      >
        {language === "en" ? "Welcome to the Micro-Apps Portal!" : "¡Bienvenido al Portal de Micro-Apps!"}
      </h1>
      
      <p className="text-xl text-white/80 mb-2">
        {language === "en" ? `Hello, ${firstName} 👋` : `Hola, ${firstName} 👋`}
      </p>
      
      <p className="text-white/60 mb-12">
        {language === "en" 
          ? "We're preparing something incredible for you." 
          : "Estamos preparando algo increíble para ti."}
      </p>

      <div className="w-full max-w-xs space-y-4">
        <p className="text-sm text-white/40 mb-4">
          {language === "en" 
            ? "We'll notify you when everything is ready." 
            : "Te notificaremos cuando todo esté listo."}
        </p>

        <GlowButton variant="ghost" onClick={handleSignOut} className="gap-2">
          <LogOut className="w-4 h-4" />
          {language === "en" ? "Sign Out" : "Cerrar Sesión"}
        </GlowButton>
      </div>
    </GlassCard>
  );
}
