# URL Parameter Handling - nuqs

**🚨 CRITICAL:** ALWAYS use `nuqs` for managing URL parameters (search, filters, pagination, sorting, etc.).  
**NEVER use raw `searchParams`, `useSearchParams`, or manual URL manipulation.**

## 📋 Overview

This project uses **[nuqs](https://nuqs.47ng.com/)** for type-safe, declarative URL state management. All URL parameters that affect data fetching (search, filters, pagination, sorting, etc.) MUST be managed through nuqs hooks.

## 🎯 Core Principles

1. **nuqs for ALL URL state** - Search, filters, pagination, sorting, tabs, modals
2. **Type-safe parameters** - Define schemas with Zod for validation
3. **Automatic URL sync** - State changes automatically update the URL
4. **Server & Client compatibility** - Works in both Server and Client Components
5. **Integration with React Query** - URL params drive query keys for data fetching

## 📦 Installation

```bash
# Install nuqs
bun add nuqs

# nuqs is already compatible with Next.js 16+ and React 19+
```

## 🔧 Basic Setup

### Step 1: Create URL Parameter Parsers (`/lib/url-parsers.ts`)

Define reusable parsers for common URL parameter types:

```typescript
import { parseAsString, parseAsInteger, createParser } from "nuqs";

/**
 * Common URL parameter parsers
 * Define these once and reuse across the app
 */

// String parameters
export const searchParser = parseAsString.withDefault("");
export const sortParser = parseAsString.withDefault("createdAt");
export const orderParser = parseAsString.withDefault("desc");

// Number parameters
export const pageParser = parseAsInteger.withDefault(1);
export const limitParser = parseAsInteger.withDefault(10);

// Custom parsers with validation
export const statusParser = createParser({
  parse: (value) => {
    const valid = ["active", "inactive", "all"] as const;
    return valid.includes(value as any)
      ? (value as (typeof valid)[number])
      : "all";
  },
  serialize: (value) => value,
}).withDefault("all");
```

### Step 2: Add NuqsAdapter to Layout (`/app/layout.tsx`)

Wrap your app with the `NuqsAdapter` provider:

```typescript
import { NuqsAdapter } from "nuqs/adapters/next/app";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <NuqsAdapter>
          <QueryProvider>{children}</QueryProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
```

## 📝 Usage Patterns

### ⭐ Pattern 0: Custom Hook for Centralized URL Params (RECOMMENDED)

**🚨 BEST PRACTICE:** Create a custom hook per feature to centralize all URL parameter management.

**Create Hook** (`/hooks/use-links-filters.ts`):

```typescript
"use client";

import { useQueryStates } from "nuqs";
import {
  searchParser,
  statusParser,
  sortParser,
  orderParser,
} from "@/lib/url-parsers";

/**
 * Custom hook to manage all URL parameters for the links feature
 * This centralizes URL state management and makes it reusable
 *
 * URL Example: ?search=test&status=active&sort=createdAt&order=desc
 */
export function useLinksFilters() {
  const [filters, setFilters] = useQueryStates(
    {
      search: searchParser,
      status: statusParser,
      sort: sortParser,
      order: orderParser,
    },
    {
      history: "replace", // Replace history instead of push for cleaner navigation
    }
  );

  // Helper methods for common operations
  const resetFilters = () => {
    setFilters({
      search: null,
      status: null,
      sort: null,
      order: null,
    });
  };

  const updateSearch = (search: string) => {
    setFilters({ search });
  };

  const updateStatus = (status: string) => {
    setFilters({ status });
  };

  const updateSort = (sort: string, order?: string) => {
    setFilters({ sort, ...(order && { order }) });
  };

  return {
    filters,
    setFilters,
    updateSearch,
    updateStatus,
    updateSort,
    resetFilters,
  };
}
```

**Usage in Component** (`/components/dashboard/dashboard-content.tsx`):

```typescript
"use client";

import { useLinksFilters } from "@/hooks/use-links-filters";
import { useGetUserLinksInfinite } from "@/queries/links";
import { SearchBar } from "@/components/shared/search-bar";

export function DashboardContent() {
  // Single hook for all URL params
  const { filters, updateSearch, resetFilters } = useLinksFilters();

  // Pass filters to React Query
  const { data, isLoading } = useGetUserLinksInfinite(10, filters.search);

  return (
    <div>
      <SearchBar
        value={filters.search}
        onChange={updateSearch}
        placeholder="Search links..."
      />

      <select
        value={filters.status}
        onChange={(e) => updateStatus(e.target.value)}>
        <option value="all">All</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>

      <button onClick={resetFilters}>Reset All Filters</button>

      {/* Render data */}
    </div>
  );
}
```

**Benefits:**

- ✅ Single source of truth for URL params
- ✅ Reusable across multiple components
- ✅ Type-safe with autocomplete
- ✅ Helper methods for common operations
- ✅ Easier to test and maintain

---

### Pattern 1: Simple Search Parameter

**Client Component** (`/components/dashboard/dashboard-content.tsx`):

```typescript
"use client";

import { useQueryState } from "nuqs";
import { searchParser } from "@/lib/url-parsers";
import { useGetUserLinksInfinite } from "@/queries/links";
import { SearchBar } from "@/components/shared/search-bar";

export function DashboardContent() {
  // URL parameter: ?search=query
  const [search, setSearch] = useQueryState("search", searchParser);

  // Pass URL param to React Query
  const { data, isLoading } = useGetUserLinksInfinite(10, search);

  return (
    <div>
      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search links..."
      />
      {/* Render data */}
    </div>
  );
}
```

### Pattern 2: Multiple Filter Parameters

```typescript
"use client";

import { useQueryStates } from "nuqs";
import { searchParser, statusParser, sortParser } from "@/lib/url-parsers";

export function FilteredList() {
  // URL: ?search=test&status=active&sort=createdAt
  const [filters, setFilters] = useQueryStates({
    search: searchParser,
    status: statusParser,
    sort: sortParser,
  });

  // Update multiple params at once (single URL update)
  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters(newFilters);
  };

  // Reset all filters
  const handleReset = () => {
    setFilters({
      search: null, // null removes the param from URL
      status: null,
      sort: null,
    });
  };

  return (
    <div>
      <input
        value={filters.search}
        onChange={(e) => setFilters({ search: e.target.value })}
      />
      <select
        value={filters.status}
        onChange={(e) => setFilters({ status: e.target.value })}>
        <option value="all">All</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
      <button onClick={handleReset}>Reset Filters</button>
    </div>
  );
}
```

### Pattern 3: Integration with React Query

**Query Hook** (`/queries/links.ts`):

```typescript
import { useGetUserLinksInfinite } from "@/queries/links";
import { useQueryState } from "nuqs";
import { searchParser } from "@/lib/url-parsers";

export function LinkList() {
  const [search] = useQueryState("search", searchParser);

  // React Query automatically re-fetches when search changes
  const { data, isLoading } = useGetUserLinksInfinite(10, search);

  return (
    <div>
      {isLoading
        ? "Loading..."
        : data?.items.map((link) => <LinkCard key={link.id} link={link} />)}
    </div>
  );
}
```

**Query Key Integration** (`/lib/query-keys.ts`):

```typescript
export const queryKeys = {
  links: {
    all: ["links"] as const,
    lists: () => [...queryKeys.links.all, "list"] as const,
    // Include URL params in query key for proper caching
    list: (filters: { limit?: number; search?: string }) =>
      [...queryKeys.links.lists(), filters] as const,
  },
} as const;
```

### Pattern 4: Server Component URL Access

**Server Component** (`/app/dashboard/page.tsx`):

```typescript
import { searchParamsCache } from "@/lib/url-parsers";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  // Parse URL params in Server Component
  const { search, status } = await searchParamsCache.parse(await searchParams);

  // Fetch data with params
  const data = await getUserLinks({ search, status });

  return <DashboardContent initialData={data} />;
}
```

**Create Search Params Cache** (`/lib/url-parsers.ts`):

```typescript
import { createSearchParamsCache } from "nuqs/server";
import { searchParser, statusParser } from "@/lib/url-parsers";

export const searchParamsCache = createSearchParamsCache({
  search: searchParser,
  status: statusParser,
});
```

### Pattern 5: Pagination with Infinite Scroll

```typescript
"use client";

import { useQueryState } from "nuqs";
import { pageParser, limitParser } from "@/lib/url-parsers";

export function PaginatedList() {
  const [page, setPage] = useQueryState("page", pageParser);
  const [limit, setLimit] = useQueryState("limit", limitParser);

  const { data, fetchNextPage, hasNextPage } = useGetUserLinksInfinite(
    limit,
    undefined
  );

  const handleLoadMore = () => {
    setPage(page + 1);
    fetchNextPage();
  };

  return (
    <div>
      {/* Render items */}
      {hasNextPage && <button onClick={handleLoadMore}>Load More</button>}
    </div>
  );
}
```

### Pattern 6: Modal State in URL

```typescript
"use client";

import { useQueryState } from "nuqs";
import { parseAsString } from "nuqs";

export function LinkActions() {
  const [modal, setModal] = useQueryState("modal", parseAsString);

  return (
    <div>
      <button onClick={() => setModal("create")}>Create Link</button>
      <button onClick={() => setModal("edit")}>Edit Link</button>

      {modal === "create" && (
        <CreateLinkDialog onClose={() => setModal(null)} />
      )}
      {modal === "edit" && <EditLinkDialog onClose={() => setModal(null)} />}
    </div>
  );
}
```

## 🚀 Advanced Patterns

### Debounced Search

```typescript
import { useQueryState } from "nuqs";
import { searchParser } from "@/lib/url-parsers";
import { useDebouncedValue } from "@/hooks/use-debounced-value";

export function SearchWithDebounce() {
  const [search, setSearch] = useQueryState("search", searchParser);
  const debouncedSearch = useDebouncedValue(search, 300);

  // Use debounced value for data fetching
  const { data } = useGetUserLinks(debouncedSearch);

  return (
    <input
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="Search..."
    />
  );
}
```

### History Options

```typescript
import { useQueryState } from "nuqs";
import { searchParser } from "@/lib/url-parsers";

export function HistoryControl() {
  const [search, setSearch] = useQueryState("search", searchParser);

  // Replace history instead of push (cleaner browser history)
  const handleSearch = (value: string) => {
    setSearch(value, { history: "replace" });
  };

  // Scroll to top on change
  const handleSearchWithScroll = (value: string) => {
    setSearch(value, { scroll: true });
  };

  return <SearchBar value={search} onChange={handleSearch} />;
}
```

### Shallow Routing (No Server Re-render)

```typescript
import { useQueryState } from "nuqs";
import { searchParser } from "@/lib/url-parsers";

export function ShallowSearch() {
  const [search, setSearch] = useQueryState(
    "search",
    searchParser.withOptions({
      shallow: true, // Don't trigger server re-render
    })
  );

  return <input value={search} onChange={(e) => setSearch(e.target.value)} />;
}
```

## 📂 File Organization

```
/lib
  ├── url-parsers.ts        # All nuqs parsers and searchParamsCache
  └── query-keys.ts         # React Query keys (include URL params)

/hooks
  ├── use-links-filters.ts  # Custom hook for links URL params
  ├── use-users-filters.ts  # Custom hook for users URL params
  └── use-[feature]-filters.ts  # One hook per feature

/components
  └── [feature]/
      └── component.tsx     # Use custom hooks (e.g., useLinksFilters)
```

## ✅ Best Practices

1. **Create custom hooks per feature** - Use hooks like `useLinksFilters()` to centralize URL param management (RECOMMENDED)
2. **Define parsers once** - Create reusable parsers in `/lib/url-parsers.ts`
3. **Type safety** - Always use parsers with `.withDefault()` for safety
4. **React Query integration** - Include URL params in query keys
5. **Replace history for filters** - Use `{ history: "replace" }` for better UX
6. **Shallow routing for frequent updates** - Use `shallow: true` to avoid re-renders
7. **Debounce search inputs** - Prevent excessive URL updates
8. **Use `null` to remove params** - Set param to `null` to remove from URL
9. **Batch updates** - Use `useQueryStates` for multiple params
10. **Server Components** - Use `searchParamsCache.parse()` for SSR
11. **Consistent naming** - Use consistent param names across the app
12. **Helper methods in hooks** - Add `updateSearch()`, `resetFilters()`, etc. for better DX

## ⚠️ Common Mistakes

### ❌ DON'T: Use raw searchParams

```typescript
// ❌ WRONG - Manual URL manipulation
const searchParams = useSearchParams();
const search = searchParams.get("search") || "";

const updateSearch = (value: string) => {
  const params = new URLSearchParams(searchParams);
  params.set("search", value);
  router.push(`?${params.toString()}`);
};
```

### ✅ DO: Use custom hooks with nuqs

```typescript
// ✅ CORRECT - Use custom hook
const { filters, updateSearch } = useLinksFilters();
```

---

### ❌ DON'T: Manage URL params directly in components

```typescript
// ❌ WRONG - Repetitive code in every component
export function Component1() {
  const [search, setSearch] = useQueryState("search", searchParser);
  const [status, setStatus] = useQueryState("status", statusParser);
  // ... repeated in multiple components
}
```

### ✅ DO: Use centralized custom hook

```typescript
// ✅ CORRECT - Reusable hook
export function Component1() {
  const { filters, updateSearch } = useLinksFilters();
}

export function Component2() {
  const { filters, resetFilters } = useLinksFilters();
}
```

---

### ❌ DON'T: Forget to include URL params in query keys

```typescript
// ❌ WRONG - Query won't re-fetch on search change
const { data } = useQuery({
  queryKey: ["links"], // Missing search param
  queryFn: () => getLinks(search),
});
```

### ✅ DO: Include params in query keys

```typescript
// ✅ CORRECT - Query re-fetches when search changes
const { data } = useQuery({
  queryKey: ["links", { search }],
  queryFn: () => getLinks(search),
});
```

---

### ❌ DON'T: Update multiple params separately

```typescript
// ❌ WRONG - Multiple URL updates
setSearch("test");
setStatus("active");
setSort("name");
```

### ✅ DO: Batch updates

```typescript
// ✅ CORRECT - Single URL update
setFilters({ search: "test", status: "active", sort: "name" });
```

## 🔍 Testing URL Parameters

```typescript
import { render } from "@testing-library/react";
import { NuqsAdapter } from "nuqs/adapters/next/app";

function renderWithNuqs(component: React.ReactElement) {
  return render(<NuqsAdapter>{component}</NuqsAdapter>);
}

test("search parameter updates URL", () => {
  const { getByPlaceholderText } = renderWithNuqs(<SearchComponent />);
  const input = getByPlaceholderText("Search...");

  fireEvent.change(input, { target: { value: "test" } });

  expect(window.location.search).toBe("?search=test");
});
```

## 📚 Resources

- **nuqs Documentation**: https://nuqs.47ng.com/
- **Next.js App Router Integration**: https://nuqs.47ng.com/docs/adapters/next
- **Server Components**: https://nuqs.47ng.com/docs/server-components

---

**Last Updated**: January 6, 2026  
**Version**: 1.0.0
