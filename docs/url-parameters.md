# URL Parameter Handling - nuqs

**Last Updated**: January 6, 2026  
**Version**: 1.0.0

**🚨 CRITICAL:** ALWAYS use `nuqs` via the `useAppQueryParams` hook for managing URL parameters.  
**NEVER use raw `searchParams`, `useSearchParams`, or manual URL manipulation.**

## 📋 Overview

This project uses **[nuqs](https://nuqs.47ng.com/)** for type-safe URL state management, accessed through a **custom hook** (`useAppQueryParams`) that centralizes pagination, search, and filter parameters.

## 🎯 Core Principles

1. **useAppQueryParams hook for ALL URL state** - Page, limit, search (centralized)
2. **nuqs under the hood** - Type-safe URL parameter management
3. **Type-safe parameters** - Automatic parsing with `parseAsInteger` and `parseAsString`
4. **Automatic URL sync** - State changes automatically update the URL
5. **Cookie integration** - Limit preference persisted in cookies
6. **Server & Client compatibility** - Works in both environments
7. **Integration with React Query** - URL params drive query keys for data fetching

## 📦 Installation

```bash
# nuqs is already installed in this project
bun add nuqs
```

## 🔧 Architecture

```
Page Component
  ↓
useAppQueryParams (custom hook)
  ↓
nuqs (useQueryStates)
  ↓
URL Parameters (page, limit, search)
  ↓
React Query (useGetLinks)
  ↓
Server Action (getLinks)
```

## 🎯 The useAppQueryParams Hook

**🚨 ALWAYS use this hook for URL parameters. DO NOT use nuqs directly.**

### Location

```
hooks/useAppQuery.tsx
```

### Implementation

```typescript
"use client";

import { ENUMs } from "@/lib/enums";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import {
  getLimitFromCookie,
  setLimitCookie,
} from "@/lib/config/pagination.config";
import { useEffect, useState } from "react";

export function useAppQueryParams() {
  const [cookieLimit, setCookieLimit] = useState<number>(100);

  useEffect(() => {
    setCookieLimit(getLimitFromCookie());
  }, []);

  const [queries, setQueries] = useQueryStates({
    [ENUMs.PARAMS.PAGE]: parseAsInteger.withDefault(0),
    [ENUMs.PARAMS.LIMIT]: parseAsInteger.withDefault(cookieLimit),
    [ENUMs.PARAMS.SEARCH]: parseAsString.withDefault(""),
  });

  const removeAllQueries = () => {
    setQueries(null);
  };

  const setLimit = (limit: number) => {
    setLimitCookie(limit);
    setQueries({ limit, page: 0 });
  };

  return {
    queries,
    setQueries,
    removeAllQueries,
    setLimit,
  };
}
```

### Return Values

- **`queries`** - Object with `page`, `limit`, `search`
- **`setQueries(updates)`** - Update one or more parameters
- **`removeAllQueries()`** - Clear all URL parameters
- **`setLimit(limit)`** - Update limit (saves to cookie, resets to page 0)

### Default Values

- **page**: `0` (0-based indexing)
- **limit**: `100` (or from cookie if set)
- **search**: `""` (empty string)

## 📝 Usage Patterns

### Pattern 1: Basic Usage in Page Component

```typescript
// app/dashboard/page.tsx
"use client";

import { useAppQueryParams } from "@/hooks/useAppQuery";
import { useGetLinks } from "@/lib/react-query/queries/links.query";
import { DataBox } from "@/components/table/data-box";

export default function DashboardPage() {
  const { queries, setQueries, setLimit } = useAppQueryParams();

  const queryResult = useGetLinks({
    queries,
  });

  const handlePageChange = (page: number) => {
    setQueries({ page });
  };

  const handleLimitChange = (limit: number) => {
    setLimit(limit);
  };

  return (
    <DataBox
      queryFn={() => queryResult}
      Component={LinkCard}
      onPageChange={handlePageChange}
      onLimitChange={handleLimitChange}
      currentPage={queries.page}
      limit={queries.limit}
    />
  );
}
```

**Key Points:**

- ✅ Get `queries` object with page, limit, search
- ✅ Pass `queries` to React Query hook
- ✅ Update page with `setQueries({ page })`
- ✅ Update limit with `setLimit(limit)` (resets to page 0)

### Pattern 2: Search Integration

```typescript
// In a search component
import { useAppQueryParams } from "@/hooks/useAppQuery";

export function SearchBar() {
  const { queries, setQueries } = useAppQueryParams();

  const handleSearch = (value: string) => {
    setQueries({
      search: value,
      page: 0,
    });
  };

  return (
    <input
      value={queries.search}
      onChange={(e) => handleSearch(e.target.value)}
      placeholder="Search..."
    />
  );
}
```

**Key Points:**

- ✅ Reset to page 0 when search changes
- ✅ Controlled input with `queries.search`

### Pattern 3: Integration with React Query

```typescript
// lib/react-query/queries/links.query.ts
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

- ✅ `queries` object becomes part of query key
- ✅ Query refetches automatically when URL params change
- ✅ Type-safe with `QueryParam` type

### Pattern 4: Server Action Integration

```typescript
// lib/react-query/actions/links.action.ts
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
      .where(/* ... */)
      .orderBy(desc(links.createdAt))
      .limit(limit)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(links)
      .where(/* ... */),
  ]);

  const total = totalResult[0]?.count || 0;

  return { data, total, hasMore: offset + data.length < total };
};
```

**Key Points:**

- ✅ Extract page, limit, search from `queries` object
- ✅ Calculate offset from page and limit
- ✅ Use search in WHERE conditions

## 🔑 Query Parameter Definitions

### ENUMs Configuration

```typescript
// lib/enums.ts
export const ENUMs = {
  PARAMS: {
    PAGE: "page",
    LIMIT: "limit",
    SEARCH: "search",
  },
};
```

### QueryParam Type

```typescript
// types/global.ts
export type QueryParam = {
  page?: number;
  limit?: number;
  search?: string;
};
```

## 🍪 Cookie Integration

The `limit` parameter is persisted in a cookie for user preference.

### Configuration

```typescript
// lib/config/pagination.config.ts
import { getCookie, setCookie } from "./cookie.config";

