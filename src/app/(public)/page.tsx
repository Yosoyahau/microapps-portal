"use client";

import { useTranslation } from "@/hooks/useTranslation";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const { language, setLanguage } = useTranslation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsAuthenticated(true);
      }
    });
  }, [supabase.auth]);

  const t = {
    heroTitle: language === 'en' ? 'The Ultimate AI Micro-Apps Portal' : 'El Portal Definitivo de Micro-Apps con IA',
    heroSubtitle: language === 'en' ? 'Generate articles, viral posts, email sequences, and more in seconds. Your personal AI powerhouse.' : 'Genera artículos, posts virales, secuencias de email y más en segundos. Tu central de IA personal.',
    ctaMain: language === 'en' ? 'Start 7-Day Free Trial' : 'Empieza tu Prueba de 7 Días Gratis',
    ctaDashboard: language === 'en' ? 'Go to Dashboard' : 'Ir al Panel de Control',
    pricingTitle: language === 'en' ? 'Simple, Transparent Pricing' : 'Precios Simples y Transparentes',
    trialPlan: language === 'en' ? 'Trial' : 'Prueba',
    monthlyPlan: language === 'en' ? 'Monthly' : 'Mensual',
    annualPlan: language === 'en' ? 'Annual' : 'Anual',
    trialDesc: language === 'en' ? 'Perfect to test the waters.' : 'Perfecto para probar las herramientas.',
    monthlyDesc: language === 'en' ? 'Full access to all AI tools.' : 'Acceso total a todas las herramientas de IA.',
    annualDesc: language === 'en' ? 'Save big with an annual commitment.' : 'Ahorra en grande con el pago anual.',
    features: language === 'en' ? 'Unlimited Generations, Realtime History, All 6 Micro-Apps, Priority Support' : 'Generaciones Ilimitadas, Historial en Tiempo Real, Las 6 Micro-Apps, Soporte Prioritario',
  };

  const featureList = t.features.split(', ');

  return (
    <div className="min-h-screen bg-base-100 flex flex-col items-center justify-center relative overflow-hidden text-base-content selection:bg-primary/30">
      {/* Background Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex justify-center items-center z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-accent-pink/20 rounded-full blur-[120px] mix-blend-screen" />
      </div>

      {/* Header */}
      <header className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-20 max-w-7xl mx-auto right-0">
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" />
          <span className="font-bold text-xl tracking-wide">MicroApps</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
            className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold hover:bg-white/10 transition-colors"
          >
            {language === 'en' ? '🇪🇸 ES' : '🇺🇸 EN'}
          </button>
          {isAuthenticated ? (
            <Link href="/dashboard">
              <button className="text-sm font-medium hover:text-primary transition-colors">
                {t.ctaDashboard}
              </button>
            </Link>
          ) : (
            <Link href="/login">
              <button className="text-sm font-medium hover:text-primary transition-colors">
                Login
              </button>
            </Link>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="z-10 flex flex-col items-center text-center px-6 mt-32 max-w-4xl mx-auto w-full">

        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight mb-6 leading-tight bg-gradient-to-br from-white to-white/40 bg-clip-text text-transparent">
          {t.heroTitle}
        </h1>
        <p className="text-lg sm:text-xl text-white/50 mb-10 max-w-2xl leading-relaxed">
          {t.heroSubtitle}
        </p>

        {isAuthenticated ? (
          <Link href="/dashboard">
            <GlowButton variant="primary" className="px-8 py-4 text-lg">
              <span className="flex items-center gap-2">
                {t.ctaDashboard} <ArrowRight className="w-5 h-5" />
              </span>
            </GlowButton>
          </Link>
        ) : (
          <Link href="/login">
            <GlowButton variant="primary" className="px-8 py-4 text-lg">
              <span className="flex items-center gap-2">
                {t.ctaMain} <ArrowRight className="w-5 h-5" />
              </span>
            </GlowButton>
          </Link>
        )}

        {/* Pricing Section */}
        <div className="w-full mt-32 mb-20" id="pricing">
          <h2 className="text-3xl font-bold mb-12 text-center">{t.pricingTitle}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Free Trial */}
            <GlassCard className="p-8 flex flex-col relative overflow-hidden group hover:border-primary/50 transition-all">
              <div className="mb-8">
                <h3 className="text-xl font-bold text-white/80 mb-2">{t.trialPlan}</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold">$0</span>
                  <span className="text-white/40 text-sm">/ 7 days</span>
                </div>
                <p className="text-white/50 text-sm mt-4">{t.trialDesc}</p>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                {featureList.map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-white/70">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link href="/login" className="mt-auto">
                <button className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors font-medium">
                  {language === 'en' ? 'Start Free' : 'Empezar Gratis'}
                </button>
              </Link>
            </GlassCard>

            {/* Monthly */}
            <GlassCard className="p-8 flex flex-col relative overflow-hidden group border-primary/30 hover:border-primary transition-all">
              <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold px-3 py-1 uppercase rounded-bl-lg">
                Popular
              </div>
              <div className="absolute -inset-24 bg-primary/10 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="mb-8 relative">
                <h3 className="text-xl font-bold text-white/80 mb-2">{t.monthlyPlan}</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold">$19</span>
                  <span className="text-white/40 text-sm">/ mo</span>
                </div>
                <p className="text-white/50 text-sm mt-4">{t.monthlyDesc}</p>
              </div>
              <ul className="space-y-4 mb-8 flex-1 relative">
                {featureList.map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-white/70">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link href="/login" className="mt-auto relative">
                <GlowButton variant="primary" className="w-full py-3">
                  {language === 'en' ? 'Subscribe' : 'Suscribirse'}
                </GlowButton>
              </Link>
            </GlassCard>

            {/* Annual */}
            <GlassCard className="p-8 flex flex-col relative overflow-hidden group hover:border-accent-pink/50 transition-all">
              <div className="absolute top-0 right-0 bg-accent-pink/20 text-accent-pink text-[10px] font-bold px-3 py-1 uppercase rounded-bl-lg">
                Save 15%
              </div>
              <div className="mb-8">
                <h3 className="text-xl font-bold text-white/80 mb-2">{t.annualPlan}</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold">$190</span>
                  <span className="text-white/40 text-sm">/ yr</span>
                </div>
                <p className="text-white/50 text-sm mt-4">{t.annualDesc}</p>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                {featureList.map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-white/70">
                    <CheckCircle2 className="w-5 h-5 text-accent-pink shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link href="/login" className="mt-auto">
                <button className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors font-medium">
                  {language === 'en' ? 'Subscribe' : 'Suscribirse'}
                </button>
              </Link>
            </GlassCard>

          </div>
        </div>
      </main>
    </div>
  );
}
