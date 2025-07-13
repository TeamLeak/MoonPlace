'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

const LanguageSwitcher = () => {
  const { language, changeLanguage: changeLang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'uk', name: 'Українська', flag: '🇺🇦' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
  ];

  const currentLanguage = languages.find(lang => lang.code === language) || languages[0];

  const handleLanguageChange = async (lang) => {
    if (language === lang) return;
    
    try {
      // Update the language in localStorage
      localStorage.setItem('language', lang);
      
      // Call the context's changeLanguage function
      changeLang(lang);
      
      // Force a full page reload to ensure all translations are applied
      window.location.reload();
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  return (
    <div className="relative ml-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
      >
        <span>{currentLanguage.flag}</span>
        <span className="hidden sm:inline">{currentLanguage.code.toUpperCase()}</span>
        <i className={`fas fa-chevron-${isOpen ? 'up' : 'down'} text-xs`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 rounded-lg bg-[#1a0b2e] border border-white/10 shadow-lg z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                handleLanguageChange(lang.code);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 hover:bg-white/10 transition-colors flex items-center space-x-2 ${
                language === lang.code ? 'text-[#a855f7]' : 'text-white'
              }`}
            >
              <span>{lang.flag}</span>
              <span>{lang.name}</span>
            </button>
          ))}
        </div>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default LanguageSwitcher;
