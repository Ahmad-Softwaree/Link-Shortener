"use client";

import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Link2 } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { ModeToggle } from "@/components/mode-toggle";
import { LangToggle } from "@/components/lang-toggle";

export function Header() {
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-lg border-b border-border/40 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-lg shadow-md group-hover:shadow-lg group-hover:shadow-violet-500/50 transition-all duration-300">
              <Link2 className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              {t("app.title")}
            </span>
          </Link>

          <div className="flex gap-3 items-center">
            <LangToggle />
            <ModeToggle />

            <SignedOut>
              <SignInButton mode="modal">
                <Button
                  variant="ghost"
                  className="hover:bg-violet-50 dark:hover:bg-violet-950/30 transition-colors">
                  {t("header.sign_in")}
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all">
                  {t("header.sign_up")}
                </Button>
              </SignUpButton>
            </SignedOut>

            <SignedIn>
              <Button
                variant="ghost"
                asChild
                className="hover:bg-violet-50 dark:hover:bg-violet-950/30 transition-colors">
                <Link href="/dashboard">{t("header.dashboard")}</Link>
              </Button>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </div>
    </header>
  );
}
