"use client";

import { useTranslation } from "@/hooks/useTranslation";
import { LayoutDashboard, X, ChevronsLeft, ChevronsRight, Globe, Loader2 } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import * as LucideIcons from "lucide-react";

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

interface AppLink {
  id: string;
  slug: string;
  name_es: string;
  name_en: string;
  icon: string;
}

export function Sidebar({ collapsed, onToggleCollapse, mobileOpen, onCloseMobile }: SidebarProps) {
  const { language } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const [apps, setApps] = useState<AppLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchApps = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('micro_apps')
        .select('id, slug, name_es, name_en, icon')
        .order('created_at', { ascending: true });
        
      if (!error && data) {
        setApps(data);
      }
      setIsLoading(false);
    };
    
    fetchApps();
  }, [supabase]);

  const title = language === 'en' ? 'Micro Apps' : 'Micro Apps';
  const icons = LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>;
  
  return (
    <>
      {/* Mobile Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/60 z-40 lg:hidden transition-opacity duration-300",
          mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onCloseMobile}
      />

      {/* Sidebar Drawer */}
      <aside
        onClick={(e) => {
          if (e.target === e.currentTarget && pathname === '/settings') {
            router.push('/dashboard');
          }
        }}
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-base-200/80 backdrop-blur-xl border-r border-base-content/5 transition-all duration-300",
          "lg:static lg:h-full lg:z-10 shrink-0",
          collapsed ? "lg:w-16" : "lg:w-64",
          mobileOpen ? "translate-x-0 w-64" : "-translate-x-full lg:translate-x-0",
          pathname === '/settings' ? "cursor-pointer" : ""
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between shrink-0 h-16 px-4 border-b border-base-content/5">
          <div className={cn("flex items-center gap-3 overflow-hidden", collapsed && "lg:justify-center lg:px-0")}>
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0 border border-primary/50 shadow-[0_0_15px_rgba(124,58,237,0.3)]">
              <LayoutDashboard className="w-5 h-5 text-primary" />
            </div>
            <span className={cn(
              "font-bold text-lg bg-linear-to-r from-base-content to-base-content/60 bg-clip-text text-transparent whitespace-nowrap transition-all overflow-hidden",
              collapsed ? "lg:opacity-0 lg:w-0" : "opacity-100 lg:w-auto"
            )}>
              Micro Portal
            </span>
          </div>
          {/* Mobile Close Button */}
          <button 
            onClick={onCloseMobile}
            className="lg:hidden p-2 rounded-lg text-base-content/50 hover:text-base-content hover:bg-base-content/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav 
          className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-3 space-y-6"
          onClick={(e) => {
            if (e.target === e.currentTarget && pathname === '/settings') {
              router.push('/dashboard');
            }
          }}
        >
          <div>
            <h3 className={cn(
              "px-3 text-xs font-semibold text-base-content/40 uppercase tracking-wider mb-2 transition-all whitespace-nowrap overflow-hidden",
              collapsed ? "lg:opacity-0 lg:h-0 lg:mb-0" : "opacity-100"
            )}>
              {title}
            </h3>
            
            {isLoading ? (
              <div className="flex justify-center p-4">
                <Loader2 className="w-5 h-5 animate-spin text-base-content/30" />
              </div>
            ) : (
              <ul className="space-y-1">
                {apps.map((app) => {
                  const href = `/apps/${app.slug}`;
                  const isActive = pathname === href;
                  const label = language === 'en' ? app.name_en : app.name_es;
                  const AppIcon = icons[app.icon] || Globe;
                  
                  return (
                    <li key={app.id}>
                      <Link
                        href={href}
                        onClick={onCloseMobile}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                          isActive
                            ? "bg-primary/10 text-white border border-primary/20" 
                            : "text-base-content/50 hover:text-base-content hover:bg-base-content/5"
                        )}
                        title={label}
                      >
                        <AppIcon className={cn("w-5 h-5 shrink-0", isActive && "text-white")} />
                        <span className={cn(
                          "whitespace-nowrap transition-all font-medium overflow-hidden",
                          collapsed ? "lg:opacity-0 lg:w-0" : "opacity-100 lg:w-auto"
                        )}>
                          {label}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </nav>

        {/* Footer Toggle (Desktop) */}
        <div className="hidden lg:flex shrink-0 p-3 pb-8 border-t border-base-content/5 relative z-50">
          <button
            onClick={onToggleCollapse}
            className="w-full flex items-center justify-center p-2 rounded-lg text-base-content/50 hover:text-base-content hover:bg-base-content/5 transition-colors"
          >
            {collapsed ? <ChevronsRight className="w-5 h-5" /> : <ChevronsLeft className="w-5 h-5" />}
          </button>
        </div>
      </aside>
    </>
  );
}
