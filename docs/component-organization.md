# Component Organization - UI Structure & Code Separation

## Overview

To keep pages clean and maintainable, **separate complex UI into logical components**. Never let page files become bloated with hundreds of lines of JSX. This application follows a strict component organization pattern.

## Core Principles

- ✅ **Extract components when pages exceed ~100 lines**
- ✅ **Organize components by type and purpose**
- ✅ **Keep page files focused on layout and data fetching**
- ✅ **Reusable components go in organized folders**
- ❌ **NO massive page files with hundreds of lines of JSX**
- ❌ **NO mixing unrelated components in the same file**
- 🎯 **Single Responsibility Principle for components**

## Folder Structure

```
components/
├── ui/                    # shadcn/ui primitives (button, card, input, etc.)
│   ├── button.tsx
│   ├── card.tsx
│   └── ...
│
├── cards/                 # Card components
│   ├── link-card.tsx
│   ├── stats-card.tsx
│   └── feature-card.tsx
│
├── forms/                 # Form components
│   ├── link-form.tsx
│   ├── edit-link-form.tsx
│   └── settings-form.tsx
│
├── layouts/               # Layout components
│   ├── header.tsx
│   ├── footer.tsx
│   ├── sidebar.tsx
│   └── dashboard-layout.tsx
│
├── sections/              # Page sections (hero, features, etc.)
│   ├── hero-section.tsx
│   ├── features-section.tsx
│   ├── pricing-section.tsx
│   └── stats-section.tsx
│
├── dashboard/             # Dashboard-specific components
│   ├── link-list.tsx
│   ├── link-table.tsx
│   ├── analytics-chart.tsx
│   └── recent-links.tsx
│
└── shared/                # Globally shared components
    ├── loading-spinner.tsx
    ├── error-message.tsx
    ├── empty-state.tsx
    └── confirmation-dialog.tsx
```

## When to Extract a Component

### ✅ Extract when:

- Page file exceeds ~100 lines
- UI element is repeated across multiple pages
- Logic is complex or self-contained
- Component has its own state management
- Testing would benefit from isolation
- Readability is improved by separation

### ❌ Keep inline when:

- Component is used only once and is very simple (<20 lines)
- Logic is tightly coupled to parent and won't be reused
- Extraction would reduce clarity

## Component Categories

### 1. UI Primitives (`/components/ui`)

**shadcn/ui components** - managed by shadcn CLI, do not manually create here.

```bash
npx shadcn@latest add button
npx shadcn@latest add card
```

### 2. Cards (`/components/cards`)

Reusable card components that display structured data.

```tsx
// components/cards/link-card.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Link } from "@/db/schema";

interface LinkCardProps {
  link: Link;
  onDelete?: (id: number) => void;
}

export function LinkCard({ link, onDelete }: LinkCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{link.shortCode}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground truncate">
          {link.originalUrl}
        </p>
        <div className="flex gap-2 mt-4">
          <Button size="sm">Copy</Button>
          {onDelete && (
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onDelete(link.id)}>
              Delete
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
```

### 3. Forms (`/components/forms`)

Form components with validation and submission logic.

```tsx
// components/forms/link-form.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createLink } from "@/actions/links";

export function LinkForm() {
  const [url, setUrl] = useState("");
  const [shortCode, setShortCode] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const result = await createLink({ originalUrl: url, shortCode });

    if (result.success) {
      setUrl("");
      setShortCode("");
    }

    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="Enter URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <Input
        placeholder="Custom short code"
        value={shortCode}
        onChange={(e) => setShortCode(e.target.value)}
      />
      <Button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create Link"}
      </Button>
    </form>
  );
}
```

### 4. Layouts (`/components/layouts`)

Structural components for page layouts.

```tsx
// components/layouts/header.tsx
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export function Header() {
  return (
    <header className="border-b">
      <div className=" mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          LinkShortener
        </Link>
        <UserButton />
      </div>
    </header>
  );
}
```

### 5. Sections (`/components/sections`)

Large page sections (hero, features, pricing, etc.).

```tsx
// components/sections/hero-section.tsx
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

export function HeroSection() {
  return (
    <section className=" mx-auto px-4 py-20 md:py-32">
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
          Transform long, complex URLs into short, memorable links.
        </p>
        <Button size="lg" className="text-lg px-8">
          Get Started Free
        </Button>
      </div>
    </section>
  );
}
```

### 6. Feature-Specific (`/components/dashboard`, `/components/[feature]`)

Components specific to a feature or route.

