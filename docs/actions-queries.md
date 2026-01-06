# Actions & Queries Architecture

> **⚠️ CRITICAL: Table-Specific Pattern**  
> This project uses a table-specific pattern. Each database table has its own action and query file.

**Last Updated**: January 6, 2026  
**Version**: 1.0.0

## 📋 Overview

This project uses **React Query (TanStack Query)** with **Server Actions** for all data operations:

- **Actions** (`/lib/react-query/actions`) - Server-side data fetching and mutations using Drizzle ORM
- **Queries** (`/lib/react-query/queries`) - TanStack Query hooks that wrap actions with caching and optimistic updates
- **Keys** (`/lib/react-query/keys.ts`) - Centralized query key definitions

## 🗂️ File Structure

```
lib/
  react-query/
    keys.ts                    # Centralized query keys for all tables
    actions/
      [table-name].action.ts   # Server actions per table (e.g., links.action.ts)
    queries/
      [table-name].query.ts    # React Query hooks per table (e.g., links.query.ts)
```

### File Creation Rules

**✅ ALWAYS create table-specific files:**

- One action file per database table: `[table-name].action.ts`
- One query file per database table: `[table-name].query.ts`
- Add query keys to `keys.ts` for each table

## 🔑 Query Keys (`/lib/react-query/keys.ts`)

Define hierarchical query keys for each table:

```typescript
export const links = {
  all: () => ["links"] as const,
  lists: () => [...links.all(), "list"] as const,
  list: (filters?: Record<string, any>) => [...links.lists(), filters] as const,
  details: () => [...links.all(), "detail"] as const,
  detail: (id: number) => [...links.details(), id] as const,
};
```

### Query Key Pattern

- `all()` - Base key for all link queries
- `lists()` - Key for all list queries
- `list(filters)` - Key for specific list with filters
- `details()` - Key for all detail queries
- `detail(id)` - Key for specific detail query

## 🔧 Server Actions (`/lib/react-query/actions/[table-name].action.ts`)

### Required Type Definitions

Every action file MUST define these types at the top:

```typescript
export type CRUDReturn = { message: string; data?: any };

export type PaginationResult<T> = {
  data: T[];
  total: number;
  hasMore: boolean;
};
```

### Standard Functions Pattern

Implement these operations as needed for your table:

1. **Get paginated data with search/filters**
2. **Get single record by ID**
3. **Add new record**
4. **Update existing record**
5. **Delete record**

### 1. Get Paginated Data with Search/Filters

**Pattern:**

```typescript
export const getLinks = async (
  userId: string,
  queries?: QueryParam
): Promise<PaginationResult<Link>> => {
  const page = Number(queries?.page) || 0;
  const limit = Number(queries?.limit) || 100;
  const search = (queries?.search as string) || "";

  const offset = page * limit;

  const whereConditions: any[] = [eq(links.userId, userId)];

  if (search) {
    whereConditions.push(
      or(
        ilike(links.shortCode, `%${search}%`),
        ilike(links.originalUrl, `%${search}%`)
      )!
    );
  }

  const [data, totalResult] = await Promise.all([
    db
      .select()
      .from(links)
      .where(
        whereConditions.length === 1
          ? whereConditions[0]
          : and(...whereConditions)
      )
      .orderBy(desc(links.createdAt))
      .limit(limit)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(links)
      .where(
        whereConditions.length === 1
          ? whereConditions[0]
          : and(...whereConditions)
      ),
  ]);

  const total = totalResult[0]?.count || 0;

  return {
    data,
    total,
    hasMore: offset + data.length < total,
  };
};
```

**Key Points:**

- ✅ Use parallel queries for data and count
- ✅ Support pagination with `page` and `limit`
- ✅ Support search across multiple fields
- ✅ Always filter by userId for security
- ✅ Return `PaginationResult` type

### 2. Get Single Record by ID

**Pattern:**

```typescript
export const getLink = async (
  id: number,
  userId: string
): Promise<Link | null> => {
  const result = await db
    .select()
    .from(links)
    .where(and(eq(links.id, id), eq(links.userId, userId)))
    .limit(1);

  return result[0] || null;
};
```

