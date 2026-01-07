import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { setCookie } from "@/lib/config/cookie.config";
import { ENUMs } from "@/lib/enums";
import { Languages } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";

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
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-violet-50 dark:hover:bg-violet-950/30 transition-colors">
          <Languages className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="z-[1200]" align="end">
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
