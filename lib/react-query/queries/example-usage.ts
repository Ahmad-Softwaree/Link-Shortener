import { useGetData, useAddData, useUpdateData, useDeleteData } from "./query";
import { links } from "@/lib/db/schema";
import { QUERY_KEYS } from "../keys";
import type { Link } from "@/lib/db/schema";

export function useLinks(queries?: any) {
  return useGetData<Link>({
    table: links,
    queryKey: [QUERY_KEYS.LINKS.ALL],
    queries,
  });
}

export function useCreateLink() {
  return useAddData({
    table: links,
    queryKey: [QUERY_KEYS.LINKS.ALL],
    uniqueField: "shortCode",
    successMessage: "Link created successfully",
  });
}

export function useEditLink(id: number) {
  return useUpdateData(id, {
    table: links,
    queryKey: [QUERY_KEYS.LINKS.ALL],
    uniqueField: "shortCode",
    successMessage: "Link updated successfully",
  });
}

export function useRemoveLink() {
  return useDeleteData({
    table: links,
    queryKey: [QUERY_KEYS.LINKS.ALL],
    successMessage: "Link deleted successfully",
  });
}
