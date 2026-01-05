import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { HeroSection } from "@/components/home/hero-section";
import { FeaturesSection } from "@/components/home/features-section";
import { HowItWorksSection } from "@/components/home/how-it-works-section";
import { StatsSection } from "@/components/home/stats-section";
import { CTASection } from "@/components/home/cta-section";
import { Footer } from "@/components/home/footer";

export default async function Home() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <HeroSection />

      <Separator className=" mx-auto" />

      <FeaturesSection />

      <Separator className=" mx-auto" />

      <HowItWorksSection />

      <Separator className=" mx-auto" />

      <StatsSection />

      <CTASection />

      <Footer />
    </div>
  );
}
