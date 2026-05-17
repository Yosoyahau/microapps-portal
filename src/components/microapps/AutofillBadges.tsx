"use client";

import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';

export interface AutofillPreset {
  id?: string;
  label_es: string;
  label_en: string;
  values: Record<string, string>;
}

interface AutofillBadgesProps {
  presets: AutofillPreset[];
  onSelect: (values: Record<string, string>) => void;
}

export function AutofillBadges({ presets, onSelect }: AutofillBadgesProps) {
  const { language } = useTranslation();

  if (!presets || presets.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {presets.map((preset, idx) => {
        const id = preset.id || `preset-${idx}`;
        const label = language === 'en' ? preset.label_en : preset.label_es;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onSelect(preset.values)}
            className="px-3 py-1.5 text-xs font-medium rounded-full bg-white/5 text-white/70 border border-white/10 hover:bg-white/10 hover:text-white transition-all active:scale-95 cursor-pointer"
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
