"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { Link2, Github, Globe } from "lucide-react";
import { SignInButton, SignUpButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export function Footer() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const { t } = useTranslation();

  return (
    <footer className="border-t border-border bg-gradient-to-r from-background via-violet-50/30 to-background dark:via-violet-950/20 py-12 mt-auto">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
        className=" mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 group w-fit">
              <div className="p-2 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-lg shadow-md group-hover:shadow-lg group-hover:shadow-violet-500/50 transition-all duration-300">
                <Link2 className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                {t("app.title")}
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              {t("home.footer.description")}
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">
              {t("home.footer.quick_links")}
            </h3>
            <div className="flex flex-col gap-2">
              <SignedOut>
                <SignInButton mode="modal">
                  <Button
                    variant="link"
                    className="justify-start p-0 h-auto text-muted-foreground hover:text-violet-600">
                    {t("header.sign_in")}
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button
                    variant="link"
                    className="justify-start p-0 h-auto text-muted-foreground hover:text-violet-600">
                    {t("header.sign_up")}
                  </Button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <Link href="/dashboard">
                  <Button
                    variant="link"
                    className="justify-start p-0 h-auto text-muted-foreground hover:text-violet-600">
                    {t("header.dashboard")}
                  </Button>
                </Link>
              </SignedIn>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">
              {t("home.footer.connect")}
            </h3>
            <div className="flex flex-col gap-2">
              <a
                href="https://github.com/Ahmad-Softwaree"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-violet-600 transition-colors">
                <Github className="h-4 w-4" />
                {t("home.footer.github")}
              </a>
              <a
                href="https://www.ahmad-software.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-violet-600 transition-colors">
                <Globe className="h-4 w-4" />
                {t("home.footer.portfolio")}
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-border/40 text-center text-sm text-muted-foreground">
          <p>{t("home.footer.copyright")}</p>
        </div>
      </motion.div>
    </footer>
  );
}
