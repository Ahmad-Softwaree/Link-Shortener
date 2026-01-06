import type { QueryParam } from "@/types/global";
import { QueryClient } from "@tanstack/react-query";

export const imageSrc = (image?: string) => {
  if (!image) {
    return "/images/placeholder.svg";
  }

  const isUnsplashUrl =
    image.startsWith("https://images.unsplash.com/") ||
    image.startsWith("https://unsplash.com/") ||
    image.startsWith("https://plus.unsplash.com/");

  if (isUnsplashUrl) {
    return image;
  } else {
    return image;
  }
};

export const invalidateQueries = async (
  queryClient: QueryClient,
  name: string
) => {
  return queryClient.invalidateQueries({
    predicate: (query) => {
      const queryKey: any = query.queryKey[0];
      const isMatch =
        typeof queryKey === "string"
          ? queryKey === name || queryKey.includes(name)
          : queryKey.some((key: string) => key.includes(name));

      return isMatch;
    },
  });
};

export const buildQueryString = (params: QueryParam): string => {
  return Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== "")
    .flatMap(([key, value]) => {
      if (Array.isArray(value)) {
        return value.map(
          (v) => `${encodeURIComponent(key)}=${encodeURIComponent(String(v))}`
        );
      }
      return [
        `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`,
      ];
    })
    .join("&");
};

export const formatDate = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    return false;
  }
};
