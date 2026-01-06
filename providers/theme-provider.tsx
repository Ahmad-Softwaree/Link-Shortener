"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";
import { useEffect, useState } from "react";
import { getCookie } from "@/lib/config/cookie.config";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = getCookie("theme");
    if (savedTheme && (savedTheme === "dark" || savedTheme === "light")) {
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    }
  }, []);

  if (!mounted) {
    return null;
  }

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
