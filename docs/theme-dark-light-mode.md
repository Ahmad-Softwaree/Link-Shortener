# Dark/Light Mode & Theming

**⚠️ CRITICAL: READ BEFORE IMPLEMENTING THEME FEATURES**

This document outlines the dark/light mode implementation and theming standards using **next-themes** in this project.

## 📋 Overview

This project uses **next-themes** for seamless dark/light mode switching with:

- System preference detection
- Cookie-based persistence
- Class-based theme switching
- CSS variable theming
- Custom scrollbar styling per theme
- shadcn/ui theme integration

## 🏗️ Architecture

### Core Components

1. **ThemeProvider** - Context provider wrapping the app
2. **ModeToggle** - UI component for theme switching
3. **CSS Variables** - Theme-specific color definitions
4. **Cookie Storage** - Persistent theme preference

## 🎨 Theme Provider Setup

**File**: `providers/theme-provider.tsx`

```typescript
"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useEffect, useState } from "react";
import { getCookie } from "@/lib/config/cookie.config";
import type { ComponentProps } from "react";

export function ThemeProvider({
  children,
  ...props
}: ComponentProps<typeof NextThemesProvider>) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = getCookie("theme");
    if (savedTheme && (savedTheme === "dark" || savedTheme === "light")) {
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    }
  }, []);

  if (!mounted) {
    return null;
  }

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
```

**Key Features**:

- Prevents hydration mismatch with `mounted` state
- Reads theme from cookie on mount
- Applies theme class to `documentElement`
- Wraps `next-themes` provider

### Root Layout Integration

**File**: `app/layout.tsx`

```typescript
import { ThemeProvider } from "@/providers/theme-provider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

**Configuration**:

- `attribute="class"` - Uses class-based theme switching (`.dark`)
- `defaultTheme="dark"` - Default theme on first visit
- `enableSystem` - Respects system preferences
- `disableTransitionOnChange` - Prevents CSS transition flicker

**⚠️ IMPORTANT**: Set initial `className="dark"` on `<html>` to match default theme.

## 🔘 Mode Toggle Component

**File**: `components/mode-toggle.tsx`

```typescript
"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { setCookie } from "@/lib/config/cookie.config";
import { useEffect } from "react";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (theme) {
      setCookie("theme", theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    setCookie("theme", newTheme);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="hover:bg-violet-50 dark:hover:bg-violet-950/30 transition-colors">
      {theme === "dark" ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
    </Button>
  );
}
```

**Pattern**:

1. Use `useTheme()` hook from next-themes
2. Save theme to cookie on every change
3. Toggle between dark/light (no "system" option in UI)
4. Use theme-specific hover states
5. Icons change based on current theme

## 🎨 CSS Variables & Theming

### Color Definitions

**File**: `app/globals.css`

```css
:root {
  --radius: 0.5rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.15 0.005 285.885);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.15 0.005 285.885);
  --primary: oklch(0.491 0.162 285.885);
  --primary-foreground: oklch(0.988 0 0);
  /* ... more variables */
}

