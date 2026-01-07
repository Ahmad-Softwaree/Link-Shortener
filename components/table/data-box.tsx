"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { DataTypes, PaginationProps } from "@/types/global";
import { PaginationControls } from "../shared/PaginationControls";
import { useTranslation } from "react-i18next";
import { useAppQueryParams } from "@/hooks/useAppQuery";
import { QueryParam } from "@/types/types";
import Loading from "../shared/Loading";
import NoData from "../shared/NoData";

export function DataBox<T extends DataTypes>({
  queryFn,
  name,
  Component,
}: PaginationProps & {
  Component: React.ComponentType<T>;
}) {
  const { i18n } = useTranslation();
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const { queries } = useAppQueryParams();
  const queryKey = useMemo(
    () => [name, { ...queries }] as [string, QueryParam],
    [name, queries]
  );

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = queryFn(queryKey);
  useEffect(() => {
    refetch();
  }, [i18n.language]);

  // Infinite scroll observer
  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 1 }
    );

    const node = loadMoreRef.current;
    if (node) observer.observe(node);

    return () => {
      if (node) observer.unobserve(node);
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return <Loading.Cards />;
  }

  const allItems =
    data?.pages?.flatMap((page: { data: T[] }) => page.data) ?? [];
  if (allItems.length === 0) {
    return <NoData />;
  }

  return (
    <div className="w-full space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {allItems.map((val: T, i: number) => (
          <Component key={i} {...val} />
        ))}
      </div>

      {data.total > 0 && (
        <PaginationControls totalPages={data.totalPages} total={data.total} />
      )}
    </div>
  );
}
