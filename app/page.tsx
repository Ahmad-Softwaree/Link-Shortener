import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Link2, Zap, BarChart3, Shield, Globe, Sparkles } from "lucide-react";

export default async function Home() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="flex flex-col items-center text-center space-y-8">
          <Badge variant="secondary" className="text-sm">
            <Sparkles className="mr-2 h-3 w-3" />
            Fast, Simple, Powerful
          </Badge>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight max-w-4xl">
            Shorten Your Links,
            <br />
            <span className="text-primary">Amplify Your Reach</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
            Transform long, complex URLs into short, memorable links. Track performance, 
            manage your links, and grow your online presence with our powerful link shortener.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <SignUpButton mode="modal">
              <Button size="lg" className="text-lg px-8">
                Get Started Free
              </Button>
            </SignUpButton>
            <Button size="lg" variant="outline" className="text-lg px-8" asChild>
              <a href="#features">Learn More</a>
            </Button>
          </div>
        </div>
      </section>

      <Separator className="container mx-auto" />

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="text-center space-y-4 mb-16">
          <Badge variant="outline">Features</Badge>
          <h2 className="text-3xl md:text-4xl font-bold">
            Everything You Need to Succeed
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Powerful features designed to help you manage and optimize your links effectively.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <Link2 className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Instant Link Shortening</CardTitle>
              <CardDescription>
                Convert long URLs into short, shareable links in seconds. Perfect for social media, 
                emails, and anywhere space matters.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <BarChart3 className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Analytics & Insights</CardTitle>
              <CardDescription>
                Track clicks, understand your audience, and measure the impact of your links 
                with detailed analytics and reporting.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Lightning Fast</CardTitle>
              <CardDescription>
                Built with modern technology for blazing-fast performance. Your links work 
                instantly, every time.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Secure & Reliable</CardTitle>
              <CardDescription>
                Enterprise-grade security ensures your links are safe. SSL encryption and 
                99.9% uptime guarantee.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Globe className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Custom Domains</CardTitle>
              <CardDescription>
                Use your own domain for branded short links. Build trust and 
                reinforce your brand identity.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Sparkles className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Easy Management</CardTitle>
              <CardDescription>
                Organize, edit, and manage all your links from one intuitive dashboard. 
                Find what you need, when you need it.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      <Separator className="container mx-auto" />

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center space-y-4 mb-16">
          <Badge variant="outline">How It Works</Badge>
          <h2 className="text-3xl md:text-4xl font-bold">
            Simple, Fast, Effective
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Get started in three easy steps and start sharing your short links immediately.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="rounded-full bg-primary/10 p-6">
              <span className="text-4xl font-bold text-primary">1</span>
            </div>
            <h3 className="text-xl font-semibold">Sign Up</h3>
            <p className="text-muted-foreground">
              Create your free account in seconds. No credit card required.
            </p>
          </div>

          <div className="flex flex-col items-center text-center space-y-4">
            <div className="rounded-full bg-primary/10 p-6">
              <span className="text-4xl font-bold text-primary">2</span>
            </div>
            <h3 className="text-xl font-semibold">Shorten</h3>
            <p className="text-muted-foreground">
              Paste your long URL and get a short link instantly. Customize it if you want.
            </p>
          </div>

          <div className="flex flex-col items-center text-center space-y-4">
            <div className="rounded-full bg-primary/10 p-6">
              <span className="text-4xl font-bold text-primary">3</span>
            </div>
            <h3 className="text-xl font-semibold">Share & Track</h3>
            <p className="text-muted-foreground">
              Share your link anywhere and monitor its performance with real-time analytics.
            </p>
          </div>
        </div>
      </section>

      <Separator className="container mx-auto" />

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
          <div className="space-y-2">
            <div className="text-4xl md:text-5xl font-bold text-primary">100K+</div>
            <p className="text-muted-foreground">Links Shortened</p>
          </div>
          <div className="space-y-2">
            <div className="text-4xl md:text-5xl font-bold text-primary">99.9%</div>
            <p className="text-muted-foreground">Uptime Guarantee</p>
          </div>
          <div className="space-y-2">
            <div className="text-4xl md:text-5xl font-bold text-primary">&lt;100ms</div>
            <p className="text-muted-foreground">Average Response Time</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="flex flex-col items-center text-center space-y-6 p-12">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Join thousands of users who trust our platform to manage their links. 
              Start shortening your URLs for free today.
            </p>
            <SignUpButton mode="modal">
              <Button size="lg" className="text-lg px-8">
                Create Your Account
              </Button>
            </SignUpButton>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2026 Link Shortener. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
