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
import { motion, useScroll } from "framer-motion";
import { useState, useEffect } from "react";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    return scrollY.on("change", (latest) => {
      setIsScrolled(latest > 50);
    });
  }, [scrollY]);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-lg border-b border-border/40 shadow-lg shadow-violet-500/5"
          : "bg-background/60 backdrop-blur-md border-b border-border/20"
      }`}>
      <div className="container mx-auto flex justify-between items-center py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-2 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-lg shadow-md group-hover:shadow-violet-500/50 transition-shadow">
            <Link2 className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-xl bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            Link Shortener
          </span>
        </Link>

        {/* Auth Buttons */}
        <div className="flex gap-3 items-center">
          <SignedOut>
            <SignInButton mode="modal">
              <Button
                variant="ghost"
                className="hover:bg-violet-50 dark:hover:bg-violet-950/30">
                Sign In
              </Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button className="shadow-md hover:shadow-lg transition-shadow">
                Sign Up
              </Button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <Button
              variant="ghost"
              asChild
              className="hover:bg-violet-50 dark:hover:bg-violet-950/30">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </motion.header>
  );
}
