/**
 * Generic Infinite List Component
 *
 * A reusable component for displaying paginated data with infinite scroll.
 * Can be used with any data type and custom render function.
 *
 * @example
 * ```tsx
 * <InfiniteList
 *   data={links}
 *   renderItem={(link) => <LinkCard key={link.id} link={link} />}
 *   isLoading={isLoading}
 *   isFetchingNextPage={isFetchingNextPage}
 *   hasNextPage={hasNextPage}
 *   fetchNextPage={fetchNextPage}
 *   error={error}
 *   emptyState={{
 *     icon: FileQuestion,
 *     title: "No links yet",
 *     description: "Create your first link to get started"
 *   }}
 * />
 * ```
 */

"use client";

import { useEffect, useRef } from "react";
import { LucideIcon } from "lucide-react";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface InfiniteListProps<T> {
  // Data and rendering
  data: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  getItemKey: (item: T, index: number) => string | number;

  // Pagination state
  isLoading: boolean;
  isFetchingNextPage?: boolean;
  hasNextPage?: boolean;
  fetchNextPage?: () => void;
  error?: Error | null;

  // Empty state configuration
  emptyState?: {
    icon?: LucideIcon;
    title: string;
    description?: string;
    action?: React.ReactNode;
  };

  // Error state configuration
  errorState?: {
    title?: string;
    message?: string;
    onRetry?: () => void;
  };

  // Loading state configuration
  loadingState?: {
    message?: string;
  };

  // Layout configuration
  containerClassName?: string;
  gridClassName?: string;
  loadMoreTrigger?: "button" | "scroll";

  // Intersection observer options (for scroll trigger)
  intersectionOptions?: IntersectionObserverInit;
}

export function InfiniteList<T>({
  data,
  renderItem,
  getItemKey,
  isLoading,
  isFetchingNextPage = false,
  hasNextPage = false,
  fetchNextPage,
  error,
  emptyState,
  errorState,
  loadingState,
  containerClassName,
  gridClassName = "grid gap-4 md:grid-cols-2 lg:grid-cols-3",
  loadMoreTrigger = "scroll",
  intersectionOptions = { threshold: 0.1 },
}: InfiniteListProps<T>) {
  const observerTarget = useRef<HTMLDivElement>(null);

  // Infinite scroll observer
  useEffect(() => {
    if (loadMoreTrigger !== "scroll" || !fetchNextPage) return;

    const observer = new IntersectionObserver((entries) => {
      if (
        entries[0].isIntersecting &&
        hasNextPage &&
        !isFetchingNextPage &&
        !isLoading
      ) {
        fetchNextPage();
      }
    }, intersectionOptions);

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [
    loadMoreTrigger,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    intersectionOptions,
  ]);

  // Initial loading state
  if (isLoading) {
    return (
      <LoadingSpinner
        size="lg"
        message={loadingState?.message}
        className={containerClassName}
      />
    );
  }

  // Error state
  if (error) {
    return (
      <ErrorState
        title={errorState?.title}
        message={errorState?.message || error.message}
        onRetry={errorState?.onRetry}
        className={containerClassName}
      />
    );
  }

  // Empty state
  if (data.length === 0) {
    return emptyState ? (
      <EmptyState
        icon={emptyState.icon}
        title={emptyState.title}
        description={emptyState.description}
        action={emptyState.action}
        className={containerClassName}
      />
    ) : (
      <div className={cn("text-center py-12", containerClassName)}>
        <p className="text-muted-foreground">No items found</p>
      </div>
    );
  }

  return (
    <div className={containerClassName}>
      {/* Items grid */}
      <div className={gridClassName}>
        {data.map((item, index) => (
          <div key={getItemKey(item, index)}>{renderItem(item, index)}</div>
        ))}
      </div>

      {/* Load more section */}
      {loadMoreTrigger === "scroll" ? (
        <>
          {/* Intersection observer target */}
          <div ref={observerTarget} className="h-10 mt-4" />

          {/* Fetching next page indicator */}
          {isFetchingNextPage && (
            <LoadingSpinner size="sm" message="Loading more..." />
          )}
        </>
      ) : (
        // Button trigger
        hasNextPage && (
          <div className="flex justify-center mt-8">
            <Button
              onClick={fetchNextPage}
              disabled={isFetchingNextPage}
              variant="outline"
              size="lg">
              {isFetchingNextPage ? "Loading..." : "Load More"}
            </Button>
          </div>
        )
      )}

      {/* End of list message */}
      {!hasNextPage && data.length > 0 && (
        <p className="text-center text-sm text-muted-foreground mt-8">
          You've reached the end
        </p>
      )}
    </div>
  );
}
