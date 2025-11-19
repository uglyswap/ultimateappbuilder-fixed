import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  useGenerateI18n,
  useTranslations,
  useUpdateTranslation
} from '../hooks';

interface Translation {
  key: string;
  en: string;
  fr: string;
  es: string;
  de: string;
}

export const I18NPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [searchTerm, setSearchTerm] = useState('');
  const [translations, setTranslations] = useState<Translation[]>([
    { key: 'common.welcome', en: 'Welcome', fr: 'Bienvenue', es: 'Bienvenido', de: 'Willkommen' },
    { key: 'common.login', en: 'Login', fr: 'Connexion', es: 'Iniciar sesión', de: 'Anmelden' },
    { key: 'common.logout', en: 'Logout', fr: 'Déconnexion', es: 'Cerrar sesión', de: 'Abmelden' },
    { key: 'common.save', en: 'Save', fr: 'Enregistrer', es: 'Guardar', de: 'Speichern' },
    { key: 'common.cancel', en: 'Cancel', fr: 'Annuler', es: 'Cancelar', de: 'Abbrechen' },
    { key: 'common.delete', en: 'Delete', fr: 'Supprimer', es: 'Eliminar', de: 'Löschen' },
    { key: 'errors.required', en: 'This field is required', fr: 'Ce champ est requis', es: 'Este campo es obligatorio', de: 'Dieses Feld ist erforderlich' },
    { key: 'errors.invalid_email', en: 'Invalid email address', fr: 'Adresse e-mail invalide', es: 'Correo electrónico inválido', de: 'Ungültige E-Mail-Adresse' },
    { key: 'nav.home', en: 'Home', fr: 'Accueil', es: 'Inicio', de: 'Startseite' },
    { key: 'nav.profile', en: 'Profile', fr: 'Profil', es: 'Perfil', de: 'Profil' },
    { key: 'nav.settings', en: 'Settings', fr: 'Paramètres', es: 'Configuración', de: 'Einstellungen' },
  ]);

  const { data: savedTranslations, isLoading } = useTranslations(projectId || '');
  const generateI18n = useGenerateI18n();
  const updateTranslation = useUpdateTranslation();

  const handleGenerateI18n = async () => {
    if (!projectId) return;
    await generateI18n.mutateAsync({
      projectId,
      data: {
        sourceLanguage: 'en',
        targetLanguages: ['fr', 'es', 'de'],
        autoTranslate: true
      }
    });
  };

  const handleUpdateTranslation = async (key: string, language: string, value: string) => {
    if (!projectId) return;
    await updateTranslation.mutateAsync({
      projectId,
      data: { key, language, value }
    });
    setTranslations(translations.map(t =>
      t.key === key
        ? { ...t, [language]: value }
        : t
    ));
  };

  const handleAddKey = () => {
    const newKey = `new.key_${Date.now()}`;
    setTranslations([...translations, {
      key: newKey,
      en: '',
      fr: '',
      es: '',
      de: ''
    }]);
  };

  const handleDeleteKey = (key: string) => {
    setTranslations(translations.filter(t => t.key !== key));
  };

  const languages = [
    { code: 'en', name: 'English', flag: 'GB' },
    { code: 'fr', name: 'French', flag: 'FR' },
    { code: 'es', name: 'Spanish', flag: 'ES' },
    { code: 'de', name: 'German', flag: 'DE' },
  ];

  const filteredTranslations = translations.filter(t =>
    t.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
    Object.values(t).some(v => v.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const completionStats = languages.map(lang => {
    const filled = translations.filter(t => t[lang.code as keyof Translation]).length;
    return {
      ...lang,
      filled,
      total: translations.length,
      percentage: Math.round((filled / translations.length) * 100)
    };
  });

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Internationalization (i18n)</h1>
          <p className="text-gray-400 mt-2">Manage translations for your application</p>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {completionStats.map(stat => (
            <div key={stat.code} className="bg-gray-800 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">{stat.name}</span>
                <span className="text-2xl">{stat.flag}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      stat.percentage === 100
                        ? 'bg-green-500'
                        : stat.percentage > 50
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${stat.percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-400">{stat.percentage}%</span>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={handleAddKey}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
          >
            Add Key
          </button>
          <button
            onClick={handleGenerateI18n}
            disabled={generateI18n.isPending}
            className="bg-green-600 hover:bg-green-700 disabled:bg-green-800 px-4 py-2 rounded-lg"
          >
            {generateI18n.isPending ? 'Generating...' : 'Auto-Translate Missing'}
          </button>
          <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg">
            Export JSON
          </button>
          <button className="bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded-lg">
            Import
          </button>

          {/* Search */}
          <div className="ml-auto">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search translations..."
              className="bg-gray-800 rounded-lg px-4 py-2 w-64"
            />
          </div>
        </div>

        {/* Language Selector */}
        <div className="flex gap-2 mb-6">
          {languages.map(lang => (
            <button
              key={lang.code}
              onClick={() => setSelectedLanguage(lang.code)}
              className={`px-4 py-2 rounded-lg ${
                selectedLanguage === lang.code
                  ? 'bg-blue-600'
                  : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              {lang.flag} {lang.name}
            </button>
          ))}
        </div>

        {/* Translations Table */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center text-gray-400">Loading translations...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-700">
                    <th className="text-left p-4 font-medium">Key</th>
                    <th className="text-left p-4 font-medium">English (Source)</th>
                    <th className="text-left p-4 font-medium">
                      {languages.find(l => l.code === selectedLanguage)?.name}
                    </th>
                    <th className="p-4 w-20">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTranslations.map(translation => (
                    <tr key={translation.key} className="border-t border-gray-700">
                      <td className="p-4">
                        <code className="text-sm bg-gray-700 px-2 py-1 rounded">
                          {translation.key}
                        </code>
                      </td>
                      <td className="p-4">
                        <input
                          type="text"
                          value={translation.en}
                          onChange={(e) => {
                            setTranslations(translations.map(t =>
                              t.key === translation.key
                                ? { ...t, en: e.target.value }
                                : t
                            ));
                          }}
                          className="w-full bg-gray-700 rounded px-3 py-1.5 text-sm"
                        />
                      </td>
                      <td className="p-4">
                        <input
                          type="text"
                          value={translation[selectedLanguage as keyof Translation] || ''}
                          onChange={(e) => handleUpdateTranslation(
                            translation.key,
                            selectedLanguage,
                            e.target.value
                          )}
                          placeholder={`Enter ${selectedLanguage} translation...`}
                          className={`w-full bg-gray-700 rounded px-3 py-1.5 text-sm ${
                            !translation[selectedLanguage as keyof Translation]
                              ? 'border border-yellow-600'
                              : ''
                          }`}
                        />
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleDeleteKey(translation.key)}
                          className="text-red-400 hover:text-red-300"
                        >
                          x
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* JSON Preview */}
        <div className="mt-6 bg-gray-800 rounded-lg p-4">
          <h3 className="font-medium mb-4">JSON Preview ({selectedLanguage})</h3>
          <pre className="bg-gray-900 rounded p-4 text-sm overflow-auto max-h-64">
            {JSON.stringify(
              filteredTranslations.reduce((acc, t) => ({
                ...acc,
                [t.key]: t[selectedLanguage as keyof Translation]
              }), {}),
              null,
              2
            )}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default I18NPage;
