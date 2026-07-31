// src/i18n.js
import { createI18n } from 'vue-i18n';

import en from './locales/en.json';
import ar from './locales/ar.json';
import ur from './locales/ur.json';
import fr from './locales/fr.json';

// 1. Get the saved language from localStorage, or default to 'en'
const savedLanguage = localStorage.getItem('language') || 'en';

const messages = {
  en,
  ar,
  ur,
  fr,
};

const i18n = createI18n({
  legacy: true, // Recommended for Vue 3 Composition API
  locale: savedLanguage, // <-- Use the saved language here
  fallbackLocale: 'en',
  messages,
});

export default i18n;