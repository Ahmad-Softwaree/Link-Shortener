# Data Fetching - React Query with Server Actions & Drizzle ORM

**Last Updated**: January 6, 2026  
**Version**: 1.0.0

## 📋 Overview

All data-fetching logic uses **React Query (TanStack Query)** on the client with **Server Actions** powered by **Drizzle ORM** on the server.

## 🎯 Core Principles

- ✅ **React Query hooks for all client-side data operations**
- ✅ **Server Actions for all database operations**
- ✅ **One action file per database table in `/lib/react-query/actions`**
- ✅ **One query file per database table in `/lib/react-query/queries`**
- ✅ **Centralized query keys in `/lib/react-query/keys.ts`**
- ✅ **Toast notifications in mutation hooks, NOT in components**
- ✅ **Type-safe queries with Drizzle ORM**
- ✅ **Always validate user authorization (userId)**
- ❌ **NO client-side database queries**
- ❌ **NO generic action/query files (use table-specific files)**
- ❌ **NO toast in components**

## 🏗️ Architecture Pattern

```
Component → Query Hook → Server Action → Drizzle ORM → PostgreSQL (Neon)
     ↓           ↓            ↓              ↓
  Render    React Query   "use server"   Type-safe queries

Toast notifications happen in Query Hooks (mutation callbacks)
URL parameters come from nuqs (useAppQueryParams hook)
```

## 📂 Folder Structure

```
lib/
├── react-query/
│   ├── keys.ts                  # Centralized query keys
│   ├── actions/
│   │   └── links.action.ts      # Server actions for links table
│   └── queries/
│       └── links.query.ts       # React Query hooks for links
├── db/
│   ├── index.ts                 # Drizzle db instance
│   └── schema.ts                # Database schema definitions
└── config/
    └── pagination.config.ts     # Pagination configuration

hooks/
└── useAppQuery.tsx              # Custom hook for URL params (nuqs)

types/
└── global.ts                    # QueryParam type definition
```

## 🔑 Step 1: Query Keys (`/lib/react-query/keys.ts`)

**🚨 CRITICAL:** All query keys MUST be centralized in this file.

```typescript
export const links = {
  all: () => ["links"] as const,
  lists: () => [...links.all(), "list"] as const,
  list: (filters?: Record<string, any>) => [...links.lists(), filters] as const,
  details: () => [...links.all(), "detail"] as const,
  detail: (id: number) => [...links.details(), id] as const,
};
```

### Pattern Explanation

- `all()` - Base key for invalidating ALL link-related queries
- `lists()` - Key for all list queries (for invalidation)
- `list(filters)` - Specific list query with filters (includes page, search, etc.)
- `details()` - Key for all detail queries (for invalidation)
- `detail(id)` - Specific detail query for a single record

### Usage in Queries

```typescript
queryKey: links.list({ page: 0, search: "test" });

queryClient.invalidateQueries({ queryKey: links.lists() });
```

## 🔧 Step 2: Server Actions (`/lib/react-query/actions/links.action.ts`)

### File Header

Every action file MUST have these type definitions:

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
```

### GET Operations - Paginated Data

**🚨 CRITICAL Pattern:**

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

**Key Requirements:**

1. ✅ **ALWAYS filter by userId** for security
2. ✅ **Use parallel queries** (`Promise.all`) for data + count
3. ✅ **Support pagination** with `page` and `limit` from `queries`
4. ✅ **Support search** across multiple fields with `ilike`
5. ✅ **Build dynamic WHERE conditions** with array + `and()`
6. ✅ **Return PaginationResult** with `data`, `total`, and `hasMore`

### GET Operations - Single Record

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

**Key Requirements:**

1. ✅ **Verify ownership** with `userId` in WHERE clause
2. ✅ **Return null** if not found
3. ✅ **Use limit(1)** for performance

### CREATE Operations

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

**Key Requirements:**

1. ✅ **Validate before inserting** (check uniqueness, business rules)
2. ✅ **Inject userId from server** (never trust client)
3. ✅ **Use `.returning()`** to get created record
4. ✅ **Throw errors** for validation failures
5. ✅ **Return CRUDReturn** with message and data

### UPDATE Operations

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

**Key Requirements:**

1. ✅ **Use Partial<>** for optional fields
2. ✅ **Verify ownership** in WHERE clause
3. ✅ **Check if updated** (record found and authorized)
4. ✅ **Throw error** if not found/unauthorized

### DELETE Operations

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

**Key Requirements:**

1. ✅ **HARD DELETE** (this project does NOT use soft delete)
2. ✅ **Verify ownership** in WHERE clause
3. ✅ **Check if deleted** (record found and authorized)
4. ✅ **Throw error** if not found/unauthorized

## 🎣 Step 3: React Query Hooks (`/lib/react-query/queries/links.query.ts`)

### File Header

```typescript
"use client";

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

