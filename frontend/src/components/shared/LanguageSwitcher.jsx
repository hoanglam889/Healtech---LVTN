import React from 'react';
import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher({ className = '' }) {
  const { i18n } = useTranslation();
  const current = i18n.language;

  const toggle = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('lang', lang);
  };

  return (
    <div className={`flex items-center gap-1 p-0.5 bg-gray-100 rounded-lg ${className}`}>
      <button
        onClick={() => toggle('vi')}
        className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
          current === 'vi' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'
        }`}
      >
        VI
      </button>
      <button
        onClick={() => toggle('en')}
        className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
          current === 'en' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'
        }`}
      >
        EN
      </button>
    </div>
  );
}