const LIMIT_COOKIE_NAME = "pagination_limit";
const VALID_LIMITS = [50, 100, 150, 200] as const;
const DEFAULT_LIMIT = 100;

export const getLimitFromCookie = (): number => {
  const cookieValue = getCookie(LIMIT_COOKIE_NAME);
  if (!cookieValue) return DEFAULT_LIMIT;

  const parsedLimit = parseInt(cookieValue, 10);

  if (VALID_LIMITS.includes(parsedLimit as any)) {
    return parsedLimit;
  }

  return DEFAULT_LIMIT;
};

export const setLimitCookie = (limit: number): void => {
  if (VALID_LIMITS.includes(limit as any)) {
    setCookie(LIMIT_COOKIE_NAME, limit.toString(), 30);
  }
};
```

**How it works:**

1. ✅ On mount, `useAppQueryParams` reads limit from cookie
2. ✅ Sets URL param to cookie value if not in URL
3. ✅ When user changes limit, both cookie and URL update
4. ✅ Limit resets to page 0 automatically

## 📊 URL State Flow

### Example URL States

```
Initial load:
?page=0&limit=100&search=

After search:
?page=0&limit=100&search=test

After page change:
?page=2&limit=100&search=test

After limit change:
?page=0&limit=50&search=test
```

### State Transitions

```
1. User types in search
   ↓
   setQueries({ search: "test", page: 0 })
   ↓
   URL updates: ?page=0&limit=100&search=test
   ↓
   React Query detects query key change
   ↓
   Refetches data with new params

2. User changes page
   ↓
   setQueries({ page: 2 })
   ↓
   URL updates: ?page=2&limit=100&search=test
   ↓
   React Query refetches

3. User changes limit
   ↓
   setLimit(50)
   ↓
   Cookie updated + setQueries({ limit: 50, page: 0 })
   ↓
   URL updates: ?page=0&limit=50&search=test
   ↓
   React Query refetches
```

## 🚫 Common Mistakes

❌ **DON'T use nuqs directly:**

```typescript
const [search, setSearch] = useQueryState("search");
```

❌ **DON'T use useState for URL params:**

```typescript
const [page, setPage] = useState(0);
```

❌ **DON'T use Next.js searchParams directly:**

```typescript
export default function Page({ searchParams }: { searchParams: any }) {
  const page = searchParams.page;
}
```

❌ **DON'T forget to reset page when changing filters:**

```typescript
setQueries({ search: "test" });
```

❌ **DON'T update limit without using setLimit:**

```typescript
setQueries({ limit: 50 });
```

## ✅ Best Practices

- ✅ **Always use `useAppQueryParams`** for URL state
- ✅ **Reset to page 0** when changing search or limit
- ✅ **Use `setLimit()`** for limit changes (handles cookie)
- ✅ **Pass queries object** to React Query hooks
- ✅ **Type-safe** with QueryParam type
- ✅ **0-based page indexing** (page 0 = first page)
- ✅ **Centralized parameter management** in one hook
- ✅ **Cookie persistence** for limit preference

## 🔄 Adding New Parameters

If you need to add new URL parameters in the future:

### 1. Update ENUMs

```typescript
// lib/enums.ts
export const ENUMs = {
  PARAMS: {
    PAGE: "page",
    LIMIT: "limit",
    SEARCH: "search",
  },
};
```

### 2. Update useAppQueryParams

```typescript
// hooks/useAppQuery.tsx
const [queries, setQueries] = useQueryStates({
  [ENUMs.PARAMS.PAGE]: parseAsInteger.withDefault(0),
  [ENUMs.PARAMS.LIMIT]: parseAsInteger.withDefault(cookieLimit),
  [ENUMs.PARAMS.SEARCH]: parseAsString.withDefault(""),
});
```

### 3. Update QueryParam Type

```typescript
// types/global.ts
export type QueryParam = {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
};
```

### 4. Update Server Action

```typescript
// lib/react-query/actions/links.action.ts
export const getLinks = async (
  userId: string,
  queries?: QueryParam
): Promise<PaginationResult<Link>> => {
  const status = queries?.status || "all";

  if (status !== "all") {
    whereConditions.push(eq(links.status, status));
  }
};
```

## 🎯 Summary

**This project uses:**

- ✅ `useAppQueryParams` hook (custom wrapper around nuqs)
- ✅ Centralized URL parameter management
- ✅ Type-safe with TypeScript
- ✅ Automatic URL synchronization
- ✅ Cookie persistence for limit
- ✅ Integration with React Query
- ✅ Page reset on filter/search/limit changes
- ✅ 0-based page indexing

**DO NOT use:**

- ❌ Direct nuqs hooks
- ❌ useState for URL parameters
- ❌ Next.js searchParams directly
- ❌ Manual URL manipulation
