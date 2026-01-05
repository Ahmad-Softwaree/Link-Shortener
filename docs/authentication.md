# Authentication - Clerk Integration

## Overview

Authentication in this application is **exclusively handled by Clerk**. Do not implement any custom authentication logic or use alternative authentication methods.

## Core Principles

- ✅ **Use Clerk for ALL authentication**
- ❌ **NO custom auth implementation**
- ❌ **NO other auth providers or methods**
- 🔒 **All auth-related features go through Clerk**

## Route Protection

### Protected Routes

The `/dashboard` route is protected and requires authentication:

```typescript
// app/dashboard/layout.tsx or middleware.ts
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  return <>{children}</>;
}
```

### Homepage Redirect

If a user is logged in and tries to access the homepage (`/`), they should be redirected to `/dashboard`:

```typescript
// app/page.tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }

  return (
    // ... homepage content for non-authenticated users
  );
}
```

## Clerk Configuration

### Modal-Based Authentication

Sign in and sign up should **always launch as modals**, not redirect to Clerk's hosted pages.

**Implementation:**

```typescript
// Use Clerk components with modal mode
import { SignInButton, SignUpButton } from "@clerk/nextjs";

// Sign In Modal
<SignInButton mode="modal">
  <Button>Sign In</Button>
</SignInButton>

// Sign Up Modal
<SignUpButton mode="modal">
  <Button>Get Started</Button>
</SignUpButton>
```

### Environment Variables

Required Clerk environment variables (already configured):

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
```

### Dark Theme Configuration

Clerk components use the official shadcn theme integration from `@clerk/themes`:

**Step 1: Import shadcn CSS in `globals.css`**

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "@clerk/themes/shadcn.css";
```

**Step 2: Use the shadcn theme in `layout.tsx`**

```typescript
// app/layout.tsx
import { ClerkProvider } from "@clerk/nextjs";
import { shadcn } from "@clerk/themes";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: shadcn,
      }}
    >
      {/* ... */}
    </ClerkProvider>
  );
}
```

The configuration:
- Uses the **official Clerk shadcn theme** from `@clerk/themes` package
- Automatically integrates with shadcn/ui design system
- Ensures all Clerk modals (sign-in, sign-up) and components (UserButton) match the application's theme
- Minimal configuration - the theme handles all styling automatically

## Common Patterns

### Getting User Information

```typescript
// Server Component
import { auth, currentUser } from "@clerk/nextjs/server";

export default async function Component() {
  const { userId } = await auth();
  const user = await currentUser();

  // Use userId or user data
}
```

### Client Component with User

```typescript
"use client";
import { useUser } from "@clerk/nextjs";

export function ClientComponent() {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded) return <div>Loading...</div>;
  if (!isSignedIn) return <div>Not signed in</div>;

  return <div>Hello {user.firstName}!</div>;
}
```

### Sign Out

```typescript
import { SignOutButton } from "@clerk/nextjs";

<SignOutButton>
  <Button>Sign Out</Button>
</SignOutButton>;
```

## Middleware (Optional)

For app-wide protection, use Clerk middleware:

```typescript
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
```

## Database Integration

### Sync User ID with Database

Store Clerk's `userId` in your database schema:

```typescript
// db/schema.ts
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey(), // Clerk userId
  email: text("email").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

### Webhooks (if needed)

Use Clerk webhooks to sync user data to your database on user creation/update/deletion.

## Best Practices

1. **Always use Server Components** for auth checks when possible
2. **Use `mode="modal"`** for SignInButton and SignUpButton
3. **Protect routes** at the layout or page level
4. **Never implement custom auth** - leverage Clerk's features
5. **Use Clerk's components** (`<UserButton />`, `<SignInButton />`, etc.)
6. **Store only userId** in your database, fetch full user data from Clerk when needed

## Component Examples

### Header with Authentication

```typescript
import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

export async function Header() {
  const { userId } = await auth();

  return (
    <header>
      {userId ? (
        <UserButton afterSignOutUrl="/" />
      ) : (
        <>
          <SignInButton mode="modal">
            <Button>Sign In</Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button>Sign Up</Button>
          </SignUpButton>
        </>
      )}
    </header>
  );
}
```

## Summary

- 🔐 **Clerk only** - no custom auth
- 🏠 Homepage → redirects logged-in users to `/dashboard`
- 🔒 `/dashboard` → requires authentication
- 🪟 Auth modals - use `mode="modal"` for sign in/up
- 🎯 Server-first - use Server Components for auth checks

---

**Last Updated**: January 4, 2026