**Key Points:**

- ✅ Verify userId ownership
- ✅ Return `null` if not found
- ✅ Use `limit(1)` for performance

### 3. Add New Record

**Pattern:**

```typescript
export const addLink = async (
  form: Omit<NewLink, "userId">,
  userId: string
): Promise<CRUDReturn> => {
  const existing = await db
    .select()
    .from(links)
    .where(eq(links.shortCode, form.shortCode))
    .limit(1);

  if (existing.length > 0) {
    throw new Error("Short code already exists");
  }

  const [newLink] = await db
    .insert(links)
    .values({ ...form, userId })
    .returning();

  return {
    message: "Link created successfully",
    data: newLink,
  };
};
```

**Key Points:**

- ✅ Validate before inserting (check uniqueness, etc.)
- ✅ Inject userId from server
- ✅ Use `.returning()` to get created record
- ✅ Throw errors for validation failures
- ✅ Return `CRUDReturn` type

### 4. Update Existing Record

**Pattern:**

```typescript
export const updateLink = async (
  id: number,
  form: Partial<Omit<NewLink, "userId">>,
  userId: string
): Promise<CRUDReturn> => {
  const [updatedLink] = await db
    .update(links)
    .set(form)
    .where(and(eq(links.id, id), eq(links.userId, userId)))
    .returning();

  if (!updatedLink) {
    throw new Error("Link not found or unauthorized");
  }

  return {
    message: "Link updated successfully",
    data: updatedLink,
  };
};
```

**Key Points:**

- ✅ Use `Partial` for optional fields
- ✅ Verify userId ownership in WHERE clause
- ✅ Check if record was updated
- ✅ Throw error if not found/unauthorized

### 5. Delete Record

**Pattern:**

```typescript
export const deleteLink = async (
  id: number,
  userId: string
): Promise<CRUDReturn> => {
  const [deletedLink] = await db
    .delete(links)
    .where(and(eq(links.id, id), eq(links.userId, userId)))
    .returning();

  if (!deletedLink) {
    throw new Error("Link not found or unauthorized");
  }

  return {
    message: "Link deleted successfully",
    data: deletedLink,
  };
};
```

**Key Points:**

- ✅ HARD DELETE (no soft delete in this project)
- ✅ Verify userId ownership
- ✅ Check if record was deleted
- ✅ Throw error if not found/unauthorized

## 🎣 React Query Hooks (`/lib/react-query/queries/[table-name].query.ts`)

### Required Imports

```typescript
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useModalStore } from "@/lib/store/modal.store";
import {
  getLinks,
  getLink,
  addLink,
  updateLink,
  deleteLink,
  type PaginationResult,
  type CRUDReturn,
} from "../actions/links.action";
import type { QueryParam } from "@/types/global";
import type { Link, NewLink } from "@/lib/db/schema";
import { links } from "../keys";
```

### Standard Hooks Pattern

Implement these hooks as needed:

1. **Query: Get paginated data with filters**
2. **Query: Get single record by ID**
3. **Mutation: Add new record**
4. **Mutation: Update existing record**
5. **Mutation: Delete record**

### 1. Query: Get Paginated Data

**Pattern:**

```typescript
type UseGetLinksOptions = {
  queries?: QueryParam;
  enabled?: boolean;
};

export function useGetLinks({
  queries,
  enabled = true,
}: UseGetLinksOptions = {}) {
  const { userId } = useAuth();

  return useQuery({
    queryKey: links.list(queries),
    queryFn: (): Promise<PaginationResult<Link>> => getLinks(userId!, queries),
    retry: 0,
    enabled: !!userId && enabled,
  });
}
```

**Key Points:**

- ✅ Get userId from `useAuth()`
- ✅ Use query key with filters from `keys.ts`
- ✅ Set `retry: 0` (no retries on error)
- ✅ Enable only when userId exists
- ✅ Support optional `enabled` prop

