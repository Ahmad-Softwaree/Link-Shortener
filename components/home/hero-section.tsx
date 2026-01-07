"use client";

import { SignUpButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Github, Link2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { FadeInUp, ScaleIn } from "@/components/shared/animate";

export function HeroSection() {
  const { t } = useTranslation();
  return (
    <section className="mx-auto px-4 py-20 md:py-32 overflow-hidden">
      {/* Gradient Background Orbs */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-3xl" />
      </div>

      <FadeInUp className="flex flex-col items-center text-center space-y-8 relative">
        <ScaleIn delay={0.2}>
          <Badge
            variant="secondary"
            className="text-sm border-violet-200 dark:border-violet-800">
            <Sparkles className="mr-2 h-3 w-3 text-violet-600 dark:text-violet-400" />
            {t("home.hero.badge")}
          </Badge>
        </ScaleIn>

        <FadeInUp
          delay={0.3}
          className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight max-w-4xl">
          {t("home.hero.title_line1")}
          <br />
          <span className="bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">
            {t("home.hero.title_line2")}
          </span>
        </FadeInUp>

        <FadeInUp
          delay={0.4}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl">
          {t("home.hero.description")}
        </FadeInUp>

        <FadeInUp delay={0.5} className="flex flex-col sm:flex-row gap-4 pt-4">
          <SignedOut>
            <SignUpButton mode="modal">
              <Button
                size="lg"
                className="text-lg px-8 shadow-lg hover:shadow-xl transition-all duration-300">
                <Link2 className="mr-2 h-5 w-5" />
                {t("home.hero.get_started")}
              </Button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard">
              <Button
                size="lg"
                className="text-lg px-8 shadow-lg hover:shadow-xl transition-all duration-300">
                <Link2 className="mr-2 h-5 w-5" />
                {t("home.hero.get_started")}
              </Button>
            </Link>
          </SignedIn>
          <Link
            href="https://github.com/Ahmad-Softwaree/Link-Shortener"
            target="_blank"
            rel="noopener noreferrer">
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <Github className="mr-2 h-5 w-5" />
              {t("home.hero.view_github")}
            </Button>
          </Link>
        </FadeInUp>
      </FadeInUp>
    </section>
  );
}
