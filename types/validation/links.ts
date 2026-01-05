import { z } from "zod";

// Base schema matching the database table
export const linkSchema = z.object({
  id: z.number().optional(),
  userId: z.string().min(1, "User ID is required"),
  originalUrl: z.string().min(1, "URL is required").url("Must be a valid URL"),
  shortCode: z
    .string()
    .min(3, "Short code must be at least 3 characters")
    .max(50, "Short code must be less than 50 characters")
    .regex(
      /^[a-zA-Z0-9-_]+$/,
      "Short code can only contain letters, numbers, hyphens, and underscores"
    ),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// Create schema (omit auto-generated fields)
export const createLinkSchema = linkSchema.omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

// Update schema (all fields optional except id)
export const updateLinkSchema = linkSchema
  .omit({
    userId: true,
    createdAt: true,
    updatedAt: true,
  })
  .partial()
  .required({ id: true });

// Type exports
export type Link = z.infer<typeof linkSchema>;
export type CreateLinkInput = z.infer<typeof createLinkSchema>;
export type UpdateLinkInput = z.infer<typeof updateLinkSchema>;
