import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useModalStore } from "@/lib/store/modal.store";
import {
  getData,
  getOneData,
  addData,
  updateData,
  deleteData,
  type PaginationResult,
  type CRUDReturn,
} from "../actions/action";
import type { QueryParam } from "@/types/global";
import type { PgTable } from "drizzle-orm/pg-core";

type UseGetDataOptions<T> = {
  table: PgTable;
  queryKey: string[];
  queries?: QueryParam;
  enabled?: boolean;
};

export function useGetData<T>({
  table,
  queryKey,
  queries,
  enabled = true,
}: UseGetDataOptions<T>) {
  const { userId } = useAuth();

  return useQuery({
    queryKey: [...queryKey, queries],
    queryFn: (): Promise<PaginationResult<T>> =>
      getData<T>(table, userId!, queries),
    retry: 0,
    enabled: !!userId && enabled,
  });
}

type UseGetOneDataOptions<T> = {
  table: PgTable;
  queryKey: string[];
  id: number;
  enabled?: boolean;
};

export function useGetOneData<T>({
  table,
  queryKey,
  id,
  enabled = true,
}: UseGetOneDataOptions<T>) {
  const { userId } = useAuth();

  return useQuery({
    queryKey: [...queryKey, id],
    queryFn: (): Promise<T | null> => getOneData<T>(table, id, userId!),
    retry: 0,
    enabled: !!userId && !!id && enabled,
  });
}

type UseMutationOptions = {
  table: PgTable;
  queryKey: string[];
  uniqueField?: string;
  closeTheModal?: boolean;
  successMessage?: string;
  errorMessage?: string;
};

export function useAddData({
  table,
  queryKey,
  uniqueField,
  closeTheModal = true,
  successMessage,
}: UseMutationOptions) {
  const { userId } = useAuth();
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { closeModal } = useModalStore();

  return useMutation({
    mutationFn: async (form: Record<string, any>): Promise<CRUDReturn> =>
      addData(table, form, userId!, uniqueField),
    onSuccess: ({ message }) => {
      toast.success(
        successMessage || message || t("toast.created_successfully")
      );
      if (closeTheModal) closeModal();
      return queryClient.invalidateQueries({
        queryKey,
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || t("toast.error_occurred"));
    },
  });
}

export function useUpdateData(
  id: number,
  {
    table,
    queryKey,
    uniqueField,
    closeTheModal = true,
    successMessage,
  }: UseMutationOptions
) {
  const { userId } = useAuth();
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { closeModal } = useModalStore();

  return useMutation({
    mutationFn: async (form: Record<string, any>): Promise<CRUDReturn> =>
      updateData(table, id, form, userId!, uniqueField),
    onSuccess: ({ message }) => {
      toast.success(
        successMessage || message || t("toast.updated_successfully")
      );
      if (closeTheModal) closeModal();
      return queryClient.invalidateQueries({
        queryKey,
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || t("toast.error_occurred"));
    },
  });
}

export function useDeleteData({
  table,
  queryKey,
  successMessage,
}: UseMutationOptions) {
  const { userId } = useAuth();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: async (id: number): Promise<CRUDReturn> =>
      deleteData(table, id, userId!),
    onSuccess: ({ message }) => {
      toast.success(
        successMessage || message || t("toast.deleted_successfully")
      );
      return queryClient.invalidateQueries({
        queryKey,
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || t("toast.error_occurred"));
    },
  });
}
