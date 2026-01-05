# Agent Instructions - Link Shortener Project

> **⚠️ CRITICAL: READ BEFORE CODING**  
> **ALL LLM agents MUST read the relevant instruction files from the `/docs` directory BEFORE generating ANY code.**  
> **This is not optional. Failure to follow the documented patterns will result in inconsistent, non-compliant code.**

This file contains references to all agent instruction documents for this project. LLM agents should follow these coding standards and best practices when working on this codebase.

## 📋 Overview

This is a **Link Shortener** application built with:

- **Next.js 16** (App Router)
- **React 19**
- **TypeScript 5**
- **Tailwind CSS 4**
- **Drizzle ORM** with PostgreSQL (Neon)
- **Clerk** for authentication
- **shadcn/ui** components (New York style)

## 📚 Instruction Documents

**🚨 MANDATORY READING:** All detailed agent instructions are organized in the `/docs` directory.  
**YOU MUST read the relevant instruction file(s) BEFORE generating any code.**  
These documents define required patterns, conventions, and standards for this codebase:

### 🔐 Authentication

- **[Authentication (Clerk)](docs/authentication.md)** - Clerk integration, route protection, modal auth, and user management

### 🎨 UI & Components

- **[UI Components (shadcn/ui)](docs/ui-components.md)** - shadcn/ui usage, component patterns, and styling guidelines

## 🎯 Quick Reference

### Key Principles

- **TypeScript First**: Use strict TypeScript with proper types
- **Server Components by Default**: Use `"use client"` only when necessary
- **Type Safety**: Leverage Drizzle ORM for type-safe database operations
- **Component Composition**: Build reusable, composable UI components
- **Accessibility**: Follow ARIA standards and semantic HTML
- **Performance**: Optimize with Next.js features (caching, streaming, etc.)
- **⚠️ NEVER Use middleware.ts**: The `middleware.ts` pattern is deprecated in Next.js 16. Use `proxy.ts` instead for any middleware-like functionality
- **🔐 Clerk Standard Patterns**: ALWAYS use Clerk's standard methods for handling auth routes and redirects in the newest version. Follow official Clerk documentation for route protection and authentication flows

### Common Patterns

```typescript
// Path alias usage
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { db } from "@/db";

// Server Component (default)
export default async function Page() {
  const data = await db.query.users.findMany();
  return <div>{/* ... */}</div>;
}

// Client Component (when needed)
("use client");
export function InteractiveComponent() {
  const [state, setState] = useState();
  return <div>{/* ... */}</div>;
}
```

### Environment Variables

- `DATABASE_URL` - Neon PostgreSQL connection string
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk public key
- `CLERK_SECRET_KEY` - Clerk secret key

## 🚀 Development Commands

```bash
# Development server
npm run dev

# Build for production
npm run build

# Run production server
npm run start

# Lint code
npm run lint

# Database migrations
npx drizzle-kit generate
npx drizzle-kit migrate
npx drizzle-kit studio
```

## 📖 Reading Instructions

**⚠️ CRITICAL WORKFLOW - Follow this EVERY TIME:**

Before making ANY changes to this codebase:

1. **STOP** - Identify which instruction document(s) from `/docs` are relevant to your task
2. **READ** - Open and read the entire relevant instruction document(s) thoroughly
3. **UNDERSTAND** - Ensure you understand the tech stack, patterns, and conventions in use
4. **IMPLEMENT** - Write code that follows the documented standards consistently
5. **VERIFY** - Double-check your code matches the documented patterns
6. **ASK** - If instructions conflict or are unclear, ask for clarification before proceeding

**Never skip step 2.** Reading the documentation is not optional - it is mandatory for every code generation task.

## ✨ Contributing

When adding new features or modifying existing code:

- Follow the coding standards in the instruction documents
- Maintain consistency with existing patterns
- Update documentation when adding new patterns or conventions
- Consider accessibility, performance, and maintainability

---

**Last Updated**: January 4, 2026
**Version**: 1.0.0
