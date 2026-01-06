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
