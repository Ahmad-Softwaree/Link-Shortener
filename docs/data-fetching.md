# Data Fetching - React Query with Server Actions & Database Queries

## Overview

All data-fetching logic in this application is organized using **React Query (TanStack Query)** on the client side, with **Next.js Server Actions** on the server side. Database operations use **Drizzle ORM** with type-safe queries.

## Core Principles

- ✅ **Use React Query hooks for all client-side data operations**
- ✅ **Use Server Actions for all database operations**
- ✅ **One action file per database table in `/actions`**
- ✅ **One query file per database table in `/queries`**
- ✅ **Centralized query keys in `/lib/query-keys.ts`**
- ✅ **Toast notifications at mutation/query level, NOT in components**
- ✅ **Type-safe queries with Drizzle ORM**
- ❌ **NO client-side database queries**
- ❌ **NO mixing multiple table operations in one file**
- ❌ **NO toast in components - use mutation callbacks**
- 🔒 **Always validate user authentication before database operations**

## Folder Structure

```
lib/
├── query-keys.ts        # Centralized query keys for all resources

actions/
├── links.ts             # Server actions for link operations
└── [table-name].ts      # One file per database table

queries/
├── links.ts             # React Query hooks for links
└── [table-name].ts      # One file per database table

components/
└── providers/
    └── query-provider.tsx  # QueryClientProvider wrapper
```

**🚨 MANDATORY:** For every table in your database:

1. Create a server action file in `/actions/[table-name].ts`
2. Create a React Query hooks file in `/queries/[table-name].ts`
3. Add query keys in `/lib/query-keys.ts`

## Architecture Pattern

```
Component → Query Hook → Server Action → Database
     ↓           ↓            ↓            ↓
  Render    React Query    Drizzle ORM   PostgreSQL

Toast notifications are handled in Query Hooks (mutation callbacks)
```

## Naming Conventions

### Server Action Files (`/actions`)

- **File Pattern**: `[table-name].ts` (singular or plural matching your schema)
- **Example**: `links.ts` for the `links` table
- **Function Pattern**: `[verb][TableName][Detail]`
- **Examples**:
  - `createLink`
  - `getLinkByShortCode`
  - `getUserLinks`
  - `updateLink`
  - `deleteLink`

### React Query Files (`/queries`)

- **File Pattern**: `[table-name].ts` (matching the action file)
- **Example**: `links.ts` for link queries
- **Hook Pattern**: `use[Verb][TableName][Detail]`
- **Examples**:
  - `useGetUserLinks` - Query hook for fetching
  - `useGetLinkById` - Query hook with parameters
  - `useCreateLink` - Mutation hook for creating
  - `useUpdateLink` - Mutation hook for updating
  - `useDeleteLink` - Mutation hook for deleting

### Query Keys (`/lib/query-keys.ts`)

- **Pattern**: Hierarchical structure with resource grouping
- **Example**: `queryKeys.links.userLinks()`, `queryKeys.links.detail(id)`

## Step 1: Query Keys (`/lib/query-keys.ts`)

**🚨 CRITICAL:** All query keys must be centralized in this file.

```typescript
/**
 * Centralized Query Keys for React Query
 *
 * Pattern: [resource, ...filters/identifiers]
 */

export const queryKeys = {
  // Links queries
  links: {
    all: ["links"] as const,
    lists: () => [...queryKeys.links.all, "list"] as const,
    list: (filters: Record<string, unknown>) =>
      [...queryKeys.links.lists(), filters] as const,
    details: () => [...queryKeys.links.all, "detail"] as const,
    detail: (id: number) => [...queryKeys.links.details(), id] as const,
    byShortCode: (shortCode: string) =>
      [...queryKeys.links.all, "short-code", shortCode] as const,
    userLinks: () => [...queryKeys.links.all, "user"] as const,
  },

  // Add more resources as needed
  analytics: {
    all: ["analytics"] as const,
    byLink: (linkId: number) =>
      [...queryKeys.analytics.all, "link", linkId] as const,
  },
} as const;
```

### Query Key Best Practices

- **Hierarchical structure** - Organize from general to specific
- **Type safety** - Use `as const` for type inference
- **Consistency** - Follow the same pattern for all resources
- **Invalidation** - Easy to invalidate at any level

## Step 2: Server Actions (`/actions/links.ts`)

Server actions handle all database operations. They return a consistent response format.

