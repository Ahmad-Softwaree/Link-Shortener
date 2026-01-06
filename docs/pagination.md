# Pagination Standards

**Last Updated**: January 6, 2026  
**Version**: 1.0.0

## 📋 Overview

This document defines the standards for implementing pagination across the Link Shortener application. All paginated data MUST use the generic pagination component with consistent patterns for both table and card layouts.

## 🎯 Core Principles

- **Single Generic Component**: Use ONE reusable pagination component for all data display
- **Two Display Modes**: Tables (TanStack Table) OR Cards (shadcn components)
- **Infinite Scroll**: Default pagination strategy using React Query infinite queries
- **Type Safety**: Full TypeScript support with generic types
- **Consistent UX**: Unified loading, empty, and error states

## 📦 Required Dependencies

```bash
# React Query for data fetching
bun add @tanstack/react-query

# TanStack Table for table pagination
bun add @tanstack/react-table

# shadcn/ui components for UI (already installed)
```

## 🏗️ Component Structure

### File Organization

```
components/
  shared/
    pagination-wrapper.tsx      # Generic pagination component
    table-pagination.tsx         # Table-specific wrapper
    card-pagination.tsx          # Card-specific wrapper
    infinite-scroll.tsx          # Infinite scroll observer hook
```

## 🔧 Implementation Patterns

### 1. Generic Pagination Component

Create a generic `PaginationWrapper` component that handles both table and card displays:

```typescript
// components/shared/pagination-wrapper.tsx
"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { LoadingSpinner } from "./loading-spinner";
import { EmptyState } from "./empty-state";
import { ErrorState } from "./error-state";

interface PaginationWrapperProps<T> {
  queryKey: string[];
  queryFn: (params: {
    pageParam: number;
  }) => Promise<{ data: T[]; nextPage: number | null }>;
  renderMode: "table" | "cards";
  // For table mode
  columns?: any[];
  // For card mode
  CardComponent?: React.ComponentType<T>;
  gridClassName?: string;
  // Common props
  emptyMessage?: string;
  loadMoreButton?: boolean;
}

export function PaginationWrapper<T>({
  queryKey,
  queryFn,
  renderMode,
  columns,
  CardComponent,
  gridClassName,
  emptyMessage = "No data found",
  loadMoreButton = false,
}: PaginationWrapperProps<T>) {
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey,
    queryFn,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
  });

  // Infinite scroll observer
  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage || loadMoreButton) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 1 }
    );

    const node = loadMoreRef.current;
    if (node) observer.observe(node);

    return () => {
      if (node) observer.unobserve(node);
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, loadMoreButton]);

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorState message={error?.message} />;

  const allItems = data?.pages?.flatMap((page) => page.data) ?? [];

  if (allItems.length === 0) {
    return <EmptyState message={emptyMessage} />;
  }

  return (
    <div className="w-full space-y-4">
      {renderMode === "table" && columns ? (
        <TableView data={allItems} columns={columns} />
      ) : renderMode === "cards" && CardComponent ? (
        <div
          className={
            gridClassName ||
            "grid gap-4 grid-cols-[repeat(auto-fill,minmax(250px,1fr))]"
          }>
          {allItems.map((item, index) => (
            <CardComponent key={index} {...(item as any)} />
          ))}
        </div>
      ) : null}

      {/* Load more trigger */}
      {hasNextPage && (
        <div
          ref={loadMoreRef}
          className="h-10 flex justify-center items-center">
          {isFetchingNextPage && <LoadingSpinner />}
        </div>
      )}
    </div>
  );
}
```

### 2. Table Display (TanStack Table)

**ALWAYS use TanStack Table for table displays:**

```typescript
// components/shared/table-pagination.tsx
"use client";

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TableViewProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
}

export function TableView<T>({ data, columns }: TableViewProps<T>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
```

### 3. Card Display (shadcn Components)

**ALWAYS use shadcn components for card displays:**

```typescript
// Example usage with LinkCard component
import { PaginationWrapper } from "@/components/shared/pagination-wrapper";
import { LinkCard } from "@/components/cards/link-card";

export function LinkList() {
  return (
    <PaginationWrapper
      queryKey={["links"]}
      queryFn={fetchLinks}
      renderMode="cards"
      CardComponent={LinkCard}
      gridClassName="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      emptyMessage="No links found"
    />
  );
}
```

## 📐 Data Fetching Patterns

### Query Function Structure

All paginated query functions MUST return this structure:

```typescript
// queries/links.ts
export async function fetchLinks({ pageParam = 1 }) {
  const response = await fetch(`/api/links?page=${pageParam}`);
  const data = await response.json();

  return {
    data: data.items,
    nextPage: data.hasMore ? pageParam + 1 : null,
  };
}
```

