"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link2, Zap, BarChart3, Shield, Globe, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const features = [
  {
    icon: Link2,
    title: "Instant Link Shortening",
    description:
      "Convert long URLs into short, shareable links in seconds. Perfect for social media, emails, and anywhere space matters.",
  },
  {
    icon: BarChart3,
    title: "Analytics & Insights",
    description:
      "Track clicks, understand your audience, and measure the impact of your links with detailed analytics and reporting.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Built with modern technology for blazing-fast performance. Your links work instantly, every time.",
  },
  {
    icon: Shield,
    title: "Secure & Reliable",
    description:
      "Enterprise-grade security ensures your links are safe. SSL encryption and 99.9% uptime guarantee.",
  },
  {
    icon: Globe,
    title: "Custom Domains",
    description:
      "Use your own domain for branded short links. Build trust and reinforce your brand identity.",
  },
  {
    icon: Sparkles,
    title: "Easy Management",
    description:
      "Organize, edit, and manage all your links from one intuitive dashboard. Find what you need, when you need it.",
  },
];

const gradients = [
  "from-violet-50 to-purple-50 dark:from-violet-950/50 dark:to-purple-950/50",
  "from-indigo-50 to-violet-50 dark:from-indigo-950/50 dark:to-violet-950/50",
  "from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50",
  "from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50",
  "from-pink-50 to-violet-50 dark:from-pink-950/50 dark:to-violet-950/50",
  "from-violet-50 to-indigo-50 dark:from-violet-950/50 dark:to-indigo-950/50",
];

const iconColors = [
  "text-violet-600 dark:text-violet-400",
  "text-indigo-600 dark:text-indigo-400",
  "text-purple-600 dark:text-purple-400",
  "text-blue-600 dark:text-blue-400",
  "text-pink-600 dark:text-pink-400",
  "text-violet-600 dark:text-violet-400",
];

function FeatureCard({
  icon: Icon,
  title,
  description,
  index,
}: {
  icon: React.ElementType;
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
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}>
      <Card
        className={`h-full hover:shadow-2xl transition-all duration-300 border hover:border-violet-200 dark:hover:border-violet-800 bg-gradient-to-br ${
          gradients[index % gradients.length]
        }`}>
        <CardHeader>
          <div className="mb-4 p-3 bg-background rounded-xl w-fit shadow-sm">
            <Icon
              className={`h-10 w-10 ${iconColors[index % iconColors.length]}`}
            />
          </div>
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription className="text-base">{description}</CardDescription>
        </CardHeader>
      </Card>
    </motion.div>
  );
}

export function FeaturesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="features" className=" mx-auto px-4 py-20">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-4 mb-16">
        <Badge variant="outline">Features</Badge>
        <h2 className="text-3xl md:text-4xl font-bold">
          Everything You Need to Succeed
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Powerful features designed to help you manage and optimize your links
          effectively.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <FeatureCard key={index} {...feature} index={index} />
        ))}
      </div>
    </section>
  );
}
