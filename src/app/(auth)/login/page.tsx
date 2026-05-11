"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Loader2 } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { createClient } from "@/lib/supabase/client";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/ToastProvider";

function LoginForm() {
  const { language } = useTranslation();
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchParams.get("verified") === "true") {
      toast({
        title: language === "en" ? "Email Confirmed! Your account has been verified." : "¡Email Confirmado! Tu cuenta ha sido verificada.",
        type: "success",
      });
      // Clean up URL
      router.replace("/login");
    }

    if (searchParams.get("error") === "auth-link-failed") {
      toast({
        title: language === "en" ? "Authentication link is invalid or has expired." : "El enlace de autenticación es inválido o ha expirado.",
        type: "error",
      });
      router.replace("/login");
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        router.push("/");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [searchParams, language, router, supabase.auth, toast]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        title: error.message,
        type: "error",
      });
      setLoading(false);
    } else {
      router.push("/");
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
        <p className="text-white/60 mt-2 text-sm text-center">
          {language === "en" ? "Your micro applications portal" : "Tu portal de micro aplicaciones"}
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          icon={<Mail className="w-5 h-5" />}
        />
        <Input
          type="password"
          placeholder={language === "en" ? "Password" : "Contraseña"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          icon={<Lock className="w-5 h-5" />}
        />
        
        <div className="flex justify-end">
          <Link 
            href="/forgot-password" 
            className="text-sm text-accent-blue hover:text-accent-blue/80 transition-colors"
          >
            {language === "en" ? "Forgot your password?" : "¿Olvidaste tu contraseña?"}
          </Link>
        </div>

        <GlowButton type="submit" disabled={loading} className="mt-2">
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            language === "en" ? "Sign In" : "Iniciar Sesión"
          )}
        </GlowButton>

        <div className="text-center mt-6">
          <Link 
            href="/signup" 
            className="text-sm text-white/60 hover:text-white transition-colors"
          >
            {language === "en" ? "Don't have an account? Sign up" : "¿No tienes cuenta? Regístrate"}
          </Link>
        </div>
      </form>
    </GlassCard>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <GlassCard className="w-full flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </GlassCard>
    }>
      <LoginForm />
    </Suspense>
  );
}