```typescript
"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { links } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

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

    // 4. Revalidate cache
    revalidatePath("/dashboard");

    return { success: true, data: newLink };
  } catch (error) {
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
    return { success: false, error: "Failed to fetch links", data: [] };
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
    return { success: false, error: "Failed to delete link" };
  }
}
```

### Server Action Response Pattern

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

## Step 3: React Query Hooks (`/queries/links.ts`)

**🚨 CRITICAL:** Toast notifications are handled HERE, not in components.

```typescript
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createLink,
  getUserLinks,
  getLinkById,
  updateLink,
  deleteLink,
} from "@/actions/links";
import { queryKeys } from "@/lib/query-keys";

// ============================================
// QUERY Hooks (READ Operations)
// ============================================

/**
 * Hook to fetch all user links
 */
export function useGetUserLinks() {
  return useQuery({
    queryKey: queryKeys.links.userLinks(),
    queryFn: async () => {
      const result = await getUserLinks();
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
  });
}

/**
 * Hook to fetch a link by ID
 */
export function useGetLinkById(id: number, enabled = true) {
  return useQuery({
    queryKey: queryKeys.links.detail(id),
    queryFn: async () => {
      const result = await getLinkById(id);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    enabled,
  });
}

// ============================================
// MUTATION Hooks (CREATE, UPDATE, DELETE)
// ============================================

/**
 * Hook to create a new link
 * 🔔 Toast notifications are handled at the mutation level
 */
export function useCreateLink() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { originalUrl: string; shortCode: string }) => {
      const result = await createLink(data);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: (data) => {
      // Invalidate and refetch user links
      queryClient.invalidateQueries({ queryKey: queryKeys.links.userLinks() });
      // 🔔 Show success toast HERE
      toast.success("Link created successfully");
    },
    onError: (error: Error) => {
      // 🔔 Show error toast HERE
      toast.error(error.message || "Failed to create link");
    },
  });
}

/**
 * Hook to update an existing link
 * 🔔 Toast notifications are handled at the mutation level
 */
export function useUpdateLink() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: { originalUrl?: string; shortCode?: string };
    }) => {
      const result = await updateLink(id, data);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.links.detail(data.id),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.links.userLinks() });
      // 🔔 Toast HERE
      toast.success("Link updated successfully");
    },
    onError: (error: Error) => {
      // 🔔 Toast HERE
      toast.error(error.message || "Failed to update link");
    },
  });
}

/**
 * Hook to delete a link
 * 🔔 Toast notifications are handled at the mutation level
 */
export function useDeleteLink() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const result = await deleteLink(id);
      if (!result.success) {
        throw new Error(result.error);
      }
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.links.userLinks() });
      // 🔔 Toast HERE
      toast.success("Link deleted successfully");
    },
    onError: (error: Error) => {
      // 🔔 Toast HERE
      toast.error(error.message || "Failed to delete link");
    },
  });
}
```

### Toast Notification Rules

**✅ DO:**

- Show toast in mutation `onSuccess` callback
- Show toast in mutation `onError` callback
- Keep toast messages in query/mutation hooks

**❌ DON'T:**

- Show toast directly in components
- Duplicate toast logic across components
- Handle toast in server actions

## Step 4: Query Provider Setup

### Create Provider (`/components/providers/query-provider.tsx`)

```typescript
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            gcTime: 5 * 60 * 1000, // 5 minutes
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

### Add to Layout (`/app/layout.tsx`)

```typescript
import { QueryProvider } from "@/components/providers/query-provider";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
```

## Step 5: Using Hooks in Components

### ✅ CORRECT: Using Query Hooks

```typescript
// components/dashboard/dashboard-content.tsx
"use client";

import { useGetUserLinks } from "@/queries/links";
import { LinkList } from "./link-list";

export function DashboardContent() {
  const { data: links = [], isLoading, error } = useGetUserLinks();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading links</div>;

  return <LinkList links={links} />;
}
```

### ✅ CORRECT: Using Mutation Hooks

```typescript
// components/forms/link-form.tsx
"use client";

import { useCreateLink, useUpdateLink } from "@/queries/links";

