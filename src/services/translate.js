const TRANSLATE_API = import.meta.env.VITE_TRANSLATE_API_URL || 'https://libretranslate.de/translate';

// Global memory cache: Map<language, Map<originalText, translatedText>>
const translationCache = new Map();

/**
 * Translates text dynamically from auto-detected source to target.
 */
export const translateText = async (text, targetLang) => {
  if (!text || typeof text !== 'string') return text;
  
  const containsHindi = /[\u0900-\u097F]/.test(text);
  
  // Smart Bypass to prevent wasteful API calls:
  // If we want English, and text has no Hindi characters, it's likely already English.
  if (targetLang === 'en' && !containsHindi) return text;
  // If we want Hindi, and text already has Hindi characters, it's likely already Hindi.
  if (targetLang === 'hi' && containsHindi) return text;

  // Initialize language cache
  if (!translationCache.has(targetLang)) {
    translationCache.set(targetLang, new Map());
  }
  
  const langCache = translationCache.get(targetLang);

  // Check Cache
  if (langCache.has(text)) {
    return langCache.get(text);
  }

  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    const response = await fetch(url);

    if (!response.ok) {
      console.warn(`Translation API Error [${response.status}] for: ${text.slice(0, 20)}...`);
      langCache.set(text, text); 
      return text;
    }

    const data = await response.json();
    // Google Translate returns a nested array where data[0] contains the translated segments
    // e.g. [[["मैं", "I", null, null, 1], [" एक", " am a", null, null, 1]]]
    let translated = '';
    if (data && data[0]) {
      data[0].forEach(item => {
        if (item[0]) translated += item[0];
      });
    }

    if (!translated) translated = text;
    
    langCache.set(text, translated);
    return translated;
  } catch (error) {
    console.error('Translation network error:', error);
    langCache.set(text, text); // cache fallback
    return text;
  }
};
