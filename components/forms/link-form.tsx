"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
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
import { createLink, updateLink } from "@/actions/links";
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isUpdateMode = !!initialData;

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

  async function onSubmit(data: CreateLinkInput | UpdateLinkInput) {
    setIsSubmitting(true);
    try {
      if (isUpdateMode && "id" in data) {
        const result = await updateLink(data.id, {
          originalUrl: data.originalUrl,
          shortCode: data.shortCode,
        });

        if (result.success) {
          toast.success("Link updated successfully");
          form.reset();
          onOpenChange(false);
          onSuccess?.();
        } else {
          toast.error(result.error || "Failed to update link");
        }
      } else {
        const result = await createLink(data as CreateLinkInput);

        if (result.success) {
          toast.success("Link created successfully");
          form.reset();
          onOpenChange(false);
          onSuccess?.();
        } else {
          toast.error(result.error || "Failed to create link");
        }
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error(error);
    } finally {
      setIsSubmitting(false);
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
