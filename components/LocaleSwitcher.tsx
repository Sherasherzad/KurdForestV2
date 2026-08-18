'use client';

import { useEffect, useState } from 'react';

const OPTIONS = [
  { code: 'ku', label: 'KUR' },
  { code: 'ar', label: 'AR' },
  { code: 'en', label: 'EN' },
] as const;

export default function LocaleSwitcher() {
  const [locale, setLocale] = useState('ku');

  useEffect(() => {
    const stored = localStorage.getItem('kurdforest-locale');
    if (stored && OPTIONS.some((option) => option.code === stored)) {
      setLocale(stored);
      document.documentElement.lang = stored;
    }
  }, []);

  const handleLocaleChange = (code: string) => {
    setLocale(code);
    localStorage.setItem('kurdforest-locale', code);
    document.documentElement.lang = code;
  };

  return (
    <div className="inline-flex items-center rounded-full border border-white/10 bg-black/20 p-1">
      {OPTIONS.map((option) => (
        <button
          key={option.code}
          type="button"
          onClick={() => handleLocaleChange(option.code)}
          className={`rounded-full px-2.5 py-1 text-[10px] font-semibold transition ${
            locale === option.code ? 'bg-yellow-400 text-black' : 'text-gray-300 hover:bg-white/5'
          }`}
          aria-label={`Select ${option.label} language`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
