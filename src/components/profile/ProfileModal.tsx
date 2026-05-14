"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { User } from "@supabase/supabase-js";
import { X, Loader2, Camera } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/ToastProvider";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onUpdate: (url: string) => void;
  currentAvatarUrl?: string | null;
}

export function ProfileModal({ isOpen, onClose, user, onUpdate, currentAvatarUrl }: ProfileModalProps) {
  const { language } = useTranslation();
  const { toast } = useToast();
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(false);
  const [localAvatar, setLocalAvatar] = useState<string | null>(null);

  // Sync local preview with user data
  useEffect(() => {
    if (user?.user_metadata?.avatar_url) {
      setLocalAvatar(user.user_metadata.avatar_url);
    }
  }, [user]);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!isOpen || !user || !mounted) return null;

  const currentAvatar = localAvatar || currentAvatarUrl || user.user_metadata?.avatar_url;
  const firstName = user.user_metadata?.first_name || "";
  const lastName = user.user_metadata?.last_name || "";
  const initials = firstName && lastName ? `${firstName[0]}${lastName[0]}` : "U";

  const t = {
    title: language === "en" ? "Profile Settings" : "Perfil",
    upload: language === "en" ? "Upload Photo" : "Subir Foto",
    success: language === "en" ? "Profile updated successfully!" : "¡Perfil actualizado con éxito!",
    error: language === "en" ? "Error updating profile." : "Error al actualizar el perfil.",
    size: language === "en" ? "Image must be less than 2MB." : "La imagen debe pesar menos de 2MB."
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast({ title: t.size, type: "error" });
      return;
    }

    setLoading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      // Upload image
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update auth user metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
      });

      if (updateError) throw updateError;

      setLocalAvatar(publicUrl);
      onUpdate(publicUrl);
      toast({ title: t.success, type: "success" });
    } catch (error: any) {
      toast({ title: t.error, type: "error" });
      console.error("Avatar upload error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <>
      <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] w-full max-w-md p-6 rounded-2xl bg-base-200 border border-white/10 shadow-2xl">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-semibold text-white">{t.title}</h2>
          <button onClick={onClose} className="p-2 -mr-2 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col items-center">
          <div className="relative group mb-8">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent-blue flex items-center justify-center text-3xl font-bold text-white shadow-xl overflow-hidden border-2 border-white/10">
              {currentAvatar ? (
                <img src={currentAvatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                initials
              )}
            </div>
            
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="w-6 h-6 text-white animate-spin" /> : <Camera className="w-6 h-6 text-white" />}
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />
          </div>

          <div className="w-full space-y-3">
            <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-1">
              <span className="text-xs text-white/50 uppercase tracking-wider font-medium">Nombre</span>
              <span className="text-white font-medium">{firstName} {lastName}</span>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-1">
              <span className="text-xs text-white/50 uppercase tracking-wider font-medium">Email</span>
              <span className="text-white font-medium">{user.email}</span>
            </div>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}