.dark {
  --background: oklch(0.15 0.005 285.885);
  --foreground: oklch(0.988 0 0);
  --card: oklch(0.15 0.005 285.885);
  --card-foreground: oklch(0.988 0 0);
  --primary: oklch(0.673 0.142 285.885);
  --primary-foreground: oklch(0.15 0.005 285.885);
  /* ... more variables */
}
```

**Key Principles**:

- Use **OKLCH** color format for better color perception
- Define all colors as CSS variables in `:root`
- Override variables in `.dark` class
- Never hardcode colors in components
- Use Tailwind utilities that reference CSS variables

### Standard CSS Variables

Required variables for shadcn/ui compatibility:

| Variable               | Purpose           | Example (Light)              | Example (Dark)               |
| ---------------------- | ----------------- | ---------------------------- | ---------------------------- |
| `--background`         | Page background   | `oklch(1 0 0)`               | `oklch(0.15 0.005 285.885)`  |
| `--foreground`         | Text color        | `oklch(0.15 0.005 285.885)`  | `oklch(0.988 0 0)`           |
| `--card`               | Card background   | `oklch(1 0 0)`               | `oklch(0.15 0.005 285.885)`  |
| `--card-foreground`    | Card text         | `oklch(0.15 0.005 285.885)`  | `oklch(0.988 0 0)`           |
| `--primary`            | Primary color     | `oklch(0.491 0.162 285.885)` | `oklch(0.673 0.142 285.885)` |
| `--primary-foreground` | Primary text      | `oklch(0.988 0 0)`           | `oklch(0.15 0.005 285.885)`  |
| `--muted`              | Muted backgrounds | `oklch(0.961 0.005 285.885)` | `oklch(0.243 0.005 285.885)` |
| `--muted-foreground`   | Muted text        | `oklch(0.531 0.016 285.885)` | `oklch(0.635 0.016 285.885)` |
| `--border`             | Border color      | `oklch(0.914 0.005 285.885)` | `oklch(1 0 0 / 10%)`         |
| `--input`              | Input border      | `oklch(0.914 0.005 285.885)` | `oklch(1 0 0 / 15%)`         |
| `--ring`               | Focus ring        | `oklch(0.491 0.162 285.885)` | `oklch(0.556 0 0)`           |

## 🖱️ Custom Scrollbar Styling

**File**: `app/globals.css`

```css
/* Light Mode Scrollbar */
:root {
  scrollbar-width: thin;
  scrollbar-color: #7c3aed #f5f3ff;
}

::-webkit-scrollbar {
  width: 12px;
  height: 12px;
}

::-webkit-scrollbar-track {
  background: #f5f3ff;
}

::-webkit-scrollbar-thumb {
  background: #7c3aed;
  border-radius: 6px;
  border: 3px solid #f5f3ff;
}

::-webkit-scrollbar-thumb:hover {
  background: #6d28d9;
}

::-webkit-scrollbar-thumb:active {
  background: #5b21b6;
}

/* Dark Mode Scrollbar */
.dark {
  scrollbar-width: thin;
  scrollbar-color: #a78bfa #27272a;
}

.dark ::-webkit-scrollbar-track {
  background: #27272a;
}

.dark ::-webkit-scrollbar-thumb {
  background: #a78bfa;
  border-radius: 6px;
  border: 3px solid #27272a;
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: #c4b5fd;
}

.dark ::-webkit-scrollbar-thumb:active {
  background: #ddd6fe;
}
```

**Pattern**:

- Style both Firefox (`scrollbar-width`, `scrollbar-color`) and WebKit
- Match scrollbar colors to theme
- Provide hover and active states
- Use border to create padding effect

## 🍪 Cookie Persistence

**Pattern**: Theme preference is saved to cookies

```typescript
import { setCookie, getCookie } from "@/lib/config/cookie.config";

// Save theme
setCookie("theme", "dark");

// Read theme
const savedTheme = getCookie("theme");
```

**Configuration**:

- Cookie name: `"theme"`
- Values: `"dark"` | `"light"` | `"system"`
- Expiry: 365 days (default from `cookie.config.ts`)

## 🎨 Using Theme in Components

### Theme-Aware Styling

**Use Tailwind's `dark:` variant**:

```tsx
<div className="bg-white dark:bg-slate-900">
  <h1 className="text-gray-900 dark:text-white">Hello</h1>
  <Button className="hover:bg-violet-50 dark:hover:bg-violet-950/30">
    Click me
  </Button>
</div>
```

**Key Principles**:

- Always provide both light and dark variants
- Use `dark:` prefix for dark mode styles
- Prefer Tailwind utilities over inline styles
- Use opacity modifiers (`/30`, `/50`) for subtle effects

### Accessing Current Theme

**Use the `useTheme` hook**:

```typescript
"use client";

import { useTheme } from "next-themes";

