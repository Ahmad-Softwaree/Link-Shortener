# Forms & Validation

## Overview

This project uses **shadcn/ui Form components** with **react-hook-form** and **Zod** for all form handling and validation. This combination provides type-safe, accessible, and performant forms.

## Tech Stack

- **UI Components**: shadcn/ui Form components
- **Form Library**: react-hook-form
- **Validation**: Zod schemas
- **Database**: Drizzle ORM with PostgreSQL (Neon)

## Core Principles

### ✅ DO

- **Use shadcn/ui Form components** for all forms
- **Use react-hook-form** for form state management
- **Use Zod** for validation schemas
- **Create separate validation files** for each database table
- **Organize validation files** in `/types/validation/` or `/types/zod/`
- **Organize form components** in `/components/forms/`
- **Ask about form type** (modal vs page) before implementation
- **Follow standard patterns** for consistency

### ❌ DON'T

- **Use plain HTML forms** without react-hook-form
- **Create custom validation logic** instead of Zod schemas
- **Mix validation logic** with component code
- **Skip form accessibility** features

## File Organization

### Directory Structure

```
types/
  validation/           # or /types/zod/
    links.ts           # Zod schema for links table
    users.ts           # Zod schema for users table
    analytics.ts       # Zod schema for analytics table

components/
  forms/
    link-form.tsx      # Link form component (modal or page)
    user-form.tsx      # User form component (modal or page)
    analytics-form.tsx # Analytics form component (modal or page)
```

### Validation File Pattern

**One validation file per database table**

Each database table should have its own Zod validation file that:

- Mirrors the database schema structure
- Exports typed schemas for create and update operations
- Provides type exports for TypeScript

**Example**: `types/validation/links.ts`

```typescript
import { z } from "zod";

// Base schema matching the database table
export const linkSchema = z.object({
  id: z.string().uuid().optional(),
  userId: z.string().min(1, "User ID is required"),
  originalUrl: z.string().url("Must be a valid URL"),
  shortCode: z.string().min(3, "Short code must be at least 3 characters"),
  title: z.string().min(1, "Title is required").max(100, "Title too long"),
  description: z.string().max(500, "Description too long").optional(),
  isActive: z.boolean().default(true),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// Create schema (omit auto-generated fields)
export const createLinkSchema = linkSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Update schema (all fields optional except id)
export const updateLinkSchema = linkSchema
  .omit({
    createdAt: true,
    updatedAt: true,
  })
  .partial()
  .required({ id: true });

// Type exports
export type Link = z.infer<typeof linkSchema>;
export type CreateLink = z.infer<typeof createLinkSchema>;
export type UpdateLink = z.infer<typeof updateLinkSchema>;
```

## Form Types

### ⚠️ ALWAYS Ask Before Creating Forms

**Before implementing any form, ask the user:**

> "Should this form be a **modal** or a **page**?"

This determines the implementation pattern:

### 1. Modal Forms

**Use when**: Quick actions, editing existing records, inline creation

**Features**:

- Handles both **create** and **update** states
- Uses shadcn/ui Dialog component
- Compact, focused UI
- Closes on success

**Example**: `components/forms/link-form.tsx`

```typescript
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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  createLinkSchema,
  updateLinkSchema,
  type CreateLink,
  type UpdateLink,
} from "@/types/validation/links";
import { createLink, updateLink } from "@/actions/links";

interface LinkFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: UpdateLink; // If provided, form is in update mode
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

  const form = useForm<CreateLink | UpdateLink>({
    resolver: zodResolver(schema),
    defaultValues: initialData || {
      userId: "",
      originalUrl: "",
      shortCode: "",
      title: "",
      description: "",
      isActive: true,
    },
  });

  async function onSubmit(data: CreateLink | UpdateLink) {
    setIsSubmitting(true);
    try {
      if (isUpdateMode) {
        await updateLink(data as UpdateLink);
        toast.success("Link updated successfully");
      } else {
        await createLink(data as CreateLink);
        toast.success("Link created successfully");
      }
      form.reset();
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      toast.error(
        isUpdateMode ? "Failed to update link" : "Failed to create link"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isUpdateMode ? "Edit Link" : "Create Link"}
          </DialogTitle>
          <DialogDescription>
            {isUpdateMode
              ? "Update the link details below."
              : "Fill in the details to create a new short link."}
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
                    <Input placeholder="https://example.com" {...field} />
                  </FormControl>
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
                    <Input placeholder="my-link" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="My Link" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Description of this link"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
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
```

