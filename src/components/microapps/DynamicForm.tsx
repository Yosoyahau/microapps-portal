"use client";

import React, { useEffect, useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';

export interface FormFieldSchema {
  id?: string;
  name?: string;
  type: 'text' | 'textarea' | 'select' | 'toggle';
  label_es: string;
  label_en: string;
  placeholder_es?: string;
  placeholder_en?: string;
  options_es?: string[];
  options_en?: string[];
  required?: boolean;
}

interface DynamicFormProps {
  schema: FormFieldSchema[];
  initialValues?: Record<string, string>;
  onSubmit: (values: Record<string, string>) => void;
  isLoading: boolean;
}

export function DynamicForm({ schema, initialValues = {}, onSubmit, isLoading }: DynamicFormProps) {
  const { language } = useTranslation();
  const [values, setValues] = useState<Record<string, string>>({ responseLanguage: 'es' });

  // Handle autofill overwrite bug
  useEffect(() => {
    if (Object.keys(initialValues).length > 0) {
      setValues(prev => ({ ...prev, ...initialValues }));
    }
  }, [initialValues]);

  const handleChange = (key: string, value: string) => {
    setValues(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {schema.map((field) => {
        const key = field.id || field.name;
        if (!key) return null;
        
        const label = language === 'en' ? field.label_en : field.label_es;
        const placeholder = language === 'en' ? field.placeholder_en : field.placeholder_es;
        const value = values[key] || '';

        return (
          <div key={key} className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-white/90">{label}</label>
            
            {field.type === 'textarea' ? (
              <textarea
                value={value}
                onChange={(e) => handleChange(key, e.target.value)}
                placeholder={placeholder}
                required={field.required}
                className="w-full min-h-30 bg-white/5 border border-white/10 text-white placeholder-white/30 rounded-xl p-3 focus:outline-none focus:border-primary transition-colors resize-y"
              />
            ) : field.type === 'select' ? (
              <select
                value={value}
                onChange={(e) => handleChange(key, e.target.value)}
                required={field.required}
                className="w-full bg-[#1A1525] border border-white/10 text-white rounded-xl p-3 focus:outline-none focus:border-primary transition-colors appearance-none"
              >
                <option value="" disabled className="text-white/30">
                  {placeholder || (language === 'en' ? 'Select an option' : 'Selecciona una opción')}
                </option>
                {field.options_es?.map((opt, i) => (
                  <option key={opt} value={opt}>
                    {language === 'en' ? field.options_en?.[i] || opt : opt}
                  </option>
                ))}
              </select>
            ) : field.type === 'toggle' ? (
              <button
                type="button"
                onClick={() => handleChange(key, value === 'true' ? 'false' : 'true')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-base-100 ${
                  value === 'true' ? 'bg-primary' : 'bg-white/10'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    value === 'true' ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            ) : (
              <input
                type="text"
                value={value}
                onChange={(e) => handleChange(key, e.target.value)}
                placeholder={placeholder}
                required={field.required}
                className="w-full bg-white/5 border border-white/10 text-white placeholder-white/30 rounded-xl p-3 focus:outline-none focus:border-primary transition-colors"
              />
            )}
          </div>
        );
      })}

      {/* Response Language Radio Group */}
      <div className="flex flex-col gap-1.5 mt-2">
        <label className="text-sm font-medium text-white/90">
          {language === 'en' ? 'Response Language' : 'Idioma de Respuesta'}
        </label>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => handleChange('responseLanguage', 'es')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
              values.responseLanguage === 'es' || !values.responseLanguage
                ? 'bg-primary/20 border-primary text-white'
                : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white/80'
            }`}
          >
            <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${
              values.responseLanguage === 'es' || !values.responseLanguage ? 'border-primary' : 'border-white/30'
            }`}>
              {(values.responseLanguage === 'es' || !values.responseLanguage) && <span className="w-2 h-2 bg-primary rounded-full" />}
            </span>
            Español
          </button>
          <button
            type="button"
            onClick={() => handleChange('responseLanguage', 'en')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
              values.responseLanguage === 'en'
                ? 'bg-primary/20 border-primary text-white'
                : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white/80'
            }`}
          >
            <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${
              values.responseLanguage === 'en' ? 'border-primary' : 'border-white/30'
            }`}>
              {values.responseLanguage === 'en' && <span className="w-2 h-2 bg-primary rounded-full" />}
            </span>
            English
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="mt-4 w-full bg-linear-to-r from-primary to-accent-pink text-white font-medium py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {isLoading 
          ? (language === 'en' ? 'Generating...' : 'Generando...') 
          : (language === 'en' ? 'Generate' : 'Generar')}
      </button>
    </form>
  );
}