### 2. Query: Get Single Record

**Pattern:**

```typescript
type UseGetLinkOptions = {
  id: number;
  enabled?: boolean;
};

export function useGetLink({ id, enabled = true }: UseGetLinkOptions) {
  const { userId } = useAuth();

  return useQuery({
    queryKey: links.detail(id),
    queryFn: (): Promise<Link | null> => getLink(id, userId!),
    retry: 0,
    enabled: !!userId && !!id && enabled,
  });
}
```

**Key Points:**

- ✅ Require id in options
- ✅ Enable only when userId AND id exist
- ✅ Use detail query key

### 3. Mutation: Add New Record

**🚨 CRITICAL: Toast notifications ALWAYS in mutations, NEVER in components!**

**Pattern:**

```typescript
type UseAddLinkOptions = {
  closeTheModal?: boolean;
  successMessage?: string;
};

export function useAddLink({
  closeTheModal = true,
  successMessage,
}: UseAddLinkOptions = {}) {
  const { userId } = useAuth();
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { closeModal } = useModalStore();

  return useMutation({
    mutationFn: async (form: Omit<NewLink, "userId">): Promise<CRUDReturn> =>
      addLink(form, userId!),
    onSuccess: ({ message }) => {
      toast.success(successMessage || message || t("toast.link_created"));
      if (closeTheModal) closeModal();
      return queryClient.invalidateQueries({
        queryKey: links.lists(),
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || t("toast.error_occurred"));
    },
  });
}
```

**Key Points:**

- ✅ Toast in `onSuccess` and `onError`
- ✅ Support custom success message
- ✅ Optional modal close
- ✅ Invalidate list queries
- ✅ Use translations

### 4. Mutation: Update Existing Record

**Pattern:**

```typescript
type UseUpdateLinkOptions = {
  closeTheModal?: boolean;
  successMessage?: string;
};

export function useUpdateLink({
  closeTheModal = true,
  successMessage,
}: UseUpdateLinkOptions = {}) {
  const { userId } = useAuth();
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { closeModal } = useModalStore();

  return useMutation({
    mutationFn: async ({
      id,
      form,
    }: {
      id: number;
      form: Partial<Omit<NewLink, "userId">>;
    }): Promise<CRUDReturn> => updateLink(id, form, userId!),
    onSuccess: ({ message }) => {
      toast.success(successMessage || message || t("toast.link_updated"));
      if (closeTheModal) closeModal();
      return queryClient.invalidateQueries({
        queryKey: links.lists(),
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || t("toast.error_occurred"));
    },
  });
}
```

**Key Points:**

- ✅ Accept both `id` and `form` in mutation
- ✅ Same pattern as add mutation

### 5. Mutation: Delete Record

**Pattern:**

```typescript
type UseDeleteLinkOptions = {
  successMessage?: string;
};

export function useDeleteLink({ successMessage }: UseDeleteLinkOptions = {}) {
  const { userId } = useAuth();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: async (id: number): Promise<CRUDReturn> =>
      deleteLink(id, userId!),
    onSuccess: ({ message }) => {
      toast.success(successMessage || message || t("toast.link_deleted"));
      return queryClient.invalidateQueries({
        queryKey: links.lists(),
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || t("toast.error_occurred"));
    },
  });
}
```

**Key Points:**

- ✅ No modal close (delete is usually from list/card)
- ✅ Just take id as parameter
- ✅ Same toast pattern

## 📦 Integration with URL Parameters (nuqs)

Query parameters ALWAYS come from the `useAppQueryParams` hook:

```typescript
// In component
const { queries, setQueries, setLimit } = useAppQueryParams();

// Pass to query hook
const queryResult = useGetLinks({ queries });

// Handle pagination
const handlePageChange = (page: number) => {
  setQueries({ page });
};

const handleLimitChange = (limit: number) => {
  setLimit(limit);
};
```

## 🎯 Complete Example

### links.action.ts

