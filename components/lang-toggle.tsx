import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { setCookie } from "@/lib/config/cookie.config";
import { ENUMs } from "@/lib/enums";
import { ChevronDown, Languages } from "lucide-react";
import { useTranslation } from "react-i18next";
export const setLanguage = (selectedLang: string) => {
  setCookie(ENUMs.GLOBAL.LANG_COOKIE, selectedLang);
  document.body.classList.remove("english_font", "arabic_font", "kurdish_font");
  if (selectedLang === "en") {
    document.body.classList.add("english_font");
    document.dir = "ltr";
  } else if (selectedLang === "ar") {
    document.body.classList.add("arabic_font");
    document.dir = "rtl";
  } else if (selectedLang === "ckb") {
    document.body.classList.add("kurdish_font");
    document.dir = "rtl";
  }
};

export function LangToggle() {
  const { i18n } = useTranslation();

  const setSelectedLang = (selectedLang: string) => {
    i18n.changeLanguage(selectedLang);
    setLanguage(selectedLang);
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex flex-row justify-center items-center gap-1 cursor-pointer hover:text-cta transition-colors duration-200">
          <Languages className="w-5 lg:w-6" />
          <small className="font-light hidden md:block english_font">
            {i18n.t(`langs_codes.${i18n.language}` as any)}
          </small>
          <ChevronDown className="w-3 hidden md:block" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="space-y-1 z-[1200] relative" align="end">
        {(i18n.options.resources
          ? Object.keys(i18n.options.resources)
          : []
        ).map((val, idx) => (
          <DropdownMenuItem
            key={idx}
            onClick={() => setSelectedLang(val)}
            className={`${
              i18n.language === val ? "bg-primary text-primary-foreground" : ""
            } focus:bg-primary focus:text-primary-foreground transition-colors duration-200 cursor-pointer`}>
            {i18n.t(`langs.${val}` as any)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
