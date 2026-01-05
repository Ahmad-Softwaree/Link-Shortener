import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Link Shortener - Shorten Your Links, Amplify Your Reach",
  description: "Transform long, complex URLs into short, memorable links. Track performance, manage your links, and grow your online presence with our powerful link shortener.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        elements: {
          formButtonPrimary:
            "bg-primary text-primary-foreground hover:bg-primary/90",
          card: "bg-card text-card-foreground border-border",
          headerTitle: "text-foreground",
          headerSubtitle: "text-muted-foreground",
          socialButtonsBlockButton:
            "bg-secondary text-secondary-foreground hover:bg-secondary/90 border border-input",
          socialButtonsBlockButtonText: "text-secondary-foreground",
          formFieldLabel: "text-foreground",
          formFieldInput:
            "bg-background text-foreground border-input focus:ring-ring",
          footerActionLink: "text-primary hover:text-primary/90",
          identityPreviewText: "text-foreground",
          identityPreviewEditButton: "text-primary",
          formFieldInputShowPasswordButton: "text-muted-foreground hover:text-foreground",
          formHeaderTitle: "text-foreground",
          formHeaderSubtitle: "text-muted-foreground",
          formResendCodeLink: "text-primary hover:text-primary/90",
          identityPreviewEditButtonIcon: "text-primary",
          formFieldAction: "text-primary hover:text-primary/90",
          footerActionText: "text-muted-foreground",
          otpCodeFieldInput: "bg-background text-foreground border-input",
          formFieldSuccessText: "text-foreground",
        },
      }}
    >
      <html lang="en" className="dark">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <header className="flex justify-between items-center p-4 border-b">
            <div className="font-bold text-xl">Link Shortener</div>
            <div className="flex gap-4 items-center">
              <SignedOut>
                <SignInButton mode="modal">
                  <Button variant="ghost">Sign In</Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button>Sign Up</Button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </header>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
