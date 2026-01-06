import dayjs from "dayjs";

export function useCurrency() {
  const formatDate = (value?: string, format?: string) =>
    dayjs(value || "").format(format || "DD/MM/YYYY");

  return { formatDate };
}

export const formatDateFn = (value?: string, format?: string) => {
  return dayjs(value || "").format(format || "DD/MM/YYYY");
};
