"use client";

import Page from "@/containers/Page";
import { DataBox } from "@/components/table/data-box";
import type { Link } from "@/lib/db/schema";
import { useGetLinks } from "@/lib/react-query/queries/link.query";
import { LinkCard } from "@/components/cards/LinkCard";
import { QUERY_KEYS } from "@/lib/react-query/keys";

export default function DashboardPage() {
  return (
    <Page search={true} statusCards={false} extraFilter={false}>
      <DataBox<Link>
        queryFn={useGetLinks}
        name={QUERY_KEYS.LINKS}
        Component={LinkCard}
      />
    </Page>
  );
}
