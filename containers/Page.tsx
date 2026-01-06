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
import { LinkCard } from "@/components/cards/LinkCard";
import NoData from "@/components/shared/NoData";
import { useGetData } from "@/lib/react-query/queries/query";
import { links } from "@/lib/db/schema";
import { QUERY_KEYS } from "@/lib/react-query/keys";
import type { Link } from "@/lib/db/schema";

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
  const { openModal } = useModalStore();
  const { t } = useTranslation();
  const { queries, setQueries } = useAppQueryParams();
  const { showFilters, toggleFilters } = useFilterStore();

  const { data, isLoading, refetch } = useGetData<Link>({
    table: links,
    queryKey: [QUERY_KEYS.LINKS.ALL],
    queries,
  });

  const handleAddLink = () => {
    openModal({
      type: "add",
      modalData: {},
    });
  };

  const shouldShowFilterButton = parameters && parameters.length > 0;

  return (
    <div className="container mx-auto px-4 py-8">
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

          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-48 bg-muted rounded-lg animate-pulse"
                />
              ))}
            </div>
          ) : data && data.data.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {data.data.map((link: Link) => (
                <LinkCard key={link.id} link={link} />
              ))}
            </div>
          ) : (
            <NoData>
              <div className="text-center py-12">
                <p className="text-xl font-semibold mb-2">
                  {queries.search
                    ? t("dashboard.no_results")
                    : t("dashboard.no_links")}
                </p>
                <p className="text-muted-foreground">
                  {queries.search
                    ? t("dashboard.no_results_description")
                    : t("dashboard.no_links_description")}
                </p>
              </div>
            </NoData>
          )}

          {children}
        </div>
      </div>
    </div>
  );
};

export default Page;
