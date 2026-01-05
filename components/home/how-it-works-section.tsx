"use client";

import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const steps = [
  {
    number: 1,
    title: "Sign Up",
    description:
      "Create your free account in seconds. No credit card required.",
  },
  {
    number: 2,
    title: "Shorten",
    description:
      "Paste your long URL and get a short link instantly. Customize it if you want.",
  },
  {
    number: 3,
    title: "Share & Track",
    description:
      "Share your link anywhere and monitor its performance with real-time analytics.",
  },
];

function StepCard({
  number,
  title,
  description,
  index,
}: {
  number: number;
  title: string;
  description: string;
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5, delay: index * 0.2 }}
      className="flex flex-col items-center text-center space-y-4">
      <motion.div
        whileHover={{ scale: 1.1 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="relative">
        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg">
          <span className="text-5xl font-bold text-white">{number}</span>
        </div>
        <div className="absolute -inset-1 bg-gradient-to-br from-primary to-primary/60 rounded-2xl blur opacity-30 -z-10" />
      </motion.div>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </motion.div>
  );
}

export function HowItWorksSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="container mx-auto px-4 py-20">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-4 mb-16">
        <Badge variant="outline">How It Works</Badge>
        <h2 className="text-3xl md:text-4xl font-bold">
          Simple, Fast, Effective
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Get started in three easy steps and start sharing your short links
          immediately.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {steps.map((step, index) => (
          <StepCard key={index} {...step} index={index} />
        ))}
      </div>
    </section>
  );
}
