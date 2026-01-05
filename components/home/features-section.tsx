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
      transition={{ duration: 0.5, delay: index * 0.1 }}>
      <Card className="h-full hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <Icon className="h-10 w-10 text-primary mb-2" />
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
      </Card>
    </motion.div>
  );
}

export function FeaturesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="features" className="container mx-auto px-4 py-20">
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
