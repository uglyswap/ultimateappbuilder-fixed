"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.i18nGeneratorService = exports.I18nGeneratorService = void 0;
const logger_1 = require("../utils/logger");
const universal_ai_client_1 = require("../utils/universal-ai-client");
class I18nGeneratorService {
    /**
     * Generate i18n configuration
     */
    async generateI18nSetup(config) {
        logger_1.logger.info('Generating i18n setup');
        // Generate translations for each language
        const translations = {};
        for (const lang of config.supportedLanguages) {
            translations[lang] = await this.generateTranslations(lang);
        }
        // Generate i18n configuration
        const i18nConfig = this.generateI18nConfig(config);
        // Generate React setup
        const reactSetup = this.generateReactSetup(config);
        // Generate language switcher component
        const languageSwitcher = this.generateLanguageSwitcher(config);
        return {
            translations,
            i18nConfig,
            reactSetup,
            languageSwitcher,
        };
    }
    /**
     * Generate translations using AI
     */
    async generateTranslations(language) {
        const prompt = `Generate common translation keys for a web application in ${language}.

Include translations for:
- Navigation (home, about, contact, etc.)
- Authentication (login, register, logout, etc.)
- Common actions (save, cancel, delete, edit, etc.)
- Messages (success, error, warning, etc.)
- Form labels
- Common UI elements

Return ONLY valid JSON with key-value pairs.`;
        const result = await universal_ai_client_1.universalAIClient.generateCode(prompt, 'frontend', {
            autonomousMode: true,
            temperature: 0.5,
        });
        try {
            return JSON.parse(result.content);
        }
        catch (error) {
            logger_1.logger.error('Failed to parse translations', { error });
            return {
                common: {
                    home: 'Home',
                    about: 'About',
                    contact: 'Contact',
                },
            };
        }
    }
    /**
     * Generate i18n configuration
     */
    generateI18nConfig(config) {
        return `import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
${config.supportedLanguages.map(lang => `import ${lang} from './locales/${lang}.json';`).join('\n')}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
${config.supportedLanguages.map(lang => `      ${lang}: { translation: ${lang} }`).join(',\n')}
    },
    fallbackLng: '${config.defaultLanguage}',
    defaultNS: 'translation',
    ns: ['translation'],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage', 'cookie'],
    },
  });

export default i18n;
`;
    }
    /**
     * Generate React i18n setup
     */
    generateReactSetup(config) {
        return `import React from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';

export function I18nProvider({ children }: { children: React.ReactNode }) {
  return (
    <I18nextProvider i18n={i18n}>
      {children}
    </I18nextProvider>
  );
}

// Usage example:
// import { useTranslation } from 'react-i18next';
//
// function MyComponent() {
//   const { t } = useTranslation();
//   return <h1>{t('common.welcome')}</h1>;
// }
`;
    }
    /**
     * Generate language switcher component
     */
    generateLanguageSwitcher(config) {
        return `import React from 'react';
import { useTranslation } from 'react-i18next';

const languages = {
${config.supportedLanguages.map(lang => `  ${lang}: '${this.getLanguageName(lang)}'`).join(',\n')}
};

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="language-switcher">
      <select
        value={i18n.language}
        onChange={(e) => changeLanguage(e.target.value)}
        className="px-4 py-2 border rounded"
      >
        {Object.entries(languages).map(([code, name]) => (
          <option key={code} value={code}>
            {name}
          </option>
        ))}
      </select>
    </div>
  );
}
`;
    }
    /**
     * Get language display name
     */
    getLanguageName(code) {
        const names = {
            en: 'English',
            es: 'Español',
            fr: 'Français',
            de: 'Deutsch',
            it: 'Italiano',
            pt: 'Português',
            ru: 'Русский',
            zh: '中文',
            ja: '日本語',
            ko: '한국어',
            ar: 'العربية',
            he: 'עברית',
        };
        return names[code] || code.toUpperCase();
    }
    /**
     * Generate RTL support
     */
    generateRTLSupport() {
        return `import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const RTL_LANGUAGES = ['ar', 'he', 'fa', 'ur'];

export function useRTL() {
  const { i18n } = useTranslation();

  useEffect(() => {
    const isRTL = RTL_LANGUAGES.includes(i18n.language);
    document.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);
}
`;
    }
    /**
     * Generate locale-specific formatting
     */
    generateLocaleFormatting() {
        return `import { useTranslation } from 'react-i18next';

export function useLocaleFormatting() {
  const { i18n } = useTranslation();

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(i18n.language).format(date);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat(i18n.language).format(num);
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat(i18n.language, {
      style: 'currency',
      currency,
    }).format(amount);
  };

  return {
    formatDate,
    formatNumber,
    formatCurrency,
  };
}
`;
    }
}
exports.I18nGeneratorService = I18nGeneratorService;
exports.i18nGeneratorService = new I18nGeneratorService();
//# sourceMappingURL=i18n-generator-service.js.map