export function MyComponent() {
  const { theme, setTheme, systemTheme } = useTheme();

  // Current theme ("light" | "dark" | "system")
  const currentTheme = theme;

  // Resolved theme (accounts for system preference)
  const resolvedTheme = theme === "system" ? systemTheme : theme;

  return <div>Current theme: {resolvedTheme}</div>;
}
```

**Available Properties**:

- `theme` - Current theme setting
- `setTheme(theme)` - Change theme
- `systemTheme` - System preference
- `themes` - Available themes
- `forcedTheme` - Forced theme (if set)

### Preventing Flash of Unstyled Content (FOUC)

**Pattern**: Return `null` until mounted

```typescript
"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export function ThemeAwareComponent() {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // or return a skeleton
  }

  return <div>Theme: {theme}</div>;
}
```

## 🔧 Clerk Theme Integration

**Pattern**: Use Clerk's shadcn theme

```typescript
import { ClerkProvider } from "@clerk/nextjs";
import { shadcn } from "@clerk/themes";

<ClerkProvider
  appearance={{
    baseTheme: shadcn,
  }}>
  {children}
</ClerkProvider>;
```

**⚠️ IMPORTANT**: Import shadcn theme CSS in `globals.css`:

```css
@import "@clerk/themes/shadcn.css";
```

This ensures Clerk components match the app's theme automatically.

## 📋 Best Practices

### ✅ DO

- ✅ Use CSS variables for all colors
- ✅ Provide both light and dark variants for all custom styles
- ✅ Save theme preference to cookies
- ✅ Use `dark:` variant for conditional styling
- ✅ Prevent FOUC with mounted state check
- ✅ Set default theme in both `<html className>` and `ThemeProvider`
- ✅ Use OKLCH for better color consistency across themes
- ✅ Test all components in both themes
- ✅ Style scrollbars for each theme

### ❌ DON'T

- ❌ Don't hardcode colors (use CSS variables)
- ❌ Don't forget to add dark mode styles
- ❌ Don't render theme-dependent content before mount
- ❌ Don't use RGB/HEX directly (use OKLCH via CSS variables)
- ❌ Don't forget to update cookies when theme changes
- ❌ Don't mix class-based and data-attribute approaches
- ❌ Don't ignore system preferences (keep `enableSystem`)
- ❌ Don't use transitions on theme change (causes flicker)

## 🚀 Adding a New Color

1. **Define in `:root`** (light mode):

   ```css
   :root {
     --my-color: oklch(0.5 0.15 285);
   }
   ```

2. **Override in `.dark`** (dark mode):

   ```css
   .dark {
     --my-color: oklch(0.7 0.15 285);
   }
   ```

3. **Add to Tailwind config** (if needed):

   ```javascript
   // tailwind.config.ts
   colors: {
     'my-color': 'var(--my-color)',
   }
   ```

4. **Use in components**:
   ```tsx
   <div className="bg-my-color text-my-color-foreground">Content</div>
   ```

## 🎯 Common Patterns

### Gradient with Theme Support

```tsx
<div
  className="bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 
                dark:from-violet-950/50 dark:via-purple-950/50 dark:to-indigo-950/50">
  Content
</div>
```

### Conditional Icon

```tsx
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

const { theme } = useTheme();

{
  theme === "dark" ? <Moon /> : <Sun />;
}
```

### Card with Theme Styling

```tsx
<Card
  className="border-violet-200 dark:border-violet-800 
                 bg-white dark:bg-slate-900">
  <CardContent>
    <p className="text-gray-900 dark:text-white">Content</p>
  </CardContent>
</Card>
```

## 📦 Required Packages

```json
{
  "dependencies": {
    "next-themes": "latest"
  }
}
```

Install with: `bun add next-themes`

## 🔍 Debugging Theme Issues

### Check Current Theme

```tsx
const { theme, resolvedTheme, systemTheme } = useTheme();
console.log({ theme, resolvedTheme, systemTheme });
```

### Check Cookie

```tsx
import { getCookie } from "@/lib/config/cookie.config";
console.log("Saved theme:", getCookie("theme"));
```

### Check DOM

```javascript
console.log("HTML class:", document.documentElement.className);
```

---

**Version**: 1.0.0  
**Last Updated**: January 6, 2026
