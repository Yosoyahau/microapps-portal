"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/ui/ToastProvider';
import { DynamicForm, FormFieldSchema } from './DynamicForm';
import { AutofillBadges, AutofillPreset } from './AutofillBadges';
import { AppWorkspace } from './AppWorkspace';
import { AppHistory } from './AppHistory';
import * as LucideIcons from 'lucide-react';
import Link from 'next/link';
import { GlowButton } from '@/components/ui/GlowButton';

interface MicroApp {
  id: string;
  slug: string;
  name_es: string;
  name_en: string;
  description_es: string;
  description_en: string;
  icon: string;
  form_schema: FormFieldSchema[];
  autofill_presets: AutofillPreset[];
}

interface MicroAppRunnerProps {
  appSlug: string;
}

export function MicroAppRunner({ appSlug }: MicroAppRunnerProps) {
  const { language } = useTranslation();
  const { toast } = useToast();
  const [app, setApp] = useState<MicroApp | null>(null);
  const [isLoadingApp, setIsLoadingApp] = useState(true);
  const [activeTab, setActiveTab] = useState<'form' | 'history'>('form');
  const [currentExecutionId, setCurrentExecutionId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formInitialValues, setFormInitialValues] = useState<Record<string, string>>({});
  const [isExpired, setIsExpired] = useState(false);
  
  const workspaceRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    // Reset workspace state when changing app
    setCurrentExecutionId(null);
    setActiveTab('form');
    setFormInitialValues({});

    const fetchApp = async () => {
      setIsLoadingApp(true);
      const { data, error } = await supabase
        .from('micro_apps')
        .select('*')
        .eq('slug', appSlug)
        .single();
        
      if (data) {
        setApp(data as MicroApp);
      } else if (error) {
        toast({ 
          title: language === 'en' ? 'Error loading app' : 'Error al cargar la app', 
          type: 'error' 
        });
      }

      // Check subscription status
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('users')
          .select('subscription_tier, trial_ends_at')
          .eq('id', user.id)
          .single();

        if (profile && profile.subscription_tier === 'free' && new Date(profile.trial_ends_at) < new Date()) {
          setIsExpired(true);
        }
      }

      setIsLoadingApp(false);
    };
    fetchApp();
  }, [appSlug, supabase, language, toast]);

  const handleGenerate = async (values: Record<string, string>) => {
    if (!app) return;
    setIsSubmitting(true);
    
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appSlug, inputs: values })
      });
      
      const data = await res.json();
      if (res.ok && data.executionId) {
        setCurrentExecutionId(data.executionId);
        setActiveTab('history'); // Optional: Move to history tab or keep on form
        if (window.innerWidth < 768 && workspaceRef.current) {
          workspaceRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        console.error('Failed to generate:', data.error);
        toast({ 
          title: data.error || (language === 'en' ? 'Failed to generate' : 'Fallo al generar'), 
          type: 'error' 
        });
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      toast({ 
        title: language === 'en' ? 'Connection error' : 'Error de conexión', 
        type: 'error' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectHistory = (executionId: string) => {
    setCurrentExecutionId(executionId);
    if (window.innerWidth < 768 && workspaceRef.current) {
      workspaceRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (isLoadingApp) {
    return (
      <div className="flex h-full items-center justify-center">
        <LucideIcons.Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!app) {
    return (
      <div className="flex h-full items-center justify-center text-white/50">
        {language === 'en' ? 'App not found' : 'App no encontrada'}
      </div>
    );
  }

  const icons = LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>;
  const IconComponent = icons[app.icon] || icons['Sparkles'];

  return (
    <div className="flex flex-col md:flex-row h-full w-full gap-4 md:gap-6 lg:gap-8 overflow-y-auto md:overflow-hidden p-6 pb-4">
      {/* Left Column */}
      <div className="w-full md:w-[30%] md:max-w-[320px] h-auto md:h-full flex flex-col shrink-0 gap-4">
        {/* App Header */}
        <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl shrink-0">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0 border border-primary/50 text-primary">
            <IconComponent className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">
              {language === 'en' ? app.name_en : app.name_es}
            </h2>
            <p className="text-xs text-white/50 line-clamp-2">
              {language === 'en' ? app.description_en : app.description_es}
            </p>
          </div>
        </div>

        {/* Tabs container */}
        <div className="flex flex-col flex-1 bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          {/* Tabs header */}
          <div className="flex border-b border-white/10 shrink-0">
            <button
              onClick={() => setActiveTab('form')}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                activeTab === 'form' ? 'text-primary border-b-2 border-primary bg-white/5' : 'text-white/50 hover:text-white/80'
              }`}
            >
              {language === 'en' ? 'Form' : 'Formulario'}
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                activeTab === 'history' ? 'text-primary border-b-2 border-primary bg-white/5' : 'text-white/50 hover:text-white/80'
              }`}
            >
              {language === 'en' ? 'History' : 'Historial'}
            </button>
          </div>

          {/* Tabs content */}
          <div className="flex-1 overflow-y-auto p-5">
            {activeTab === 'form' ? (
              <>
                <div className="relative">
                  <AutofillBadges 
                    presets={app.autofill_presets} 
                    onSelect={(values) => {
                      setFormInitialValues(values);
                    }} 
                  />
                  <div className={isExpired ? "opacity-50 pointer-events-none" : ""}>
                    <DynamicForm 
                      schema={app.form_schema} 
                      onSubmit={handleGenerate} 
                      isLoading={isSubmitting}
                      initialValues={formInitialValues}
                    />
                  </div>
                  
                  {isExpired && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-base-100/80 backdrop-blur-sm rounded-xl p-6 text-center border border-accent-pink/30 shadow-[0_0_30px_rgba(236,72,153,0.1)]">
                      <LucideIcons.AlertCircle className="w-10 h-10 text-accent-pink mb-3" />
                      <h3 className="text-lg font-bold text-white mb-2">
                        {language === 'en' ? 'Trial Expired' : 'Periodo de prueba finalizado'}
                      </h3>
                      <p className="text-sm text-white/70 mb-5">
                        {language === 'en' ? 'Your 7-day free trial has ended. Please upgrade your plan to continue using the AI tools.' : 'Tus 7 días de prueba han terminado. Por favor, mejora tu plan para seguir usando las herramientas de IA.'}
                      </p>
                      <Link href="/">
                        <GlowButton variant="primary" className="py-2 px-6">
                          {language === 'en' ? 'View Plans' : 'Ver Planes'}
                        </GlowButton>
                      </Link>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <AppHistory appId={app.id} onSelect={handleSelectHistory} />
            )}
          </div>
        </div>
      </div>

      {/* Right Column (Workspace) */}
      <div 
        ref={workspaceRef}
        className="flex flex-col flex-1 h-auto md:h-full md:overflow-hidden relative min-h-100 md:min-h-0 shrink-0 mb-10 md:mb-0"
      >
        <AppWorkspace 
          appId={app.id} 
          currentExecutionId={currentExecutionId} 
          schema={app.form_schema} 
        />
      </div>
    </div>
  );
}
