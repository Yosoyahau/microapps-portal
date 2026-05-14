"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { createClient } from "@/lib/supabase/client";
import { Menu, Bell, Search, User, Settings, LogOut, ChevronDown } from "lucide-react";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { ProfileModal } from "@/components/profile/ProfileModal";
import { cn } from "@/lib/utils";

interface HeaderProps {
  onToggleMobileSidebar: () => void;
}

export function Header({ onToggleMobileSidebar }: HeaderProps) {
  const { language } = useTranslation();
  const supabase = createClient();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [userInitials, setUserInitials] = useState<string>("U");
  const [userName, setUserName] = useState<string>("User");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  useEffect(() => {
    async function getUser() {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (currentUser) {
        setUser(currentUser);
        const first = currentUser.user_metadata?.first_name || "";
        const last = currentUser.user_metadata?.last_name || "";
        setUserName(first ? `${first} ${last}`.trim() : currentUser.email || "User");
        
        let url = currentUser.user_metadata?.avatar_url || null;
        
        if (first && last) {
          setUserInitials(`${first[0]}${last[0]}`.toUpperCase());
        } else if (currentUser.email) {
          setUserInitials(currentUser.email[0].toUpperCase());
        }

        if (url) {
          setAvatarUrl(url);
        } else if (currentUser.email) {
          // Attempt to load Gravatar
          try {
            const msgBuffer = new TextEncoder().encode(currentUser.email.trim().toLowerCase());
            const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            
            const gravatarUrl = `https://www.gravatar.com/avatar/${hashHex}?d=404`;
            
            // Check if user has a Gravatar
            const img = new window.Image();
            img.onload = () => setAvatarUrl(gravatarUrl);
            img.onerror = () => setAvatarUrl(null); // Fallback to initials
            img.src = gravatarUrl;
          } catch (e) {
            console.error("Gravatar error:", e);
            setAvatarUrl(null);
          }
        } else {
          setAvatarUrl(null);
        }
      }
    }
    getUser();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  const searchPlaceholder = language === 'en' ? 'Search...' : 'Buscar...';
  const profileLabel = language === 'en' ? 'Profile' : 'Perfil';
  const settingsLabel = language === 'en' ? 'Settings' : 'Configuración';
  const logoutLabel = language === 'en' ? 'Logout' : 'Cerrar Sesión';
  const notificationsLabel = language === 'en' ? 'Notifications' : 'Notificaciones';
  const viewAll = language === 'en' ? 'View All' : 'Ver Todas';
  const newLogin = language === 'en' ? 'New login detected from Safari.' : 'Nuevo inicio de sesión detectado desde Safari.';

  return (
    <header className="shrink-0 h-16 relative z-30 flex items-center justify-between px-4 sm:px-6 lg:px-8 border-b border-white/5 bg-base-200/50 backdrop-blur-xl">
      <div className="flex items-center gap-4 flex-1">
        <button 
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 -ml-2 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        <div className="hidden sm:block max-w-md w-full relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-primary transition-colors" />
          <input 
            type="text"
            placeholder={searchPlaceholder}
            className="w-full bg-black/20 border border-white/10 rounded-full py-2 pl-10 pr-12 text-sm text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-white/30"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <kbd className="hidden lg:inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-medium text-white/40 bg-white/5 border border-white/10 rounded">⌘</kbd>
            <kbd className="hidden lg:inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-medium text-white/40 bg-white/5 border border-white/10 rounded">K</kbd>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        <LanguageSwitcher />

        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2 rounded-full text-white/70 hover:text-white hover:bg-white/5 transition-colors focus:outline-none"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent-pink shadow-[0_0_8px_rgba(236,72,153,0.8)] border border-base-200"></span>
          </button>

          {notificationsOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setNotificationsOpen(false)} />
              <div className="absolute right-0 mt-2 w-80 rounded-xl bg-base-200 border border-white/10 shadow-2xl z-50 overflow-hidden flex flex-col">
                <div className="p-4 border-b border-white/5 flex items-center justify-between">
                  <h3 className="font-semibold text-white">{notificationsLabel}</h3>
                  <span className="text-xs bg-accent-pink/20 text-accent-pink px-2 py-0.5 rounded-full font-medium">1</span>
                </div>
                <div className="p-2 flex-1 max-h-80 overflow-y-auto">
                  <div className="p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm text-white/90 leading-tight">{newLogin}</p>
                      <span className="text-xs text-white/40 mt-1 block">2 min</span>
                    </div>
                  </div>
                </div>
                <div className="p-3 border-t border-white/5 text-center">
                  <button className="text-sm text-primary hover:text-primary transition-colors font-medium">
                    {viewAll}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full hover:bg-white/5 transition-colors focus:outline-none border border-transparent hover:border-white/10"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent-blue flex items-center justify-center text-sm font-bold text-white shadow-lg overflow-hidden border border-white/10">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                userInitials
              )}
            </div>
            <ChevronDown className="w-4 h-4 text-white/50" />
          </button>

          {dropdownOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
              <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#0A0520] border border-white/20 shadow-2xl z-50 overflow-hidden flex flex-col p-1">
                <div className="px-3 py-3 border-b border-white/10 mb-1">
                  <p className="text-sm font-medium text-white truncate">{userName}</p>
                </div>
                <button 
                  onClick={() => {
                    setDropdownOpen(false);
                    setProfileModalOpen(true);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span>{profileLabel}</span>
                </button>
                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                  <Settings className="w-4 h-4" />
                  <span>{settingsLabel}</span>
                </button>
                <div className="h-px bg-white/10 my-1 mx-2" />
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-accent-warm hover:bg-accent-warm/10 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{logoutLabel}</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <ProfileModal 
        isOpen={profileModalOpen} 
        onClose={() => setProfileModalOpen(false)} 
        user={user} 
        onUpdate={(url) => setAvatarUrl(url)}
        currentAvatarUrl={avatarUrl}
      />
    </header>
  );
}
