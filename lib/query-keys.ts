/**
 * Centralized Query Keys for React Query
 *
 * This file contains all query keys used in the application.
 * Organizing keys this way ensures consistency and makes it easy
 * to invalidate or refetch related queries.
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
    search: (query: string) =>
      [...queryKeys.links.all, "search", query] as const,
  },

  // Add more resources as needed
  // Example:
  // analytics: {
  //   all: ["analytics"] as const,
  //   byLink: (linkId: number) => [...queryKeys.analytics.all, "link", linkId] as const,
  // },
} as const;
