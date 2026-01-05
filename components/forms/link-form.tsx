"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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
import {
  createLinkSchema,
  updateLinkSchema,
  type CreateLinkInput,
  type UpdateLinkInput,
} from "@/types/validation/links";
import { useCreateLink, useUpdateLink } from "@/queries/links";
import type { Link } from "@/db/schema";

interface LinkFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Link;
  onSuccess?: () => void;
}

export function LinkForm({
  open,
  onOpenChange,
  initialData,
  onSuccess,
}: LinkFormProps) {
  const isUpdateMode = !!initialData;

  // React Query mutations
  const createMutation = useCreateLink();
  const updateMutation = useUpdateLink();

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  // Use appropriate schema based on mode
  const schema = isUpdateMode ? updateLinkSchema : createLinkSchema;

  const form = useForm<CreateLinkInput | UpdateLinkInput>({
    resolver: zodResolver(schema),
    defaultValues: initialData
      ? {
          id: initialData.id,
          originalUrl: initialData.originalUrl,
          shortCode: initialData.shortCode,
        }
      : {
          originalUrl: "",
          shortCode: "",
        },
  });

  // Reset form when modal opens or initialData changes
  useEffect(() => {
    if (open) {
      if (initialData) {
        form.reset({
          id: initialData.id,
          originalUrl: initialData.originalUrl,
          shortCode: initialData.shortCode,
        });
      } else {
        form.reset({
          originalUrl: "",
          shortCode: "",
        });
      }
    }
  }, [open, initialData, form]);

  async function onSubmit(data: CreateLinkInput | UpdateLinkInput) {
    if (isUpdateMode && "id" in data) {
      updateMutation.mutate(
        {
          id: data.id,
          data: {
            originalUrl: data.originalUrl,
            shortCode: data.shortCode,
          },
        },
        {
          onSuccess: () => {
            form.reset();
            onOpenChange(false);
            onSuccess?.();
          },
        }
      );
    } else {
      createMutation.mutate(data as CreateLinkInput, {
        onSuccess: () => {
          form.reset();
          onOpenChange(false);
          onSuccess?.();
        },
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isUpdateMode ? "Edit Link" : "Create New Link"}
          </DialogTitle>
          <DialogDescription>
            {isUpdateMode
              ? "Update your shortened link details."
              : "Create a new shortened link by entering the URL and a custom short code."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="originalUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Original URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com/very-long-url"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormDescription>
                    The full URL you want to shorten
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
                  <FormLabel>Short Code</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="my-link"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormDescription>
                    Custom short code for your URL (letters, numbers, hyphens,
                    underscores)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? isUpdateMode
                    ? "Updating..."
                    : "Creating..."
                  : isUpdateMode
                  ? "Update Link"
                  : "Create Link"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