### Query Hook - Get List

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

- ✅ Get `userId` from Clerk's `useAuth()`
- ✅ Use query key with filters
- ✅ Set `retry: 0` (no auto-retry on error)
- ✅ Enable only when `userId` exists
- ✅ Support optional `enabled` prop

### Query Hook - Get One

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

### Mutation Hook - Create

**🚨 CRITICAL: Toast ALWAYS in mutation, NEVER in component!**

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

- ✅ **Toast in `onSuccess` and `onError`**
- ✅ Support custom success message
- ✅ Optional modal close
- ✅ Invalidate list queries (not detail)
- ✅ Use i18n translations

### Mutation Hook - Update

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

### Mutation Hook - Delete

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

- ✅ No modal close (delete usually from list/card)
- ✅ Just take `id` as parameter
- ✅ Same toast pattern

## 🔗 Step 4: Integration with URL Parameters

Use the `useAppQueryParams` hook for URL state management:

```typescript
// hooks/useAppQuery.tsx
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import {
  getLimitFromCookie,
  setLimitCookie,
} from "@/lib/config/pagination.config";

export function useAppQueryParams() {
  const [queries, setQueries] = useQueryStates({
    page: parseAsInteger.withDefault(0),
    limit: parseAsInteger.withDefault(100),
    search: parseAsString.withDefault(""),
  });

  const setLimit = (limit: number) => {
    setLimitCookie(limit);
    setQueries({ limit, page: 0 });
  };

  return {
    queries,
    setQueries,
    setLimit,
  };
}
```

## 🎨 Step 5: Component Usage

```typescript
// app/dashboard/page.tsx
"use client";

import { useGetLinks } from "@/lib/react-query/queries/links.query";
import { useAppQueryParams } from "@/hooks/useAppQuery";
import { DataBox } from "@/components/table/data-box";
import { SimpleLinkCard } from "@/components/cards/LinkCard.Simple";

export default function DashboardPage() {
  const { queries, setQueries, setLimit } = useAppQueryParams();

  const queryResult = useGetLinks({ queries });

  const handlePageChange = (page: number) => {
    setQueries({ page });
  };

  const handleLimitChange = (limit: number) => {
    setLimit(limit);
  };

  return (
    <DataBox<Link>
      queryFn={() => queryResult}
      Component={SimpleLinkCard}
      onPageChange={handlePageChange}
      onLimitChange={handleLimitChange}
      currentPage={queries.page}
      limit={queries.limit}
    />
  );
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

❌ **DON'T manually manage URL state:**

```typescript
const [search, setSearch] = useState("");
```

❌ **DON'T fetch data in components:**

```typescript
const [data, setData] = useState([]);

useEffect(() => {
  fetch("/api/links").then((res) => setData(res.data));
}, []);
```

## ✅ Best Practices

- ✅ One action file per table
- ✅ One query file per table
- ✅ Centralized query keys
- ✅ Toast in mutation hooks
- ✅ URL params from nuqs
- ✅ Always verify userId
- ✅ Parallel queries for data + count
- ✅ Type-safe with Drizzle ORM
- ✅ Error handling with throw
- ✅ Invalidate queries after mutations
