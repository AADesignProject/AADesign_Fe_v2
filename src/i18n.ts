import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationEN from '@/locales/en/common.json';
import translationVI from '@/locales/vi/common.json';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: translationEN,
    },
    vi: {
      translation: translationVI,
    },
  },
  lng: 'vi',
  fallbackLng: 'vi',
  supportedLngs: ['vi', 'en'],
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
