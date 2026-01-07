"use client";

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
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
} from "@/lib/react-query/actions/link.action";
import type { QueryParam } from "@/types/global";
import type { NewLink } from "@/lib/db/schema";
import { QUERY_KEYS } from "../keys";

export const useGetLinks = (queryKey: [string, QueryParam]) => {
  const [name, params] = queryKey;
  return useInfiniteQuery({
    queryKey: [name, params],
    queryFn: ({ pageParam }) =>
      getLinks(params, pageParam as number | undefined),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _, lastPageParam) => {
      return lastPage.hasMore ? lastPageParam + 1 : undefined;
    },
  });
};

export const useGetLink = (id: number | null) => {
  const { userId } = useAuth();

  return useQuery({
    queryKey: [QUERY_KEYS.LINK, id],
    queryFn: () => getLink(id ?? 0, userId!),
    enabled: !!id && !!userId,
  });
};

export const useAddLink = ({
  closeTheModal,
  successMessage,
}: {
  closeTheModal?: () => void;
  successMessage?: string;
}) => {
  const { t } = useTranslation();
  const { userId } = useAuth();
  const queryClient = useQueryClient();
  const { closeModal } = useModalStore();

  return useMutation({
    mutationFn: (form: Omit<NewLink, "userId">) => addLink(form, userId!),
    onSuccess: (data) => {
      toast.success(successMessage || data.message || t("toast.link_created"));
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LINKS] });
      closeModal();
      closeTheModal?.();
    },
    onError: (error: Error) => {
      toast.error(error.message || t("toast.error_occurred"));
    },
  });
};

export const useUpdateLink = ({
  closeTheModal,
  successMessage,
}: {
  closeTheModal?: () => void;
  successMessage?: string;
}) => {
  const { t } = useTranslation();
  const { userId } = useAuth();
  const queryClient = useQueryClient();
  const { closeModal } = useModalStore();

  return useMutation({
    mutationFn: ({
      id,
      form,
    }: {
      id: number;
      form: Partial<Omit<NewLink, "userId">>;
    }) => updateLink(id, form, userId!),
    onSuccess: (data) => {
      toast.success(successMessage || data.message || t("toast.link_updated"));
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LINKS] });
      closeModal();
      closeTheModal?.();
    },
    onError: (error: Error) => {
      toast.error(error.message || t("toast.error_occurred"));
    },
  });
};

export const useDeleteLink = ({
  closeTheModal,
  successMessage,
}: {
  closeTheModal?: () => void;
  successMessage?: string;
}) => {
  const { t } = useTranslation();
  const { userId } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteLink(id, userId!),
    onSuccess: (data) => {
      toast.success(successMessage || data.message || t("toast.link_deleted"));
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LINKS] });
      closeTheModal?.();
    },
    onError: (error: Error) => {
      toast.error(error.message || t("toast.error_occurred"));
    },
  });
};
