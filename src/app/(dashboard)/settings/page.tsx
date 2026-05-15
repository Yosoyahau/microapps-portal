"use client";

import { useSettings, AccentColor } from "@/context/SettingsContext";
import { useTranslation } from "@/hooks/useTranslation";
import { Moon, Sun, Palette, Bell, Focus, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const { language } = useTranslation();
  const { 
    theme, setTheme, 
    accentColor, setAccentColor, 
    focusMode, setFocusMode, 
    notifyPortalChanges, setNotifyPortalChanges 
  } = useSettings();

  const t = {
    title: language === "en" ? "System Settings" : "Configuración del Sistema",
    subtitle: language === "en" ? "Manage your portal preferences and appearance." : "Administra tus preferencias y la apariencia del portal.",
    appearance: language === "en" ? "Appearance" : "Apariencia",
    themeLabel: language === "en" ? "Theme Mode" : "Modo de Tema",
    themeDesc: language === "en" ? "Choose between light and dark mode." : "Elige entre el modo de día y noche.",
    light: language === "en" ? "Light" : "Día",
    dark: language === "en" ? "Dark" : "Noche",
    accentLabel: language === "en" ? "Accent Color" : "Color de Acento",
    accentDesc: language === "en" ? "Customize the glow and primary colors." : "Personaliza el brillo y los colores principales.",
    preferences: language === "en" ? "Preferences" : "Preferencias",
    focusLabel: language === "en" ? "Focus Mode" : "Modo Concentración",
    focusDesc: language === "en" ? "Mute all notifications and messages to work without distractions." : "Silencia todas las notificaciones y avisos para trabajar sin distracciones.",
    notifyLabel: language === "en" ? "Portal Updates" : "Avisos de Cambios",
    notifyDesc: language === "en" ? "Receive alerts about new features in the portal and your apps." : "Recibe alertas sobre nuevas funciones en el portal y tus apps.",
    security: language === "en" ? "Security" : "Seguridad",
    passwordLabel: language === "en" ? "Change Password" : "Cambiar Contraseña",
    passwordDesc: language === "en" ? "Update your account password securely." : "Actualiza la contraseña de tu cuenta de forma segura.",
    comingSoon: language === "en" ? "Coming Soon" : "Próximamente",
  };

  const colors = [
    { id: "purple", name: language === "en" ? "Purple" : "Morado", class: "bg-[#7C3AED]" },
    { id: "pink", name: language === "en" ? "Pink" : "Rosa", class: "bg-[#EC4899]" },
    { id: "blue", name: language === "en" ? "Blue" : "Azul", class: "bg-[#38BDF8]" },
    { id: "orange", name: language === "en" ? "Orange" : "Naranja", class: "bg-[#F97316]" },
  ] as const;

  return (
    <>
      <div 
        className="fixed inset-0 z-0 cursor-pointer"
        onClick={() => window.location.href = '/'}
      />
      <div className="w-full max-w-5xl mx-auto space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10">
        <div>
          <h1 className="text-3xl font-bold text-base-content mb-2">{t.title}</h1>
          <p className="text-base-content/60">{t.subtitle}</p>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Appearance Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-base-content flex items-center gap-2 border-b border-base-content/10 pb-2">
            <Palette className="w-5 h-5 text-primary" />
            {t.appearance}
          </h2>

          {/* Theme Toggle */}
          <div className="p-6 rounded-2xl bg-base-200/50 backdrop-blur-xl border border-base-content/5 shadow-lg">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="font-medium text-base-content">{t.themeLabel}</h3>
                <p className="text-sm text-base-content/50 mt-1">{t.themeDesc}</p>
              </div>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setTheme("light")}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border transition-all",
                  theme === "light" 
                    ? "bg-primary/10 border-primary text-primary" 
                    : "bg-base-100 border-base-content/10 text-base-content/70 hover:border-base-content/20"
                )}
              >
                <Sun className="w-5 h-5" />
                <span className="font-medium">{t.light}</span>
              </button>
              <button
                onClick={() => setTheme("dark")}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border transition-all",
                  theme === "dark" 
                    ? "bg-primary/10 border-primary text-primary" 
                    : "bg-base-100 border-base-content/10 text-base-content/70 hover:border-base-content/20"
                )}
              >
                <Moon className="w-5 h-5" />
                <span className="font-medium">{t.dark}</span>
              </button>
            </div>
          </div>

          {/* Accent Color */}
          <div className="p-6 rounded-2xl bg-base-200/50 backdrop-blur-xl border border-base-content/5 shadow-lg">
            <div>
              <h3 className="font-medium text-base-content">{t.accentLabel}</h3>
              <p className="text-sm text-base-content/50 mt-1 mb-6">{t.accentDesc}</p>
            </div>
            <div className="flex flex-wrap gap-4">
              {colors.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setAccentColor(c.id as AccentColor)}
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center transition-all relative group",
                    accentColor === c.id ? "scale-110 shadow-[0_0_20px_var(--app-primary)]" : "hover:scale-105 opacity-80 hover:opacity-100"
                  )}
                  style={{ backgroundColor: c.class.replace('bg-[', '').replace(']', '') }}
                >
                  {accentColor === c.id && (
                    <div className="w-5 h-5 rounded-full bg-white shadow-sm" />
                  )}
                  {/* Tooltip */}
                  <span className="absolute -bottom-8 opacity-0 group-hover:opacity-100 text-xs font-medium text-base-content transition-opacity whitespace-nowrap">
                    {c.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Preferences Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-base-content flex items-center gap-2 border-b border-base-content/10 pb-2">
            <Focus className="w-5 h-5 text-primary" />
            {t.preferences}
          </h2>

          {/* Focus Mode Toggle */}
          <div className="p-6 rounded-2xl bg-base-200/50 backdrop-blur-xl border border-base-content/5 shadow-lg flex items-center justify-between gap-4 cursor-pointer hover:bg-base-200/70 transition-colors"
               onClick={() => setFocusMode(!focusMode)}>
            <div>
              <h3 className="font-medium text-base-content">{t.focusLabel}</h3>
              <p className="text-sm text-base-content/50 mt-1">{t.focusDesc}</p>
            </div>
            <div className={cn(
              "w-14 h-7 shrink-0 rounded-full transition-colors relative flex items-center px-1",
              focusMode ? "bg-primary" : "bg-base-content/20"
            )}>
              <div className={cn(
                "w-5 h-5 bg-white rounded-full transition-transform",
                focusMode ? "translate-x-7" : "translate-x-0"
              )} />
            </div>
          </div>

          {/* Notifications Toggle */}
          <div className="p-6 rounded-2xl bg-base-200/50 backdrop-blur-xl border border-base-content/5 shadow-lg flex items-center justify-between gap-4 cursor-pointer hover:bg-base-200/70 transition-colors"
               onClick={() => setNotifyPortalChanges(!notifyPortalChanges)}>
            <div>
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-base-content/70" />
                <h3 className="font-medium text-base-content">{t.notifyLabel}</h3>
              </div>
              <p className="text-sm text-base-content/50 mt-1">{t.notifyDesc}</p>
            </div>
            <div className={cn(
              "w-14 h-7 shrink-0 rounded-full transition-colors relative flex items-center px-1",
              notifyPortalChanges ? "bg-primary" : "bg-base-content/20"
            )}>
              <div className={cn(
                "w-5 h-5 bg-white rounded-full transition-transform",
                notifyPortalChanges ? "translate-x-7" : "translate-x-0"
              )} />
            </div>
          </div>

          {/* Security Placeholder */}
          <h2 className="text-xl font-semibold text-base-content flex items-center gap-2 border-b border-base-content/10 pb-2 mt-8">
            <ShieldCheck className="w-5 h-5 text-primary" />
            {t.security}
          </h2>

          <div className="p-6 rounded-2xl bg-base-200/30 backdrop-blur-xl border border-base-content/5 shadow-lg flex items-center justify-between gap-4 opacity-70">
            <div>
              <h3 className="font-medium text-base-content">{t.passwordLabel}</h3>
              <p className="text-sm text-base-content/50 mt-1">{t.passwordDesc}</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-base-content/10 text-xs font-semibold text-base-content/60 uppercase tracking-wider">
              {t.comingSoon}
            </span>
          </div>

        </div>

      </div>
    </div>
    </>
  );
}
