"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/ui/ToastProvider';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Check, X, Copy, CheckCircle2, Loader2 } from 'lucide-react';
import { FormFieldSchema } from './DynamicForm';

interface AppExecution {
  id: string;
  inputs: Record<string, string>;
  status: 'pending' | 'processing' | 'completed' | 'error';
  result?: { markdown: string };
  error_message?: string;
}

interface AppWorkspaceProps {
  appId: string;
  currentExecutionId: string | null;
  schema: FormFieldSchema[];
}

export function AppWorkspace({ appId: _appId, currentExecutionId, schema }: AppWorkspaceProps) {
  void _appId; // Unused but reserved
  const { language } = useTranslation();
  const { toast } = useToast();
  const [execution, setExecution] = useState<AppExecution | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const supabase = createClient();

  useEffect(() => {
    if (!currentExecutionId) {
      queueMicrotask(() => setExecution(null));
      return;
    }

    setIsLoading(true);

    // Initial fetch
    const fetchExecution = async () => {
      const { data } = await supabase
        .from('app_executions')
        .select('*')
        .eq('id', currentExecutionId)
        .single();
      
      if (data) {
        setExecution(data as AppExecution);
      }
      setIsLoading(false);
    };

    fetchExecution();

    // Realtime subscription
    const channel = supabase
      .channel(`app_execution_${currentExecutionId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'app_executions',
        filter: `id=eq.${currentExecutionId}`
      }, (payload) => {
        setExecution(payload.new as AppExecution);
      })
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [currentExecutionId, supabase]);

  const handleCopy = async (type: 'text' | 'markdown' | 'html') => {
    if (!execution?.result?.markdown || !resultRef.current) return;
    
    let contentToCopy = '';
    
    if (type === 'markdown') {
      contentToCopy = execution.result.markdown;
    } else if (type === 'text') {
      contentToCopy = resultRef.current.innerText;
    } else if (type === 'html') {
      contentToCopy = resultRef.current.innerHTML;
    }

    try {
      await navigator.clipboard.writeText(contentToCopy);
      setCopiedType(type);
      toast({ 
        title: language === 'en' ? 'Copied to clipboard' : 'Copiado al portapapeles', 
        type: 'success' 
      });
      setTimeout(() => setCopiedType(null), 2000);
    } catch (err) {
      console.error('Failed to copy text', err);
      toast({ 
        title: language === 'en' ? 'Failed to copy' : 'Error al copiar', 
        type: 'error' 
      });
    }
  };

  const getTranslatedLabel = (key: string) => {
    if (key === 'responseLanguage') {
      return language === 'en' ? 'Response Language' : 'Idioma de Respuesta';
    }
    const field = schema.find(f => f.id === key || f.name === key);
    if (!field) return key;
    return language === 'en' ? field.label_en : field.label_es;
  };

  const renderValue = (value: string) => {
    if (value === 'true') return <Check className="w-5 h-5 text-green-500" />;
    if (value === 'false') return <X className="w-5 h-5 text-red-500" />;
    return <span className="text-white/80">{value}</span>;
  };

  if (!currentExecutionId) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-white/5 border border-white/10 rounded-2xl h-full min-h-100">
        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/10">
          <Loader2 className="w-8 h-8 text-white/30" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">
          {language === 'en' ? 'Ready and waiting...' : 'Listo y esperando...'}
        </h3>
        <p className="text-white/50 max-w-sm">
          {language === 'en' 
            ? 'Fill out the form on the left and click Generate to see the magic happen.' 
            : 'Llena el formulario a la izquierda y haz clic en Generar para ver la magia suceder.'}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 h-full p-0">
      {/* Top Block: The Petition */}
      {execution?.inputs && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shrink-0 relative">
          <h4 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-4">
            {language === 'en' ? 'Your Petition' : 'Tu Petición'}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(execution.inputs).map(([key, value]) => (
              <div key={key} className="flex flex-col gap-1">
                <span className="text-xs text-white/50">{getTranslatedLabel(key)}</span>
                <div className="flex items-center gap-2">
                  {renderValue(value)}
                </div>
              </div>
            ))}
          </div>

          {/* Copy Buttons */}
          {execution?.status === 'completed' && (
            <div className="absolute top-6 right-6 flex gap-2">
              <button
                onClick={() => handleCopy('text')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-medium text-white/70 transition-colors"
              >
                {copiedType === 'text' ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                {language === 'en' ? 'Text' : 'Texto'}
              </button>
              <button
                onClick={() => handleCopy('markdown')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-medium text-white/70 transition-colors"
              >
                {copiedType === 'markdown' ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                Markdown
              </button>
              <button
                onClick={() => handleCopy('html')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-medium text-white/70 transition-colors"
              >
                {copiedType === 'html' ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                HTML
              </button>
            </div>
          )}
        </div>
      )}

      {/* Bottom Block: The Response */}
      <div className="flex-1 flex flex-col min-h-75">
        {isLoading || execution?.status === 'pending' || execution?.status === 'processing' ? (
          <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-12 overflow-hidden relative flex flex-col items-center justify-center">
            {/* Ambient glow */}
            <div className="absolute inset-0 bg-linear-to-b from-primary/10 to-transparent opacity-50" />
            
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-6 relative z-10" />
            
            <div className="px-6 py-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-md mb-12 relative z-10">
              <span className="text-sm font-medium text-white/80">
                {language === 'en' ? 'Generating your content...' : 'Generando tu contenido...'}
              </span>
            </div>

            {/* Skeleton lines */}
            <div className="w-full max-w-2xl space-y-4 relative z-10 opacity-30">
              <div className="h-4 bg-white/20 rounded-full w-3/4 animate-pulse" />
              <div className="h-4 bg-white/20 rounded-full w-full animate-pulse delay-75" />
              <div className="h-4 bg-white/20 rounded-full w-5/6 animate-pulse delay-150" />
              <div className="h-4 bg-white/20 rounded-full w-full animate-pulse delay-200" />
              <div className="h-4 bg-white/20 rounded-full w-2/3 animate-pulse delay-300" />
            </div>
          </div>
        ) : execution?.status === 'error' ? (
          <div className="flex-1 bg-red-500/10 border border-red-500/20 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
            <X className="w-12 h-12 text-red-400 mb-4" />
            <h3 className="text-xl font-semibold text-red-400 mb-2">
              {language === 'en' ? 'Error generating content' : 'Error al generar contenido'}
            </h3>
            <p className="text-red-400/70 max-w-md">
              {execution.error_message || (language === 'en' ? 'An unknown error occurred.' : 'Ocurrió un error desconocido.')}
            </p>
          </div>
        ) : execution?.status === 'completed' && execution.result ? (
          <div className="flex-1 bg-white rounded-2xl p-8 lg:p-12 shadow-2xl overflow-y-auto">
            <div className="prose prose-base sm:prose-lg max-w-none text-gray-800" ref={resultRef}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {execution.result.markdown}
              </ReactMarkdown>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
