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

### 🗄️ Data Fetching & Database

- **[Data Fetching (Server Actions)](docs/data-fetching.md)** - Server Actions patterns, database queries, Drizzle ORM usage, and file organization
- **[Actions & Queries Architecture](docs/actions-queries.md)** - Generic CRUD actions, TanStack Query hooks, toast handling, and soft delete patterns
- **[URL Parameter Handling (nuqs)](docs/url-parameters.md)** - URL state management with nuqs for search, filters, pagination, and data fetching

### 📦 Package Management & Tooling

- **[Package Management & Tooling Standards](docs/package-management.md)** - Bun usage, dependency management, latest package versions, and development commands

### 🎨 UI & Components

- **[UI Components (shadcn/ui)](docs/ui-components.md)** - shadcn/ui usage, component patterns, and styling guidelines
- **[Component Organization](docs/component-organization.md)** - Component structure, code separation, and file organization
- **[Forms & Validation](docs/forms-validation.md)** - Form handling with react-hook-form, Zod validation, and form patterns
- **[Pagination](docs/pagination.md)** - Pagination patterns, infinite scroll, TanStack Table for tables, and card-based displays

### 📝 Documentation & Standards

- **[Documentation Standards](docs/documentation-standards.md)** - File organization, markdown standards, and documentation structure (⚠️ CRITICAL: Never create .md files in root)

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
- **📦 Bun Only**: ALWAYS use Bun for package management and script execution. NEVER use npm, yarn, or pnpm
- **🆕 Latest Versions**: ALWAYS install and update to the latest stable package versions unless there's a specific compatibility requirement
- **🚫 NEVER Write Comments**: Do NOT add comments to code. Code should be self-documenting with clear naming and structure. Comments clutter the codebase and become outdated

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

**⚠️ IMPORTANT: This project uses BUN exclusively. NEVER use npm, yarn, or pnpm.**

```bash
# Development server
bun run dev

# Build for production
bun run build

# Run production server
bun run start

# Lint code
bun run lint

# Package management
bun install                    # Install dependencies
bun add <package>              # Add new package (always latest version)
bun update                     # Update all packages

# Database migrations
bunx drizzle-kit generate
bunx drizzle-kit migrate
bunx drizzle-kit studio
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

---6, 2026
**Version**: 1.1
**Last Updated**: January 4, 2026
**Version**: 1.0.0
