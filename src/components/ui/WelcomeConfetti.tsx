"use client";

import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { useTranslation } from "@/hooks/useTranslation";
import { X, Sparkles, Rocket, BarChart3, ShieldCheck } from "lucide-react";
import { createPortal } from "react-dom";

export function WelcomeConfetti() {
  const { language } = useTranslation();
  const [step, setStep] = useState<"hidden" | "confetti" | "onboarding">("hidden");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Check if new user
    const isNew = localStorage.getItem("showWelcome");
    if (isNew === "true") {
      // Remove it so it only runs once
      localStorage.removeItem("showWelcome");
      
      // Show instantly
      setStep("confetti");
      setTimeout(() => {
        fireConfetti();
      }, 100);
    }
  }, []);

  const fireConfetti = () => {
    const duration = 4000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      // Golden Star confetti from left and right
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#FFE400', '#FFBD00', '#E89400', '#FFCA6C', '#FDFFB8'],
        shapes: ['star']
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#FFE400', '#FFBD00', '#E89400', '#FFCA6C', '#FDFFB8'],
        shapes: ['star']
      });
    }, 250);
  };

  if (!mounted || step === "hidden") return null;

  if (typeof document === 'undefined') return null;

  return createPortal(
    <>
      <div 
        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) setStep("hidden");
        }}
      >
        
        {step === "confetti" && (
          <div className="relative w-full max-w-lg p-8 rounded-3xl bg-linear-to-br from-[#1a103c] to-[#0A0520] border border-white/20 shadow-[0_0_50px_rgba(124,58,237,0.3)] flex flex-col items-center text-center animate-in zoom-in-95 fade-in duration-500">
            <button 
              onClick={() => setStep("onboarding")} 
              className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="w-20 h-20 rounded-full bg-linear-to-br from-[#FFD700] to-[#FF8C00] flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(255,215,0,0.4)] relative">
              <Sparkles className="w-10 h-10 text-white absolute" />
              <div className="absolute inset-0 rounded-full bg-white/20 animate-ping" />
            </div>
            
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {language === "en" ? "Congratulations!" : "¡Felicidades!"}
            </h2>
            
            <p className="text-lg md:text-xl text-white/80 font-medium">
              {language === "en" 
                ? "This is the first step towards your success." 
                : "Este es el primer paso hacia tu éxito."}
            </p>
            
            <button 
              onClick={() => setStep("onboarding")}
              className="mt-8 px-8 py-3 rounded-full bg-white text-black font-semibold hover:bg-white/90 hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
              {language === "en" ? "Let's Start" : "Comenzar"}
            </button>
          </div>
        )}

        {step === "onboarding" && (
          <div className="relative w-full max-w-xl p-8 rounded-3xl bg-linear-to-br from-[#1a103c] to-[#0A0520] border border-white/20 shadow-[0_0_50px_rgba(124,58,237,0.3)] flex flex-col animate-in slide-in-from-right-8 fade-in duration-500">
            <button 
              onClick={() => setStep("hidden")} 
              className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">
                {language === "en" ? "Your Personal Command Center" : "Tu Centro de Mando Personal"}
              </h2>
              <p className="text-white/60">
                {language === "en" 
                  ? "Welcome to the Micro-Apps Portal. Here you will find all the tools you need gathered in one place." 
                  : "Bienvenido al Micro-Apps Portal. Aquí encontrarás todas las herramientas que necesitas reunidas en un solo lugar."}
              </p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                <div className="w-12 h-12 shrink-0 rounded-full bg-primary/20 text-primary flex items-center justify-center">
                  <Rocket className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">
                    {language === "en" ? "Centralized Access" : "Acceso Centralizado"}
                  </h3>
                  <p className="text-sm text-white/50">
                    {language === "en" ? "All your micro-applications just one click away." : "Todas tus micro-aplicaciones a un solo clic de distancia."}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                <div className="w-12 h-12 shrink-0 rounded-full bg-accent-pink/20 text-accent-pink flex items-center justify-center">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">
                    {language === "en" ? "Total Control" : "Control Total"}
                  </h3>
                  <p className="text-sm text-white/50">
                    {language === "en" ? "Monitor performance, users, and activity in real-time." : "Monitorea el rendimiento, usuarios y actividad en tiempo real."}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                <div className="w-12 h-12 shrink-0 rounded-full bg-accent-blue/20 text-accent-blue flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">
                    {language === "en" ? "Secure Environment" : "Entorno Seguro"}
                  </h3>
                  <p className="text-sm text-white/50">
                    {language === "en" ? "Your information protected with cutting-edge technology." : "Tu información protegida con tecnología de última generación."}
                  </p>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setStep("hidden")}
              className="w-full py-4 rounded-xl bg-linear-to-r from-primary to-accent-blue text-white font-semibold hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(124,58,237,0.4)]"
            >
              {language === "en" ? "Understood, let's go!" : "Entendido, ¡vamos allá!"}
            </button>
          </div>
        )}

      </div>
    </>,
    document.body
  );
}
