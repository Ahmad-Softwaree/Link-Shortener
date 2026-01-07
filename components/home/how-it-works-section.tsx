"use client";

import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import { FadeInUpScroll, HoverScaleRotate } from "@/components/shared/animate";

const getSteps = (t: any) => [
  {
    number: 1,
    title: t("home.how_it_works.step1_title"),
    description: t("home.how_it_works.step1_desc"),
  },
  {
    number: 2,
    title: t("home.how_it_works.step2_title"),
    description: t("home.how_it_works.step2_desc"),
  },
  {
    number: 3,
    title: t("home.how_it_works.step3_title"),
    description: t("home.how_it_works.step3_desc"),
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
  const stepGradients = [
    "from-violet-600 to-indigo-600",
    "from-indigo-600 to-purple-600",
    "from-purple-600 to-pink-600",
  ];

  return (
    <FadeInUpScroll
      delay={index * 0.2}
      className="flex flex-col items-center text-center space-y-4">
      <HoverScaleRotate className="relative">
        <div
          className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${stepGradients[index]} flex items-center justify-center shadow-xl`}>
          <span className="text-5xl font-bold text-white">{number}</span>
        </div>
        <div
          className={`absolute -inset-2 bg-gradient-to-br ${stepGradients[index]} rounded-2xl blur-lg opacity-30 -z-10 animate-pulse`}
        />
      </HoverScaleRotate>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </FadeInUpScroll>
  );
}

export function HowItWorksSection() {
  const { t } = useTranslation();
  const steps = getSteps(t);

  return (
    <section className=" mx-auto px-4 py-20">
      <FadeInUpScroll duration={0.6} className="text-center space-y-4 mb-16">
        <Badge variant="outline">{t("home.how_it_works.badge")}</Badge>
        <h2 className="text-3xl md:text-4xl font-bold">
          {t("home.how_it_works.title")}
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          {t("home.how_it_works.description")}
        </p>
      </FadeInUpScroll>

      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {steps.map((step, index) => (
          <StepCard key={index} {...step} index={index} />
        ))}
      </div>
    </section>
  );
}