### 2. Page Forms

**Use when**: Multi-step forms, extensive data entry, dedicated form pages

**Features**:

- Full-page layout
- Breadcrumb navigation
- Cancel redirects to previous page
- Success redirects to appropriate page
- Follows Next.js App Router patterns

**Example**: `app/links/new/page.tsx`

```typescript
import { redirect } from "next/navigation";
import { LinkPageForm } from "@/components/forms/link-page-form";

export default function NewLinkPage() {
  return (
    <div className="container max-w-2xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Create New Link</h1>
        <p className="text-muted-foreground mt-2">
          Fill in the details to create a new short link.
        </p>
      </div>
      <LinkPageForm />
    </div>
  );
}
```

**Example**: `components/forms/link-page-form.tsx`

```typescript
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createLinkSchema, type CreateLink } from "@/types/validation/links";
import { createLink } from "@/actions/links";

export function LinkPageForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateLink>({
    resolver: zodResolver(createLinkSchema),
    defaultValues: {
      userId: "",
      originalUrl: "",
      shortCode: "",
      title: "",
      description: "",
      isActive: true,
    },
  });

  async function onSubmit(data: CreateLink) {
    setIsSubmitting(true);
    try {
      const result = await createLink(data);
      toast.success("Link created successfully");
      router.push("/dashboard"); // Redirect to dashboard
      router.refresh(); // Refresh server data
    } catch (error) {
      toast.error("Failed to create link");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="originalUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Original URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com" {...field} />
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
                    <Input placeholder="my-link" {...field} />
                  </FormControl>
                  <FormDescription>
                    Custom short code for your link (e.g., "my-link")
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="My Link" {...field} />
                  </FormControl>
                  <FormDescription>
                    A descriptive title for this link
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Description of this link"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormDescription>
                    Additional details about this link
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Link"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
```

## Required Dependencies

Ensure these packages are installed:

```bash
npx shadcn@latest add form
npm install react-hook-form @hookform/resolvers zod
```

## Best Practices

### 1. Type Safety

- Always use Zod schemas for validation
- Export TypeScript types from schemas
- Use typed Server Actions

### 2. User Experience

- Show loading states during submission
- Display toast notifications for success/error
- Clear form after successful submission (modal)
- Redirect after successful submission (page)
- Disable form during submission

### 3. Accessibility

- Use proper form labels
- Include form descriptions where helpful
- Show validation errors inline
- Support keyboard navigation
- Use semantic HTML

### 4. Validation

- Validate on submit (default)
- Show field errors immediately after blur
- Use descriptive error messages
- Match database constraints in Zod schemas

### 5. Code Organization

- Keep validation logic separate from components
- One form component per entity
- Reuse form components for create/update (modal)
- Separate page forms when needed

## Common Patterns

### Modal Trigger Example

```typescript
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LinkForm } from "@/components/forms/link-form";

export function CreateLinkButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Create Link</Button>
      <LinkForm
        open={open}
        onOpenChange={setOpen}
        onSuccess={() => {
          // Refresh data or update UI
        }}
      />
    </>
  );
}
```

### Update Modal Example

```typescript
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LinkForm } from "@/components/forms/link-form";
import type { UpdateLink } from "@/types/validation/links";

interface EditLinkButtonProps {
  link: UpdateLink;
}

export function EditLinkButton({ link }: EditLinkButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Edit
      </Button>
      <LinkForm
        open={open}
        onOpenChange={setOpen}
        initialData={link}
        onSuccess={() => {
          // Refresh data or update UI
        }}
      />
    </>
  );
}
```

## Checklist

Before implementing a form:

- [ ] Ask if form should be modal or page
- [ ] Create Zod validation schema in `/types/validation/`
- [ ] Export create and update schemas
- [ ] Export TypeScript types
- [ ] Create form component in `/components/forms/`
- [ ] Use shadcn/ui Form components
- [ ] Implement react-hook-form with zodResolver
- [ ] Add loading states
- [ ] Add toast notifications
- [ ] Handle success/error states
- [ ] Test accessibility
- [ ] Verify type safety

---

**Last Updated**: January 5, 2026
**Version**: 1.0.0
