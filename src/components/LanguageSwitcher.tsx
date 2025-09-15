'use client';

import { useState, useRef, useEffect } from 'react';
import { useI18n } from '@/hooks/useI18n';
import { ChevronDown, Globe } from 'lucide-react';

const languages = [
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
];

export default function LanguageSwitcher() {
  const { i18n, ready, isClient, changeLanguage } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isClient) return;
    
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isClient]);

  const handleChangeLanguage = (languageCode: string) => {
    changeLanguage(languageCode);
    setIsOpen(false);
  };

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  if (!isClient || !ready) {
    return (
      <div className="flex items-center space-x-2 px-3 py-2 text-gray-700">
        <Globe className="w-4 h-4" />
        <span className="text-sm font-medium">🇰🇷</span>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-purple-600 transition-colors"
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm font-medium">{currentLanguage.flag}</span>
        <ChevronDown className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          {languages.map((language) => (
                  <button
                    key={language.code}
                    onClick={() => handleChangeLanguage(language.code)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                      i18n.language === language.code ? 'bg-purple-50 text-purple-700' : 'text-gray-700'
                    }`}
                  >
              <span className="text-lg">{language.flag}</span>
              <span className="text-sm font-medium">{language.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
