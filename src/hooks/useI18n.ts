'use client';

import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';

export function useI18n() {
  const { t, i18n, ready } = useTranslation();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const getText = (key: string, fallback: string) => {
    return (isClient && ready) ? t(key) : fallback;
  };

  const changeLanguage = (languageCode: string) => {
    if (isClient && ready) {
      i18n.changeLanguage(languageCode);
    }
  };

  return {
    t,
    i18n,
    ready: isClient && ready,
    isClient,
    getText,
    changeLanguage,
  };
}
