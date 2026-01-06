import "i18next";
import en from "./locale/en.json";
import ar from "./locale/ar.json";
import ckb from "./locale/ckb.json";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "ckb";
    resources: {
      en: typeof en;
      ar: typeof ar;
      ckb: typeof ckb;
    };
  }
}
