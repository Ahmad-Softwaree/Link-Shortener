/**
 * InfiniteList Component - Usage Examples
 *
 * This file demonstrates how to use the generic InfiniteList component
 * with different data types and configurations.
 */

import { InfiniteList } from "@/components/shared/infinite-list";
import { LinkCard } from "@/components/cards/link-card";
import { useGetUserLinksInfinite } from "@/queries/links";
import { FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Link } from "@/db/schema";

// ============================================
// Example 1: Infinite Scroll (Default)
// ============================================

export function LinksInfiniteScroll() {
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetUserLinksInfinite(12);

  return (
    <InfiniteList<Link>
      data={data?.items || []}
      renderItem={(link) => <LinkCard link={link} />}
      getItemKey={(link) => link.id}
      isLoading={isLoading}
      isFetchingNextPage={isFetchingNextPage}
      hasNextPage={hasNextPage}
      fetchNextPage={fetchNextPage}
      error={error}
      emptyState={{
        icon: FileQuestion,
        title: "No links yet",
        description: "Create your first link to get started",
      }}
      loadMoreTrigger="scroll" // Auto-load on scroll
    />
  );
}

// ============================================
// Example 2: Load More Button
// ============================================

export function LinksWithButton() {
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetUserLinksInfinite(10);

  return (
    <InfiniteList<Link>
      data={data?.items || []}
      renderItem={(link) => <LinkCard link={link} />}
      getItemKey={(link) => link.id}
      isLoading={isLoading}
      isFetchingNextPage={isFetchingNextPage}
      hasNextPage={hasNextPage}
      fetchNextPage={fetchNextPage}
      error={error}
      emptyState={{
        title: "No links found",
      }}
      loadMoreTrigger="button" // Manual load with button
    />
  );
}

// ============================================
// Example 3: Custom Grid Layout
// ============================================

export function LinksCustomGrid() {
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetUserLinksInfinite(20);

  return (
    <InfiniteList<Link>
      data={data?.items || []}
      renderItem={(link) => <LinkCard link={link} />}
      getItemKey={(link) => link.id}
      isLoading={isLoading}
      isFetchingNextPage={isFetchingNextPage}
      hasNextPage={hasNextPage}
      fetchNextPage={fetchNextPage}
      error={error}
      // Custom grid: 1 column on mobile, 2 on tablet, 4 on desktop
      gridClassName="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
    />
  );
}

// ============================================
// Example 4: With Custom Empty State Action
// ============================================

export function LinksWithCustomEmpty() {
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetUserLinksInfinite(10);

  return (
    <InfiniteList<Link>
      data={data?.items || []}
      renderItem={(link) => <LinkCard link={link} />}
      getItemKey={(link) => link.id}
      isLoading={isLoading}
      isFetchingNextPage={isFetchingNextPage}
      hasNextPage={hasNextPage}
      fetchNextPage={fetchNextPage}
      error={error}
      emptyState={{
        icon: FileQuestion,
        title: "No links yet",
        description: "Get started by creating your first shortened link",
        action: <Button size="lg">Create Your First Link</Button>,
      }}
    />
  );
}

// ============================================
// Example 5: Generic Usage with Any Data Type
// ============================================

interface CustomItem {
  id: number;
  name: string;
  description: string;
}

export function GenericListExample() {
  // Your custom infinite query hook
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useYourCustomInfiniteQuery();

  return (
    <InfiniteList<CustomItem>
      data={data?.items || []}
      renderItem={(item) => (
        <div className="p-4 border rounded-lg">
          <h3 className="font-bold">{item.name}</h3>
          <p className="text-sm text-muted-foreground">{item.description}</p>
        </div>
      )}
      getItemKey={(item) => item.id}
      isLoading={isLoading}
      isFetchingNextPage={isFetchingNextPage}
      hasNextPage={hasNextPage}
      fetchNextPage={fetchNextPage}
      error={error}
      gridClassName="grid gap-4 md:grid-cols-2"
    />
  );
}

// Placeholder for example
function useYourCustomInfiniteQuery(): any {
  return {};
}
