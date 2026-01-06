"use client";

import Page from "@/containers/Page";
import { DataBox } from "@/components/table/data-box";
import type { Link } from "@/lib/db/schema";
import { SimpleLinkCard } from "@/components/cards/LinkCard.Simple";
import { useGetLinks } from "@/lib/react-query/queries/links.query";
import { useAppQueryParams } from "@/hooks/useAppQuery";
import { QueryErrorBoundary } from "@/components/shared/QueryErrorBoundary";

export default function DashboardPage() {
  const { queries, setQueries, setLimit } = useAppQueryParams();

  const queryResult = useGetLinks({
    queries,
  });

  const handlePageChange = (page: number) => {
    setQueries({ page });
  };

  const handleLimitChange = (limit: number) => {
    setLimit(limit);
  };

  return (
    <Page search={true} parameters={[]} statusCards={false} extraFilter={false}>
      <QueryErrorBoundary>
        <DataBox<Link>
          queryFn={() => queryResult}
          Component={SimpleLinkCard}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
          currentPage={queries.page}
          limit={queries.limit}
        />
      </QueryErrorBoundary>
    </Page>
  );
}
