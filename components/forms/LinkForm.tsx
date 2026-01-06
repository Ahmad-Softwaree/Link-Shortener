"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getLinkValidation } from "@/validation/links";
import {
  useAddLink,
  useUpdateLink,
} from "@/lib/react-query/queries/links.query";
import { useModalStore } from "@/lib/store/modal.store";
import type { GlobalFormProps } from "@/types/global";

interface FormFinalOperation {
  onFinalClose?: () => void;
}

export const LinkForm = ({
  onFinalClose,
  state,
}: FormFinalOperation & GlobalFormProps) => {
  const { t, i18n } = useTranslation();
  const { modalData, closeModal } = useModalStore();
  const linkValidation = getLinkValidation(t);

  const form = useForm<z.infer<typeof linkValidation>>({
    resolver: zodResolver(linkValidation),
    defaultValues: { ...modalData },
  });

  const { mutateAsync: addMutate, isPending: isAdding } = useAddLink({
    successMessage: t("toast.link_created"),
  });

  const { mutateAsync: updateMutate, isPending: isUpdating } = useUpdateLink({
    successMessage: t("toast.link_updated"),
  });

  const isPending = isAdding || isUpdating;

  const onSubmit: SubmitHandler<z.infer<typeof linkValidation>> = async (
    data
  ) => {
    if (state === "insert") {
      await addMutate(data).then(() => {
        form.reset();
        if (onFinalClose) onFinalClose();
        else closeModal();
      });
    } else {
      await updateMutate({ id: modalData?.id, form: data }).then(() => {
        form.reset();
        if (onFinalClose) onFinalClose();
        else closeModal();
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="originalUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("form.original_url")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t("form.original_url_placeholder")}
                  {...field}
                  disabled={isPending}
                  className="text-base"
                />
              </FormControl>
              <FormDescription className="text-xs">
                {t("form.original_url_description")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="shortCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("form.short_code")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t("form.short_code_placeholder")}
                  {...field}
                  disabled={isPending}
                  className="text-base"
                />
              </FormControl>
              <FormDescription className="text-xs">
                {t("form.short_code_description")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              form.reset();
              if (onFinalClose) onFinalClose();
              else closeModal();
            }}
            disabled={isPending}>
            {t("form.cancel")}
          </Button>
          <Button type="submit" disabled={isPending} className="min-w-[120px]">
            {isPending
              ? state === "insert"
                ? t("form.creating")
                : t("form.updating")
              : t("form.submit")}
          </Button>
        </div>
      </form>
    </Form>
  );
};
