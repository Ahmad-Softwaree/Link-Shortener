"use client";

import { SignUpButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { Github } from "lucide-react";
import Link from "next/link";
import { FadeInUpScroll, ButtonHover } from "@/components/shared/animate";

export function CTASection() {
  const { t } = useTranslation();

  return (
    <section className=" mx-auto px-4 py-20">
      <FadeInUpScroll duration={0.6}>
        <Card className="border border-violet-200 dark:border-violet-800 bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 dark:from-violet-950/50 dark:via-purple-950/50 dark:to-indigo-950/50 relative overflow-hidden shadow-lg">
          <CardContent className="flex flex-col items-center text-center space-y-6 p-12 relative">
            <FadeInUpScroll
              delay={0.2}
              duration={0.5}
              className="text-3xl md:text-4xl font-bold">
              {t("home.cta.title")}
            </FadeInUpScroll>
            <FadeInUpScroll
              delay={0.3}
              duration={0.5}
              className="text-lg text-muted-foreground max-w-2xl">
              {t("home.cta.description")}
            </FadeInUpScroll>
            <FadeInUpScroll
              delay={0.4}
              duration={0.5}
              className="flex flex-col sm:flex-row gap-4">
              <ButtonHover>
                <SignedOut>
                  <SignUpButton mode="modal">
                    <Button
                      size="lg"
                      className="text-lg px-8 shadow-lg hover:shadow-xl transition-all duration-300">
                      {t("home.cta.button")}
                    </Button>
                  </SignUpButton>
                </SignedOut>
                <SignedIn>
                  <Link href="/dashboard">
                    <Button
                      size="lg"
                      className="text-lg px-8 shadow-lg hover:shadow-xl transition-all duration-300">
                      {t("home.cta.button")}
                    </Button>
                  </Link>
                </SignedIn>
              </ButtonHover>
              <ButtonHover>
                <Link
                  href="https://github.com/Ahmad-Softwaree/Link-Shortener"
                  target="_blank"
                  rel="noopener noreferrer">
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-lg px-8 shadow-lg hover:shadow-xl transition-all duration-300">
                    <Github className="mr-2 h-5 w-5" />
                    {t("home.cta.star_github")}
                  </Button>
                </Link>
              </ButtonHover>
            </FadeInUpScroll>
          </CardContent>
        </Card>
      </FadeInUpScroll>
    </section>
  );
}
