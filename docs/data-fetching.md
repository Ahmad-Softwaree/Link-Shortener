# Data Fetching - Server Actions & Database Queries

## Overview

All data-fetching logic in this application is organized using **Next.js Server Actions** and follows a strict separation of concerns pattern. Database operations use **Drizzle ORM** with type-safe queries.

## Core Principles

- ✅ **Use Server Actions for all data mutations and fetching**
- ✅ **One file per database table in the `/actions` folder**
- ✅ **Type-safe queries with Drizzle ORM**
- ✅ **Server Components can query database directly when read-only**
- ❌ **NO client-side database queries**
- ❌ **NO mixing multiple table operations in one file**
- 🔒 **Always validate user authentication before database operations**

## Folder Structure

```
actions/
├── links.ts          # All link-related operations
└── [table-name].ts   # One file per database table
```

**🚨 MANDATORY:** Create a separate file in `/actions` for each database table. Keep all queries for a specific table in its corresponding file.

## Naming Conventions

### File Names

- **Pattern**: `[table-name].ts` (singular or plural matching your schema)
- **Example**: `links.ts` for the `links` table

### Function Names

- **Pattern**: `[verb][TableName][Detail]`
- **Examples**:
  - `createLink`
  - `getLinkByShortCode`
  - `getUserLinks`
  - `updateLink`
  - `deleteLink`
  - `getLinkAnalytics`

## Standard Patterns

### Server Action File Template

```typescript
"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { links } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// ============================================
// CREATE Operations
// ============================================

export async function createLink(data: {
  originalUrl: string;
  shortCode: string;
}) {
  // 1. Authenticate
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  // 2. Validate input
  if (!data.originalUrl || !data.shortCode) {
    throw new Error("Missing required fields");
  }

  // 3. Perform database operation
  try {
    const [newLink] = await db
      .insert(links)
      .values({
        originalUrl: data.originalUrl,
        shortCode: data.shortCode,
        userId,
      })
      .returning();

    // 4. Revalidate cache if needed
    revalidatePath("/dashboard");

    return { success: true, data: newLink };
  } catch (error) {
    console.error("Failed to create link:", error);
    return { success: false, error: "Failed to create link" };
  }
}

// ============================================
// READ Operations
// ============================================

export async function getUserLinks() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const userLinks = await db
      .select()
      .from(links)
      .where(eq(links.userId, userId))
      .orderBy(desc(links.createdAt));

    return { success: true, data: userLinks };
  } catch (error) {
    console.error("Failed to fetch links:", error);
    return { success: false, error: "Failed to fetch links", data: [] };
  }
}

export async function getLinkByShortCode(shortCode: string) {
  try {
    const [link] = await db
      .select()
      .from(links)
      .where(eq(links.shortCode, shortCode))
      .limit(1);

    if (!link) {
      return { success: false, error: "Link not found" };
    }

    return { success: true, data: link };
  } catch (error) {
    console.error("Failed to fetch link:", error);
    return { success: false, error: "Failed to fetch link" };
  }
}

export async function getLinkById(id: number) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const [link] = await db
      .select()
      .from(links)
      .where(and(eq(links.id, id), eq(links.userId, userId)))
      .limit(1);

    if (!link) {
      return { success: false, error: "Link not found" };
    }

    return { success: true, data: link };
  } catch (error) {
    console.error("Failed to fetch link:", error);
    return { success: false, error: "Failed to fetch link" };
  }
}

// ============================================
// UPDATE Operations
// ============================================

export async function updateLink(
  id: number,
  data: { originalUrl?: string; shortCode?: string }
) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const [updatedLink] = await db
      .update(links)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(and(eq(links.id, id), eq(links.userId, userId)))
      .returning();

    if (!updatedLink) {
      return { success: false, error: "Link not found or unauthorized" };
    }

    revalidatePath("/dashboard");
    return { success: true, data: updatedLink };
  } catch (error) {
    console.error("Failed to update link:", error);
    return { success: false, error: "Failed to update link" };
  }
}

// ============================================
// DELETE Operations
// ============================================

export async function deleteLink(id: number) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const [deletedLink] = await db
      .delete(links)
      .where(and(eq(links.id, id), eq(links.userId, userId)))
      .returning();

    if (!deletedLink) {
      return { success: false, error: "Link not found or unauthorized" };
    }

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete link:", error);
    return { success: false, error: "Failed to delete link" };
  }
}
```

## Response Pattern

All server actions should return a consistent response format:

```typescript
// Success response
{
  success: true,
  data: T // The returned data
}

// Error response
{
  success: false,
  error: string // Error message
}
```

## Authentication Rules

### ✅ Always Require Auth For:

- CREATE operations
- UPDATE operations
- DELETE operations
- Fetching user-specific data

