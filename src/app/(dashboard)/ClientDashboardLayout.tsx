"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { WelcomeConfetti } from "@/components/ui/WelcomeConfetti";

export function ClientDashboardLayout({
  children,
  showWelcome,
}: {
  children: React.ReactNode;
  showWelcome: boolean;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="fixed inset-0 w-full h-dvh flex overflow-hidden z-0 bg-base-100 text-base-content">
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />
      <div className="flex-1 flex flex-col h-full overflow-hidden relative min-w-0 z-10">
        <Header onToggleMobileSidebar={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto w-full p-4 sm:p-6 lg:p-8 relative">
          {/* Ambient Orbs */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
            {/* Top-left purple->pink->orange */}
            <div 
              className="absolute -top-40 -left-72 w-[900px] h-[900px] rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(124, 58, 237, 0.25) 0%, rgba(236, 72, 153, 0.14) 25%, rgba(249, 115, 22, 0.07) 50%, rgba(0,0,0,0) 75%)',
                filter: 'blur(80px)'
              }}
            />
            {/* Top-right pink */}
            <div 
              className="absolute -top-16 -right-10 w-[420px] h-[420px] rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(236, 72, 153, 0.18) 0%, rgba(236, 72, 153, 0.05) 45%, rgba(0,0,0,0) 70%)',
                filter: 'blur(40px)'
              }}
            />
            {/* Bottom-right blue */}
            <div 
              className="absolute -bottom-28 -right-20 w-[550px] h-[550px] rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(56, 189, 248, 0.2) 0%, rgba(56, 189, 248, 0.06) 40%, rgba(0,0,0,0) 70%)',
                filter: 'blur(40px)'
              }}
            />
          </div>
          
          <div className="relative z-10">
            {children}
          </div>
        </main>
      </div>
      <WelcomeConfetti initialShow={showWelcome} />
    </div>
  );
}