```typescript
"use server";

import { db } from "@/lib/db";
import { links, type Link, type NewLink } from "@/lib/db/schema";
import { eq, ilike, or, and, desc, sql } from "drizzle-orm";
import type { QueryParam } from "@/types/global";

export type CRUDReturn = { message: string; data?: any };

export type PaginationResult<T> = {
  data: T[];
  total: number;
  hasMore: boolean;
};

export const getLinks = async (
  userId: string,
  queries?: QueryParam
): Promise<PaginationResult<Link>> => {
  const page = Number(queries?.page) || 0;
  const limit = Number(queries?.limit) || 100;
  const search = (queries?.search as string) || "";
  const offset = page * limit;

  const whereConditions: any[] = [eq(links.userId, userId)];

  if (search) {
    whereConditions.push(
      or(
        ilike(links.shortCode, `%${search}%`),
        ilike(links.originalUrl, `%${search}%`)
      )!
    );
  }

  const [data, totalResult] = await Promise.all([
    db
      .select()
      .from(links)
      .where(
        whereConditions.length === 1
          ? whereConditions[0]
          : and(...whereConditions)
      )
      .orderBy(desc(links.createdAt))
      .limit(limit)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(links)
      .where(
        whereConditions.length === 1
          ? whereConditions[0]
          : and(...whereConditions)
      ),
  ]);

  const total = totalResult[0]?.count || 0;

  return {
    data,
    total,
    hasMore: offset + data.length < total,
  };
};

export const addLink = async (
  form: Omit<NewLink, "userId">,
  userId: string
): Promise<CRUDReturn> => {
  const existing = await db
    .select()
    .from(links)
    .where(eq(links.shortCode, form.shortCode))
    .limit(1);

  if (existing.length > 0) {
    throw new Error("Short code already exists");
  }

  const [newLink] = await db
    .insert(links)
    .values({ ...form, userId })
    .returning();

  return {
    message: "Link created successfully",
    data: newLink,
  };
};
```

### links.query.ts

```typescript
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useModalStore } from "@/lib/store/modal.store";
import {
  getLinks,
  addLink,
  type PaginationResult,
  type CRUDReturn,
} from "../actions/links.action";
import type { Link, NewLink } from "@/lib/db/schema";
import { links } from "../keys";

export function useGetLinks({ queries, enabled = true } = {}) {
  const { userId } = useAuth();

  return useQuery({
    queryKey: links.list(queries),
    queryFn: (): Promise<PaginationResult<Link>> => getLinks(userId!, queries),
    retry: 0,
    enabled: !!userId && enabled,
  });
}

export function useAddLink({ closeTheModal = true, successMessage } = {}) {
  const { userId } = useAuth();
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { closeModal } = useModalStore();

  return useMutation({
    mutationFn: async (form: Omit<NewLink, "userId">): Promise<CRUDReturn> =>
      addLink(form, userId!),
    onSuccess: ({ message }) => {
      toast.success(successMessage || message || t("toast.link_created"));
      if (closeTheModal) closeModal();
      return queryClient.invalidateQueries({ queryKey: links.lists() });
    },
    onError: (error: Error) => {
      toast.error(error.message || t("toast.error_occurred"));
    },
  });
}
```

## 🚫 Common Mistakes

❌ **DON'T handle toasts in components:**

```typescript
const addLink = useAddLink();
addLink.mutate(form, {
  onSuccess: () => toast.success("Success!"),
});
```

❌ **DON'T forget userId authorization:**

```typescript
export const getLinks = async (): Promise<Link[]> => {
  return await db.select().from(links);
};
```

❌ **DON'T use generic action/query files:**

This project uses table-specific files, not generic ones.

## ✅ Best Practices

- ✅ One file per table in both actions and queries
- ✅ Always pass userId to server actions
- ✅ Always verify userId in WHERE clauses
- ✅ Toast notifications in mutation hooks
- ✅ Use TypeScript types from schema
- ✅ Invalidate queries after mutations
- ✅ Use query keys from `keys.ts`
- ✅ Support pagination and search
- ✅ Hard delete (no soft delete in this project)
