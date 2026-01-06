"use client";

import { NoDataProps } from "@/types/global";
import { FileQuestion } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

export default function NoData({ children, className, ...props }: NoDataProps) {
  const { t } = useTranslation();

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12",
        className
      )}
      {...props}>
      {children ? (
        children
      ) : (
        <>
          <FileQuestion className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">
            {t("dashboard.no_data")}
          </h3>
          <p className="text-muted-foreground text-center max-w-md">
            {t("dashboard.no_data_found")}
          </p>
        </>
      )}
    </div>
  );
}
