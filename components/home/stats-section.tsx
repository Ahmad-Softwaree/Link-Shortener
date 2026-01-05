"use client";

import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef } from "react";

function AnimatedNumber({
  value,
  suffix = "",
}: {
  value: number;
  suffix?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 50,
    stiffness: 100,
  });
  const displayValue = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [isInView, motionValue, value]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      if (displayValue.current) {
        displayValue.current.textContent = Math.floor(latest).toLocaleString();
      }
    });

    return () => unsubscribe();
  }, [springValue]);

  return (
    <span ref={ref}>
      <span ref={displayValue}>0</span>
      {suffix}
    </span>
  );
}

const stats = [
  {
    value: 100000,
    suffix: "+",
    label: "Links Shortened",
  },
  {
    value: 99.9,
    suffix: "%",
    label: "Uptime Guarantee",
  },
  {
    value: 100,
    suffix: "ms",
    prefix: "<",
    label: "Average Response Time",
  },
];

function StatCard({
  value,
  suffix,
  prefix,
  label,
  index,
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const statGradients = [
    "from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400",
    "from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400",
    "from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400",
  ];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.05 }}
      className="space-y-2 p-6 rounded-2xl bg-gradient-to-br from-background to-muted border border-border hover:border-violet-200 dark:hover:border-violet-800 transition-all duration-300 shadow-sm hover:shadow-lg">
      <div
        className={`text-4xl md:text-5xl font-bold bg-gradient-to-r ${statGradients[index]} bg-clip-text text-transparent`}>
        {prefix}
        <AnimatedNumber value={value} suffix={suffix} />
      </div>
      <p className="text-muted-foreground font-medium">{label}</p>
    </motion.div>
  );
}

export function StatsSection() {
  return (
    <section className=" mx-auto px-4 py-20">
      <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} index={index} />
        ))}
      </div>
    </section>
  );
}