```tsx
// components/dashboard/link-list.tsx
import { LinkCard } from "@/components/cards/link-card";
import type { Link } from "@/db/schema";

interface LinkListProps {
  links: Link[];
}

export function LinkList({ links }: LinkListProps) {
  if (links.length === 0) {
    return <p className="text-muted-foreground">No links yet.</p>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {links.map((link) => (
        <LinkCard key={link.id} link={link} />
      ))}
    </div>
  );
}
```

### 7. Shared Utilities (`/components/shared`)

Globally reusable utility components.

```tsx
// components/shared/loading-spinner.tsx
export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );
}

// components/shared/empty-state.tsx
import { FileQuestion } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description?: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <FileQuestion className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground mt-2">{description}</p>
      )}
    </div>
  );
}
```

## Page File Pattern

Pages should be **thin** - focused on data fetching and composition.

### ❌ Bad - Bloated Page (241 lines)

```tsx
// app/page.tsx - TOO MUCH CODE
export default async function Home() {
  return (
    <div>
      <section>{/* 50 lines of hero JSX */}</section>
      <section>{/* 60 lines of features JSX */}</section>
      <section>{/* 50 lines of pricing JSX */}</section>
      <section>{/* 40 lines of CTA JSX */}</section>
      <footer>{/* 41 lines of footer JSX */}</footer>
    </div>
  );
}
```

### ✅ Good - Clean Page (~20 lines)

```tsx
// app/page.tsx - CLEAN
import { HeroSection } from "@/components/sections/hero-section";
import { FeaturesSection } from "@/components/sections/features-section";
import { PricingSection } from "@/components/sections/pricing-section";
import { CTASection } from "@/components/sections/cta-section";
import { Footer } from "@/components/layouts/footer";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <FeaturesSection />
      <PricingSection />
      <CTASection />
      <Footer />
    </div>
  );
}
```

## Naming Conventions

### File Names

- **Pattern**: `kebab-case.tsx`
- **Examples**: `link-card.tsx`, `create-link-form.tsx`, `hero-section.tsx`

### Component Names

- **Pattern**: `PascalCase`
- **Examples**: `LinkCard`, `CreateLinkForm`, `HeroSection`

### Props Interfaces

- **Pattern**: `[ComponentName]Props`
- **Example**: `interface LinkCardProps { ... }`

## Client vs Server Components

### Server Components (default)

Components that:

- Fetch data
- Don't use hooks (`useState`, `useEffect`, etc.)
- Don't have interactivity
- Don't use browser APIs

```tsx
// components/dashboard/link-list.tsx (Server Component)
import { LinkCard } from "@/components/cards/link-card";

export function LinkList({ links }: { links: Link[] }) {
  return (
    <div className="grid gap-4">
      {links.map((link) => (
        <LinkCard key={link.id} link={link} />
      ))}
    </div>
  );
}
```

### Client Components

Components that:

- Use React hooks
- Handle user interactions
- Access browser APIs
- Use event handlers

```tsx
// components/forms/link-form.tsx (Client Component)
"use client";

import { useState } from "react";

export function LinkForm() {
  const [value, setValue] = useState("");
  // ... interactive logic
}
```

## Import Organization

Organize imports in this order:

```tsx
// 1. React & Next.js
import { useState } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";

// 2. Third-party libraries
import { UserButton } from "@clerk/nextjs";

// 3. UI components
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// 4. Custom components
import { LinkCard } from "@/components/cards/link-card";
import { HeroSection } from "@/components/sections/hero-section";

// 5. Actions & utilities
import { createLink } from "@/actions/links";
import { cn } from "@/lib/utils";

// 6. Types
import type { Link } from "@/db/schema";

// 7. Icons
import { Zap, Link2 } from "lucide-react";
```

## Extraction Checklist

When extracting a component:

- [ ] Identify logical boundaries (what belongs together)
- [ ] Determine the appropriate folder based on component type
- [ ] Create file with proper naming (`kebab-case.tsx`)
- [ ] Add `"use client"` directive if needed
- [ ] Define clear prop interface
- [ ] Add proper TypeScript types
- [ ] Import in parent file
- [ ] Verify component renders correctly
- [ ] Check for any missing dependencies

## Best Practices

1. **Keep it simple** - One component, one purpose
2. **Props over configuration** - Pass data via props, not global state
3. **Composition over complexity** - Break down complex components
4. **Type everything** - Use TypeScript interfaces for all props
5. **Client directive placement** - Only mark interactive components as client
6. **Consistent naming** - Follow established patterns
7. **Logical grouping** - Organize by feature/type, not arbitrarily
8. **Avoid prop drilling** - If passing props through 3+ levels, reconsider structure
9. **Toast notifications** - ALWAYS use toast inside react-query file functions (mutation callbacks) if available, NOT directly inside components

---

**Last Updated**: January 5, 2026
**Version**: 1.0.0