### Server Action Pattern

```typescript
// actions/links.ts
"use server";

export async function getLinksAction(page: number = 1, limit: number = 10) {
  const offset = (page - 1) * limit;

  const links = await db.query.links.findMany({
    limit: limit + 1, // Fetch one extra to check if there's more
    offset,
    orderBy: (links, { desc }) => [desc(links.createdAt)],
  });

  const hasMore = links.length > limit;
  const items = hasMore ? links.slice(0, -1) : links;

  return {
    data: items,
    nextPage: hasMore ? page + 1 : null,
  };
}
```

## 🎨 Display Mode Guidelines

### When to Use Tables

- **Data-heavy listings**: Multiple columns of structured data
- **Comparison views**: When users need to compare values across rows
- **Admin dashboards**: Managing records with actions
- **Reports**: Analytics and metrics displays

### When to Use Cards

- **Visual content**: Links with preview images, QR codes
- **Rich metadata**: Multiple fields with icons and badges
- **Mobile-first**: Better responsive experience
- **User-facing**: Public-facing link galleries

## 🔄 Loading States

```typescript
// components/shared/loading-spinner.tsx
export function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
    </div>
  );
}
```

## 📊 Grid Layouts by Page Type

```typescript
const gridClasses = {
  // Two columns on medium+
  twoColumn: "grid gap-4 grid-cols-1 md:grid-cols-2",

  // Three columns responsive
  threeColumn: "grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3",

  // Auto-fill with min width
  autoFill: "grid gap-4 grid-cols-[repeat(auto-fill,minmax(250px,1fr))]",

  // Single column (forms, detailed views)
  singleColumn: "grid gap-4 grid-cols-1",
};
```

## 🚫 Anti-Patterns

**❌ DO NOT:**

- Create separate pagination components for each page
- Use third-party pagination libraries (e.g., react-paginate)
- Implement offset-based pagination without infinite scroll
- Mix table and card rendering logic in the same component
- Use non-shadcn components for cards
- Use non-TanStack solutions for tables
- Hardcode page-specific logic in the generic component

**✅ DO:**

- Use the generic `PaginationWrapper` component
- Keep table and card logic separated
- Use TanStack Table for ALL table displays
- Use shadcn components for ALL card displays
- Handle loading and empty states consistently
- Support both auto-scroll and button-based pagination

## 📝 Usage Examples

### Table Example (Admin Dashboard)

```typescript
// app/admin/links/page.tsx
import { PaginationWrapper } from "@/components/shared/pagination-wrapper";
import { ColumnDef } from "@tanstack/react-table";
import { Link } from "@/db/schema";

const columns: ColumnDef<Link>[] = [
  { accessorKey: "code", header: "Code" },
  { accessorKey: "originalUrl", header: "URL" },
  { accessorKey: "clicks", header: "Clicks" },
];

export default function LinksPage() {
  return (
    <PaginationWrapper
      queryKey={["admin-links"]}
      queryFn={fetchAdminLinks}
      renderMode="table"
      columns={columns}
    />
  );
}
```

### Card Example (User Dashboard)

```typescript
// app/dashboard/page.tsx
import { PaginationWrapper } from "@/components/shared/pagination-wrapper";
import { LinkCard } from "@/components/cards/link-card";

export default function DashboardPage() {
  return (
    <PaginationWrapper
      queryKey={["user-links"]}
      queryFn={fetchUserLinks}
      renderMode="cards"
      CardComponent={LinkCard}
      gridClassName="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
    />
  );
}
```

## 🔍 Search & Filters Integration

```typescript
// Integrate with query params
import { useSearchParams } from "next/navigation";

export function FilteredLinkList() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";

  return (
    <PaginationWrapper
      queryKey={["links", { search }]}
      queryFn={({ pageParam }) => fetchLinks({ pageParam, search })}
      renderMode="cards"
      CardComponent={LinkCard}
    />
  );
}
```

## ✅ Checklist

Before implementing pagination:

- [ ] Choose correct display mode (table vs cards)
- [ ] Use `PaginationWrapper` component
- [ ] For tables: Define TanStack Table columns
- [ ] For cards: Create shadcn-based card component
- [ ] Implement query function with correct return type
- [ ] Add loading, empty, and error states
- [ ] Test infinite scroll behavior
- [ ] Verify responsive grid layout
- [ ] Integrate search/filter params if needed

---

**Questions?** Refer to [Data Fetching](data-fetching.md) for query patterns and [UI Components](ui-components.md) for shadcn usage.
