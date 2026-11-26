import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import fr from "./locales/fr.json";
import ja from "./locales/ja.json";

function syncHtmlLang() {
  document.documentElement.lang = i18n.resolvedLanguage || "en";
}

i18n.on("languageChanged", syncHtmlLang);

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      fr: { translation: fr },
      ja: { translation: ja },
    },
    fallbackLng: "en",
    supportedLngs: ["en", "fr", "ja"],
    load: "languageOnly", 
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
    interpolation: { escapeValue: false },
  });

syncHtmlLang();

export default i18n;