import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { translateText } from '../services/translate';

export const useDynamicTranslate = (text) => {
  const { i18n } = useTranslation();
  const [translatedText, setTranslatedText] = useState(text);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    // Immediate fallback for empty text
    if (!text) {
      setTranslatedText(text);
      setIsTranslating(false);
      return;
    }

    let isMounted = true;
    const fetchTranslation = async () => {
      setIsTranslating(true);
      const result = await translateText(text, i18n.language);
      if (isMounted) {
        setTranslatedText(result);
        setIsTranslating(false);
      }
    };

    fetchTranslation();

    return () => {
      isMounted = false;
    };
  }, [text, i18n.language]);

  return { translatedText, isTranslating };
};
