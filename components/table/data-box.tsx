"use client";

import React from "react";
import { DataTypes } from "@/types/global";
import NoData from "../shared/NoData";
import { PaginationControls } from "../shared/PaginationControls";
import type { UseQueryResult } from "@tanstack/react-query";
import type { PaginationResult } from "@/lib/react-query/actions/links.action";

interface DataBoxProps<T> {
  Component: React.ComponentType<T>;
  queryFn: () => UseQueryResult<PaginationResult<T>>;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  currentPage: number;
  limit: number;
}

export function DataBox<T extends DataTypes>({
  queryFn,
  Component,
  onPageChange,
  onLimitChange,
  currentPage,
  limit,
}: DataBoxProps<T>) {
  const { data, isLoading } = queryFn();

  const items = data?.data || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / limit);

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-48 bg-muted rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return <NoData />;
  }

  return (
    <div className="w-full space-y-4">
      {total > 0 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          limit={limit}
          total={total}
          onPageChange={onPageChange}
          onLimitChange={onLimitChange}
        />
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((val: T, i: number) => (
          <Component key={i} {...val} />
        ))}
      </div>

      {total > 0 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          limit={limit}
          total={total}
          onPageChange={onPageChange}
          onLimitChange={onLimitChange}
        />
      )}
    </div>
  );
}
