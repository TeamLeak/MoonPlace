'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

// Default translations to prevent loading state issues
const defaultTranslations = {
  common: {
    welcome: 'Welcome',
    home: 'Home',
    shop: 'Shop',
    contact: 'Contact',
    login: 'Login',
    dashboard: 'Dashboard',
    features: 'Features',
    screenshots: 'Screenshots',
    serverFeatures: 'Server Features'
  },
  features: [],
  screenshots: []
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('ru');
  const [translations, setTranslations] = useState(defaultTranslations);

  useEffect(() => {
    // Load language from localStorage or default to 'ru'
    const savedLanguage = localStorage.getItem('language') || 'ru';
    setLanguage(savedLanguage);
    document.documentElement.lang = savedLanguage; // Update HTML lang attribute
    loadTranslations(savedLanguage);
    
    // Add event listener for storage changes (in case language is changed in another tab)
    const handleStorageChange = (e) => {
      if (e.key === 'language') {
        const newLang = e.newValue || 'ru';
        setLanguage(newLang);
        document.documentElement.lang = newLang;
        loadTranslations(newLang);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const loadTranslations = async (lang) => {
    try {
      // Default to Russian if the requested language is not found
      let translationsToLoad = lang;
      if (!['en', 'ru', 'uk'].includes(lang)) {
        console.warn(`Language ${lang} not supported, falling back to Russian`);
        translationsToLoad = 'ru';
      }
      
      const response = await import(`@/locales/${translationsToLoad}.json`);
      const translationsData = response.default || response;
      
      // Merge with default translations to ensure all keys exist
      const mergedTranslations = {
        ...defaultTranslations,
        ...translationsData,
        common: {
          ...defaultTranslations.common,
          ...(translationsData.common || {})
        }
      };
      
      setTranslations(mergedTranslations);
      return mergedTranslations;
    } catch (error) {
      console.error(`Failed to load ${lang} translations:`, error);
      // Fallback to Russian if there's an error
      if (lang !== 'ru') {
        try {
          const fallback = await import('@/locales/ru.json');
          setTranslations(fallback.default || fallback);
        } catch (e) {
          console.error('Failed to load fallback translations:', e);
        }
      }
    }
  };

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
    loadTranslations(lang);
  };

  const t = (key) => {
    if (!translations || !key) return key;
    
    try {
      // Try to get the nested value
      const value = getNestedValue(translations, key);
      
      // If value is found, return it
      if (value !== undefined) {
        return value;
      }
      
      // Try to get the value from common namespace
      if (translations.common && translations.common[key]) {
        return translations.common[key];
      }
      
      // If not found, return the last part of the key
      const lastPart = key.split('.').pop();
      console.warn(`Translation key not found: ${key}`);
      return lastPart || key;
      
    } catch (error) {
      console.error(`Error getting translation for key: ${key}`, error);
      return key;
    }
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Helper function to get translations
const getNestedValue = (obj, path) => {
  return path.split('.').reduce((o, p) => (o && o[p] !== undefined ? o[p] : undefined), obj);
};
