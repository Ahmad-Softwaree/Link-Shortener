"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { setCookie } from "@/lib/config/cookie.config";
import { useEffect } from "react";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (theme) {
      setCookie("theme", theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    setCookie("theme", newTheme);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="hover:bg-violet-50 dark:hover:bg-violet-950/30 transition-colors">
      {theme === "dark" ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
    </Button>
  );
}
