"use client";

import { SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Github } from "lucide-react";
import Link from "next/link";

export function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { t } = useTranslation();

  return (
    <section className=" mx-auto px-4 py-20">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.6 }}>
        <Card className="border border-violet-200 dark:border-violet-800 bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 dark:from-violet-950/50 dark:via-purple-950/50 dark:to-indigo-950/50 relative overflow-hidden shadow-lg">
          <CardContent className="flex flex-col items-center text-center space-y-6 p-12 relative">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-3xl md:text-4xl font-bold">
              {t("home.cta.title")}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-lg text-muted-foreground max-w-2xl">
              {t("home.cta.description")}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}>
                <SignUpButton mode="modal">
                  <Button
                    size="lg"
                    className="text-lg px-8 shadow-lg hover:shadow-xl transition-all duration-300">
                    {t("home.cta.button")}
                  </Button>
                </SignUpButton>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}>
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
              </motion.div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </section>
  );
}