### ⚠️ Optional Auth For:

- Public read operations (e.g., fetching a link by short code for redirect)
- Analytics that don't expose sensitive data

### Authentication Pattern

```typescript
const { userId } = await auth();
if (!userId) {
  throw new Error("Unauthorized");
  // OR redirect("/") depending on context
}
```

## Direct Database Queries in Server Components

For **read-only** operations in Server Components, you can query the database directly:

```typescript
// app/dashboard/page.tsx
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { links } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/");

  // Direct query in Server Component (read-only)
  const userLinks = await db
    .select()
    .from(links)
    .where(eq(links.userId, userId));

  return <div>{/* Render links */}</div>;
}
```

**Use Server Actions when you need:**

- Data mutations (create, update, delete)
- Revalidation or cache invalidation
- To call from Client Components
- Complex business logic

## Cache Revalidation

Use `revalidatePath` after mutations to ensure fresh data:

```typescript
import { revalidatePath } from "next/cache";

// After mutation
revalidatePath("/dashboard"); // Revalidate specific path
revalidatePath("/dashboard", "layout"); // Revalidate layout
```

## Error Handling

```typescript
try {
  // Database operation
  const result = await db.insert(table).values(data);
  return { success: true, data: result };
} catch (error) {
  console.error("Operation failed:", error);

  // Check for specific database errors
  if (error.code === "23505") {
    return { success: false, error: "Duplicate entry" };
  }

  return { success: false, error: "Operation failed" };
}
```

## Drizzle ORM Query Patterns

### Basic Queries

```typescript
// SELECT all
await db.select().from(links);

// SELECT with WHERE
await db.select().from(links).where(eq(links.userId, userId));

// SELECT with multiple conditions
await db
  .select()
  .from(links)
  .where(and(eq(links.userId, userId), eq(links.id, id)));

// SELECT with ORDER BY
await db.select().from(links).orderBy(desc(links.createdAt));

// SELECT with LIMIT
await db.select().from(links).limit(10);
```

### Mutations

```typescript
// INSERT
await db.insert(links).values({ originalUrl, shortCode, userId });

// INSERT with RETURNING
const [newLink] = await db
  .insert(links)
  .values({ originalUrl, shortCode, userId })
  .returning();

// UPDATE
await db.update(links).set({ originalUrl: newUrl }).where(eq(links.id, id));

// DELETE
await db.delete(links).where(eq(links.id, id));
```

## File Organization Checklist

When adding a new database table:

- [ ] Create new file in `/actions/[table-name].ts`
- [ ] Add `"use server";` directive at the top
- [ ] Import necessary dependencies (`db`, schema, Drizzle operators)
- [ ] Implement CRUD operations as needed
- [ ] Add proper authentication checks
- [ ] Return consistent response format
- [ ] Add error handling
- [ ] Include cache revalidation where appropriate
- [ ] Export all functions

## Type Safety

Leverage Drizzle's type inference:

```typescript
import type { Link, NewLink } from "@/db/schema";

// Use inferred types
export async function createLink(data: NewLink) {
  // TypeScript knows the exact shape of NewLink
}

// Function return types
export async function getLink(id: number): Promise<{
  success: boolean;
  data?: Link;
  error?: string;
}> {
  // ...
}
```

## Common Drizzle Operators

```typescript
import {
  eq, // Equal: eq(column, value)
  ne, // Not equal: ne(column, value)
  gt, // Greater than: gt(column, value)
  gte, // Greater than or equal: gte(column, value)
  lt, // Less than: lt(column, value)
  lte, // Less than or equal: lte(column, value)
  and, // AND: and(condition1, condition2)
  or, // OR: or(condition1, condition2)
  not, // NOT: not(condition)
  like, // LIKE: like(column, pattern)
  ilike, // ILIKE (case-insensitive): ilike(column, pattern)
  inArray, // IN: inArray(column, [value1, value2])
  isNull, // IS NULL: isNull(column)
  isNotNull, // IS NOT NULL: isNotNull(column)
  desc, // Descending order: orderBy(desc(column))
  asc, // Ascending order: orderBy(asc(column))
} from "drizzle-orm";
```

## Best Practices

1. **One file per table** - Keep all queries for a table in one place
2. **Consistent naming** - Follow the verb + TableName pattern
3. **Type safety** - Use Drizzle's inferred types
4. **Auth first** - Always check authentication before database operations
5. **Error handling** - Wrap operations in try-catch blocks
6. **Response consistency** - Always return `{ success, data?, error? }`
7. **Cache management** - Revalidate paths after mutations
8. **Import organization** - Group imports logically (auth, db, operators, Next.js)

---

**Last Updated**: January 5, 2026
**Version**: 1.0.0
