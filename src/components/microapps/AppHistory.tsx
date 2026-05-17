"use client";

import React, { useEffect, useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { createClient } from '@/lib/supabase/client';
import { History, Loader2, AlertCircle, Trash2 } from 'lucide-react';

interface AppHistoryProps {
  appId: string;
  onSelect: (executionId: string) => void;
}

export function AppHistory({ appId, onSelect }: AppHistoryProps) {
  const { language } = useTranslation();
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    if (!appId) return;

    const fetchHistory = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error: fetchError } = await supabase
          .from('app_executions')
          .select('*')
          .eq('app_id', appId)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;
        setHistory(data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();

    const channel = supabase.channel(`history_${appId}`)
      .on('postgres_changes', {
        event: '*', 
        schema: 'public',
        table: 'app_executions',
        filter: `app_id=eq.${appId}`
      }, () => {
        // Refetch silently on any insert/update
        fetchHistory();
      })
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [appId, supabase]);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm(language === 'en' ? 'Are you sure you want to delete this record?' : '¿Seguro que quieres eliminar este registro?')) return;
    
    // Optimistic delete
    setHistory(prev => prev.filter(h => h.id !== id));
    
    // Database delete
    const { error: deleteError } = await supabase
      .from('app_executions')
      .delete()
      .eq('id', id);
      
    if (deleteError) {
      console.error('Error deleting:', deleteError);
      // Supabase realtime will fetch the actual state if needed, or we could refetch here
    }
  };

  const extractMainQuery = (inputs: Record<string, string>) => {
    // Intelligent extraction
    if (inputs.topic) return inputs.topic;
    if (inputs.query) return inputs.query;
    if (inputs.title) return inputs.title;
    
    // Find longest string
    let longest = '';
    for (const val of Object.values(inputs)) {
      if (typeof val === 'string' && val.length > longest.length && val !== 'true' && val !== 'false') {
        longest = val;
      }
    }
    return longest || (language === 'en' ? 'No details provided' : 'Sin detalles proporcionados');
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-white/50">
        <Loader2 className="w-8 h-8 animate-spin mb-4" />
        <p>{language === 'en' ? 'Loading history...' : 'Cargando historial...'}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-red-400">
        <AlertCircle className="w-8 h-8 mb-4" />
        <p className="text-center">{error}</p>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-white/50 text-center">
        <History className="w-12 h-12 mb-4 opacity-20" />
        <p>{language === 'en' ? 'No history yet.' : 'Aún no hay historial.'}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {history.map((exec) => {
        const mainQuery = extractMainQuery(exec.inputs);
        const dateObj = new Date(exec.created_at);
        const rtf = new Intl.RelativeTimeFormat(language === 'en' ? 'en' : 'es', { numeric: 'auto' });
        const daysDifference = Math.round((dateObj.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        
        let dateStr = '';
        if (Math.abs(daysDifference) < 1) {
          const hoursDiff = Math.round((dateObj.getTime() - new Date().getTime()) / (1000 * 60 * 60));
          if (Math.abs(hoursDiff) < 1) {
            const minDiff = Math.round((dateObj.getTime() - new Date().getTime()) / (1000 * 60));
            dateStr = rtf.format(minDiff, 'minute');
          } else {
            dateStr = rtf.format(hoursDiff, 'hour');
          }
        } else {
          dateStr = rtf.format(daysDifference, 'day');
        }

        return (
          <button
            key={exec.id}
            onClick={() => onSelect(exec.id)}
            className="flex flex-col text-left p-4 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors rounded-xl gap-2 group relative"
          >
            <div className="flex items-center justify-between w-full pr-8">
              <span className="text-xs text-white/40">{dateStr}</span>
              <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                exec.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                exec.status === 'error' ? 'bg-red-500/20 text-red-400' :
                'bg-primary/20 text-primary-300'
              }`}>
                {exec.status}
              </span>
            </div>
            
            <button
              onClick={(e) => handleDelete(e, exec.id)}
              className="absolute top-3 right-3 p-1.5 text-white/20 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-colors opacity-0 group-hover:opacity-100"
              title={language === 'en' ? 'Delete' : 'Eliminar'}
            >
              <Trash2 className="w-4 h-4" />
            </button>
            
            <p 
              className="text-sm text-white/90 line-clamp-2 leading-relaxed mt-1"
              title={mainQuery}
            >
              {mainQuery}
            </p>
          </button>
        );
      })}
    </div>
  );
}
