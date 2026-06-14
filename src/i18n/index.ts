import en from './en.json';
import zh from './zh.json';
import es from './es.json';
import ar from './ar.json';
import pt from './pt.json';
import ja from './ja.json';
import de from './de.json';

export const defaultLang = 'en';

export const languages: Record<string, string> = {
  en: 'English',
  zh: '中文',
  es: 'Español',
  ar: 'العربية',
  pt: 'Português',
  ja: '日本語',
  de: 'Deutsch',
};

export const langCodes = Object.keys(languages);

const translations: Record<string, any> = { en, zh, es, ar, pt, ja, de };

export function getLangFromUrl(url: URL): string {
  const [, lang] = url.pathname.split('/');
  if (langCodes.includes(lang)) return lang;
  return defaultLang;
}

export function getPathWithoutLang(pathname: string): string {
  const parts = pathname.split('/').filter(Boolean);
  if (langCodes.includes(parts[0]) && parts[0] !== defaultLang) {
    const remaining = parts.slice(1).join('/');
    return '/' + remaining + (remaining && pathname.endsWith('/') ? '/' : '');
  }
  return pathname;
}

export function getLocalizedPath(path: string, lang: string): string {
  const cleanPath = getPathWithoutLang(path);
  if (lang === defaultLang) return cleanPath;
  return `/${lang}${cleanPath}`;
}

export function t(lang: string, key: string): string {
  const keys = key.split('.');
  let value: any = translations[lang] || translations[defaultLang];
  for (const k of keys) {
    value = value?.[k];
  }
  return value || key;
}

export function useTranslations(lang: string) {
  return function (key: string): string {
    return t(lang, key);
  };
}
