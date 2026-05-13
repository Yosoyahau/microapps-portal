"use client";

import { useTranslation } from "@/hooks/useTranslation";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { Users, Activity, TrendingUp, DollarSign, Plus, ArrowRight, ArrowUpRight, ArrowDownRight, Clock } from "lucide-react";

export default function DashboardPage() {
  const { language } = useTranslation();

  const title = language === 'en' ? 'Dashboard Overview' : 'Resumen del Panel';
  const subtitle = language === 'en' ? 'Welcome back! Here is what is happening today.' : '¡Bienvenido de nuevo! Esto es lo que está pasando hoy.';
  
  const statsUsers = language === 'en' ? 'Total Users' : 'Usuarios Totales';
  const statsSessions = language === 'en' ? 'Active Sessions' : 'Sesiones Activas';
  const statsConv = language === 'en' ? 'Conversion Rate' : 'Tasa de Conversión';
  const statsRev = language === 'en' ? 'Total Revenue' : 'Ingresos Totales';

  const chartActivity = language === 'en' ? 'Activity Overview' : 'Resumen de Actividad';

  const quickActions = language === 'en' ? 'Quick Actions' : 'Acciones Rápidas';
  const actionNew = language === 'en' ? 'New Project' : 'Nuevo Proyecto';
  const actionReport = language === 'en' ? 'Generate Report' : 'Generar Reporte';
  const actionInvite = language === 'en' ? 'Invite Team' : 'Invitar Equipo';

  const recentAct = language === 'en' ? 'Recent Activity' : 'Actividad Reciente';
  const viewAll = language === 'en' ? 'View All' : 'Ver Todos';

  // Mock Data
  const stats = [
    { label: statsUsers, value: '24,592', change: '+12.5%', isUp: true, icon: Users, color: 'text-primary' },
    { label: statsSessions, value: '1,432', change: '+5.2%', isUp: true, icon: Activity, color: 'text-accent-pink' },
    { label: statsConv, value: '3.84%', change: '-1.1%', isUp: false, icon: TrendingUp, color: 'text-accent-warm' },
    { label: statsRev, value: '$84,230', change: '+24.5%', isUp: true, icon: DollarSign, color: 'text-accent-blue' },
  ];

  const timeline = [
    { id: 1, user: 'Sarah Jenks', action: language === 'en' ? 'completed a purchase' : 'completó una compra', time: language === 'en' ? '2 mins ago' : 'Hace 2 min', amount: '$120.00' },
    { id: 2, user: 'Mike Ross', action: language === 'en' ? 'signed up' : 'se registró', time: language === 'en' ? '15 mins ago' : 'Hace 15 min' },
    { id: 3, user: 'System', action: language === 'en' ? 'database backup completed' : 'respaldo de base de datos completado', time: language === 'en' ? '1 hour ago' : 'Hace 1 hora' },
    { id: 4, user: 'Anna Lee', action: language === 'en' ? 'upgraded to Pro' : 'mejoró a Pro', time: language === 'en' ? '3 hours ago' : 'Hace 3 horas', amount: '$49.00' },
  ];

  // Static array for chart bars to avoid hydration mismatch
  const barHeights = [40, 70, 45, 90, 65, 85, 100];
  const barLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">{title}</h1>
          <p className="text-white/50 mt-1">{subtitle}</p>
        </div>
        <GlowButton variant="primary" className="py-2.5 px-5">
          <span className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            {actionNew}
          </span>
        </GlowButton>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, i) => (
          <GlassCard key={i} className="p-5 flex flex-col justify-between hover:bg-white/[0.04] transition-colors group">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-2.5 rounded-xl bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-black/20 border border-white/5 ${stat.isUp ? 'text-green-400' : 'text-red-400'}`}>
                {stat.isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.change}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-white/50 mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart Area */}
        <GlassCard className="lg:col-span-2 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-8 shrink-0">
            <h2 className="text-lg font-semibold text-white">{chartActivity}</h2>
            <button className="text-sm text-primary hover:text-primary-focus transition-colors font-medium flex items-center gap-1">
              {viewAll} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          {/* Pure CSS Bar Chart */}
          <div className="h-48 sm:h-64 grid grid-cols-7 gap-2 sm:gap-6 pt-4 pb-8 border-b border-white/10 relative mt-auto">
            {/* Y-axis grid lines (decorative) */}
            <div className="absolute inset-x-0 bottom-1/3 border-t border-white/5 pointer-events-none w-full" />
            <div className="absolute inset-x-0 bottom-2/3 border-t border-white/5 pointer-events-none w-full" />
            
            {barHeights.map((h, i) => (
              <div key={i} className="relative h-full group">
                <div 
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-12 bg-primary/20 hover:bg-primary/40 border border-primary/30 border-b-0 rounded-t-md transition-all duration-300 overflow-hidden"
                  style={{ height: `${h}%` }}
                >
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-primary/40 to-transparent h-full" />
                </div>
                <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-xs text-white/40 group-hover:text-white/70 transition-colors">{barLabels[i]}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        <div className="space-y-6 flex flex-col">
          {/* Quick Actions */}
          <GlassCard className="p-6 shrink-0">
            <h2 className="text-lg font-semibold text-white mb-4">{quickActions}</h2>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all group">
                <span className="text-sm font-medium text-white/80 group-hover:text-white">{actionReport}</span>
                <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
              </button>
              <button className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all group">
                <span className="text-sm font-medium text-white/80 group-hover:text-white">{actionInvite}</span>
                <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
              </button>
            </div>
          </GlassCard>

          {/* Recent Activity */}
          <GlassCard className="p-6 flex-1 flex flex-col min-h-[250px]">
            <h2 className="text-lg font-semibold text-white mb-6 shrink-0">{recentAct}</h2>
            <div className="space-y-5 flex-1">
              {timeline.map((item) => (
                <div key={item.id} className="flex gap-4 relative">
                  {/* Timeline connecting line */}
                  {item.id !== timeline.length && (
                    <div className="absolute left-4 top-10 bottom-[-20px] w-px bg-white/10" />
                  )}
                  
                  <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 z-10 text-white/50">
                    <Clock className="w-4 h-4" />
                  </div>
                  
                  <div className="flex-1 pb-1">
                    <p className="text-sm text-white/80">
                      <span className="font-semibold text-white">{item.user}</span> {item.action}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-white/40">{item.time}</span>
                      {item.amount && (
                        <>
                          <span className="w-1 h-1 rounded-full bg-white/20" />
                          <span className="text-xs font-medium text-accent-warm">{item.amount}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