export function LinkForm({ initialData, onSuccess }) {
  const createMutation = useCreateLink();
  const updateMutation = useUpdateLink();

  const handleSubmit = (data) => {
    if (initialData) {
      // Update existing link
      updateMutation.mutate(
        { id: initialData.id, data },
        {
          onSuccess: () => {
            onSuccess?.(); // Optional callback
            // NO TOAST HERE - it's in the mutation hook
          },
        }
      );
    } else {
      // Create new link
      createMutation.mutate(data, {
        onSuccess: () => {
          onSuccess?.();
          // NO TOAST HERE - it's in the mutation hook
        },
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button disabled={createMutation.isPending || updateMutation.isPending}>
        Submit
      </button>
    </form>
  );
}
```

### ❌ INCORRECT: Toast in Component

```typescript
// DON'T DO THIS
export function LinkForm() {
  const mutation = useCreateLink();

  const handleSubmit = async (data) => {
    mutation.mutate(data);
    toast.success("Link created"); // ❌ WRONG - Toast should be in hook
  };
}
```

## Optimistic Updates (Advanced)

For instant UI feedback, use optimistic updates:

```typescript
export function useDeleteLinkOptimistic() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const result = await deleteLink(id);
      if (!result.success) throw new Error(result.error);
      return id;
    },
    onMutate: async (deletedId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: queryKeys.links.userLinks(),
      });

      // Snapshot previous value
      const previousLinks = queryClient.getQueryData(
        queryKeys.links.userLinks()
      );

      // Optimistically update
      queryClient.setQueryData(queryKeys.links.userLinks(), (old) =>
        old?.filter((link) => link.id !== deletedId)
      );

      return { previousLinks };
    },
    onSuccess: () => {
      toast.success("Link deleted successfully");
    },
    onError: (error, deletedId, context) => {
      // Rollback on error
      if (context?.previousLinks) {
        queryClient.setQueryData(
          queryKeys.links.userLinks(),
          context.previousLinks
        );
      }
      toast.error(error.message);
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: queryKeys.links.userLinks() });
    },
  });
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

### Authentication Pattern

```typescript
const { userId } = await auth();
if (!userId) {
  throw new Error("Unauthorized");
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
// INSERT with RETURNING
const [newLink] = await db
  .insert(links)
  .values({ originalUrl, shortCode, userId })
  .returning();

// UPDATE
await db
  .update(links)
  .set({ originalUrl: newUrl })
  .where(eq(links.id, id))
  .returning();

// DELETE
await db.delete(links).where(eq(links.id, id)).returning();
```

## Common Drizzle Operators

```typescript
import {
  eq, // Equal
  ne, // Not equal
  gt, // Greater than
  gte, // Greater than or equal
  lt, // Less than
  lte, // Less than or equal
  and, // AND condition
  or, // OR condition
  not, // NOT condition
  like, // LIKE pattern
  ilike, // Case-insensitive LIKE
  inArray, // IN array
  isNull, // IS NULL
  isNotNull, // IS NOT NULL
  desc, // Descending order
  asc, // Ascending order
} from "drizzle-orm";
```

## File Organization Checklist

When adding a new database table:

- [ ] Create `/actions/[table-name].ts` with server actions
- [ ] Create `/queries/[table-name].ts` with React Query hooks
- [ ] Add query keys to `/lib/query-keys.ts`
- [ ] Add `"use server"` directive to action file
- [ ] Add `"use client"` directive to query file
- [ ] Implement CRUD operations as needed
- [ ] Add authentication checks in server actions
- [ ] Add toast notifications in mutation callbacks
- [ ] Return consistent response format `{ success, data?, error? }`
- [ ] Include cache invalidation in mutations
- [ ] Export all functions

## Best Practices

1. **One file per table** - Keep all queries for a table in one place
2. **Consistent naming** - Follow the verb + TableName pattern
3. **Type safety** - Use TypeScript and Drizzle's inferred types
4. **Auth first** - Always check authentication in server actions
5. **Centralized keys** - All query keys in one file
6. **Toast in hooks** - Never show toast directly in components
7. **Invalidate queries** - Always invalidate after mutations
8. **Error handling** - Throw errors in query functions, handle in callbacks
9. **Loading states** - Use `isPending`, `isLoading` from hooks
10. **Optimistic updates** - Use for better UX when appropriate

## React Query Hook Patterns

### Query Hook Template

```typescript
export function useGet[Resource]() {
  return useQuery({
    queryKey: queryKeys.[resource].[operation](),
    queryFn: async () => {
      const result = await [serverAction]();
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
  });
}
```

### Mutation Hook Template

```typescript
export function useCreate[Resource]() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: InputType) => {
      const result = await [serverAction](data);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.[resource].all });
      toast.success("Success message");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error message");
    },
  });
}
```

## Dependencies

```bash
# Install React Query
bun add @tanstack/react-query

# Install React Query Devtools (optional, for development)
bun add -D @tanstack/react-query-devtools
```

---

**Last Updated**: January 6, 2026
**Version**: 2.0.0 (React Query Implementation)
