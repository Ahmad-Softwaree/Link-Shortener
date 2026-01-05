/**
 * React Query Hooks for Links
 *
 * This file contains all React Query hooks for link operations.
 * For every server action, there should be a corresponding query hook.
 *
 * Pattern:
 * - useGet[Resource] for queries (GET operations)
 * - useCreate[Resource] for mutations (CREATE operations)
 * - useUpdate[Resource] for mutations (UPDATE operations)
 * - useDelete[Resource] for mutations (DELETE operations)
 */

"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createLink,
  getUserLinks,
  getUserLinksPaginated,
  getLinkById,
  getLinkByShortCode,
  updateLink,
  deleteLink,
} from "@/actions/links";
import { queryKeys } from "@/lib/query-keys";
import type { Link } from "@/db/schema";

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

/**
 * Hook to fetch a link by short code
 */
export function useGetLinkByShortCode(shortCode: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.links.byShortCode(shortCode),
    queryFn: async () => {
      const result = await getLinkByShortCode(shortCode);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    enabled,
  });
}

/**
 * Hook to fetch user links with infinite pagination
 * Perfect for infinite scroll implementation
 * @param limit - Number of items per page
 * @param search - Search query to filter links
 */
export function useGetUserLinksInfinite(limit = 10, search?: string) {
  return useInfiniteQuery({
    queryKey: queryKeys.links.list({ limit, search }),
    queryFn: async ({ pageParam }) => {
      const result = await getUserLinksPaginated({
        cursor: pageParam,
        limit,
        search,
      });
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    select: (data) => ({
      pages: data.pages,
      pageParams: data.pageParams,
      // Flatten all items from all pages
      items: data.pages.flatMap((page) => page.items),
    }),
  });
}

// ============================================
// MUTATION Hooks (CREATE, UPDATE, DELETE)
// ============================================

/**
 * Hook to create a new link
 * Toast notifications are handled at the mutation level
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
      // Invalidate and refetch user links (both regular and infinite)
      queryClient.invalidateQueries({ queryKey: queryKeys.links.userLinks() });
      queryClient.invalidateQueries({ queryKey: queryKeys.links.lists() });
      // Show success toast
      toast.success("Link created successfully");
    },
    onError: (error: Error) => {
      // Show error toast
      toast.error(error.message || "Failed to create link");
    },
  });
}

/**
 * Hook to update an existing link
 * Toast notifications are handled at the mutation level
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
      // Invalidate specific link and user links (both regular and infinite)
      if (data) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.links.detail(data.id),
        });
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.links.userLinks() });
      queryClient.invalidateQueries({ queryKey: queryKeys.links.lists() });
      // Show success toast
      toast.success("Link updated successfully");
    },
    onError: (error: Error) => {
      // Show error toast
      toast.error(error.message || "Failed to update link");
    },
  });
}

/**
 * Hook to delete a link
 * Toast notifications are handled at the mutation level
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
      // Invalidate user links to refetch (both regular and infinite)
      queryClient.invalidateQueries({ queryKey: queryKeys.links.userLinks() });
      queryClient.invalidateQueries({ queryKey: queryKeys.links.lists() });
      // Show success toast
      toast.success("Link deleted successfully");
    },
    onError: (error: Error) => {
      // Show error toast
      toast.error(error.message || "Failed to delete link");
    },
  });
}

// ============================================
// OPTIMISTIC UPDATE Example (Optional)
// ============================================

/**
 * Hook to delete a link with optimistic updates
 * This provides instant UI feedback before the server responds
 */
export function useDeleteLinkOptimistic() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const result = await deleteLink(id);
      if (!result.success) {
        throw new Error(result.error);
      }
      return id;
    },
    onMutate: async (deletedId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: queryKeys.links.userLinks(),
      });

      // Snapshot previous value
      const previousLinks = queryClient.getQueryData<Link[]>(
        queryKeys.links.userLinks()
      );

      // Optimistically update to remove the link
      queryClient.setQueryData<Link[]>(
        queryKeys.links.userLinks(),
        (old) => old?.filter((link) => link.id !== deletedId) ?? []
      );

      // Return context with previous value
      return { previousLinks };
    },
    onSuccess: () => {
      toast.success("Link deleted successfully");
    },
    onError: (error: Error, deletedId, context) => {
      // Rollback on error
      if (context?.previousLinks) {
        queryClient.setQueryData(
          queryKeys.links.userLinks(),
          context.previousLinks
        );
      }
      toast.error(error.message || "Failed to delete link");
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: queryKeys.links.userLinks() });
    },
  });
}
