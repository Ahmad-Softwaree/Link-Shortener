"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

export function Footer() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <footer className="border-t border-border bg-gradient-to-r from-background via-violet-50/30 to-background dark:via-violet-950/20 py-8 mt-auto">
      <motion.div
        ref={ref}
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5 }}
        className=" mx-auto px-4 text-center text-sm text-muted-foreground">
        <p>&copy; 2026 Link Shortener. All rights reserved.</p>
      </motion.div>
    </footer>
  );
}
