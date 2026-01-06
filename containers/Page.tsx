"use client";

import AddButton from "@/components/shared/AddButton";
import Search from "@/components/shared/Search";
import { Button } from "@/components/ui/button";
import { useAppQueryParams } from "@/hooks/useAppQuery";
import { useFilterStore } from "@/lib/store/filter.store";
import { useModalStore } from "@/lib/store/modal.store";
import { SlidersHorizontal } from "lucide-react";
import { useTranslation } from "react-i18next";
import ActionTooltip from "@/components/shared/ActionTooltip";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface PageProps {
  children?: React.ReactNode;
  parameters?: string[];
  search?: boolean;
  statusCards?: boolean;
  onAddClick?: () => void;
  extraFilter?: boolean;
}

const Page = ({
  children,
  parameters,
  search = true,
  statusCards = false,
  extraFilter = false,
  onAddClick,
}: PageProps) => {
  const { userId } = useAuth();
  const router = useRouter();
  const { openModal } = useModalStore();
  const { t } = useTranslation();
  const { queries, setQueries } = useAppQueryParams();
  const { showFilters, toggleFilters } = useFilterStore();

  useEffect(() => {
    if (!userId) {
      router.push("/");
    }
  }, [userId, router]);

  const handleAddLink = () => {
    openModal({
      type: "add",
      modalData: {},
    });
  };

  const shouldShowFilterButton = parameters && parameters.length > 0;

  return (
    <div className="px-4 py-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-row flex-wrap justify-between w-full gap-5">
          <div className="flex flex-row flex-wrap items-center justify-start gap-3">
            {search && (
              <div className="min-w-[300px]">
                <Search />
              </div>
            )}

            {shouldShowFilterButton && (
              <ActionTooltip label={t("filter.status")}>
                <Button
                  onClick={() => openModal({ type: "filter" })}
                  variant="outline"
                  size="icon"
                  className="hover:bg-primary/10 hover:text-primary hover:border-primary transition-all">
                  <SlidersHorizontal className="w-4 h-4" />
                </Button>
              </ActionTooltip>
            )}
          </div>

          <AddButton onClick={handleAddLink} />
        </div>

        <div className="mt-4">
          <h1 className="text-3xl font-bold mb-2">{t("dashboard.title")}</h1>
          <p className="text-muted-foreground mb-6">
            {t("dashboard.description")}
          </p>

          {children}
        </div>
      </div>
    </div>
  );
};

export default Page;
