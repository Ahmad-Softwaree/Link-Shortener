import i18n from "i18next";
import en from "./locale/en.json";
import ar from "./locale/ar.json";
import ckb from "./locale/ckb.json";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ar: { translation: ar },
    ckb: { translation: ckb },
  },
  fallbackLng: ["en", "ckb", "ar"],
  interpolation: { escapeValue: false },
});

export default i18n;
