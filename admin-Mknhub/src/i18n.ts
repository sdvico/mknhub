import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-xhr-backend";
import detector from "i18next-browser-languagedetector";

i18n
  .use(Backend)
  .use(detector)
  .use(initReactI18next)
  .init({
    supportedLngs: ["vi", "en", "de"],
    backend: {
      loadPath: "/locales/{{lng}}.json",
    },
    fallbackLng: ["vi", "en", "de"],
    lng: "vi", // Set Vietnamese as default
  });

export default i18n;
