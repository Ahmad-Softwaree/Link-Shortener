import { z } from "zod";
import { TFunction } from "i18next";

export const getLinkValidation = (t: TFunction) =>
  z.object({
    id: z.number().optional(),
    originalUrl: z
      .string()
      .min(1, t("validation.url_required"))
      .url(t("validation.url_invalid")),
    shortCode: z
      .string()
      .min(3, t("validation.shortcode_min"))
      .max(50, t("validation.shortcode_max"))
      .regex(/^[a-zA-Z0-9-_]+$/, t("validation.shortcode_format")),
  });

export type LinkInput = z.infer<ReturnType<typeof getLinkValidation>>;
