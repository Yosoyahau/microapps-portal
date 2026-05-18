"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, User, Loader2 } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { createClient } from "@/lib/supabase/client";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/ToastProvider";

export default function SignUpPage() {
  const { language } = useTranslation();
  const { toast } = useToast();
  const router = useRouter();
  const supabase = createClient();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const origin = window.location.origin;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/login?verified=true`,
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    });

    setLoading(false);

    if (error) {
      toast({
        title: error.message,
        type: "error",
      });
    } else {
      localStorage.setItem("showWelcome", "true");
      document.cookie = "showWelcome=true; path=/; max-age=60";
      toast({
        title: language === "en" ? "Check your email to verify your account." : "Revisa tu correo para verificar tu cuenta.",
        type: "success",
      });
      router.push("/login");
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

      <form onSubmit={handleSignUp} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            type="text"
            placeholder={language === "en" ? "First Name" : "Nombre"}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            icon={<User className="w-5 h-5" />}
          />
          <Input
            type="text"
            placeholder={language === "en" ? "Last Name" : "Apellido"}
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
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
        
        <GlowButton type="submit" disabled={loading} className="mt-6">
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            language === "en" ? "Create Account" : "Crear Cuenta"
          )}
        </GlowButton>

        <div className="text-center mt-6">
          <Link 
            href="/login" 
            className="text-sm text-white/60 hover:text-white transition-colors"
          >
            {language === "en" ? "Already have an account? Sign in" : "¿Ya tienes cuenta? Inicia sesión"}
          </Link>
        </div>
      </form>
    </GlassCard>
  );
}
