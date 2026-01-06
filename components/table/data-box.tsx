import React, { useMemo } from "react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { DataTablePagination } from "./data-table-pagination";
import { DataTypes, PaginationProps, QueryParam } from "@/types/global";
import useCheckDeletedPage from "@/hooks/useCheckDeletedPage";
import { useGetData } from "@/lib/react-query/query/query";
import Loading from "../ui/loading";
import LoadingTime from "../ui/loading-time";
import { ENUMs } from "@/lib/enums";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useGetOrderItems } from "@/lib/react-query/query/order.query";
import { useSelectedRowsStore } from "@/lib/store/rows.store";
import { useAppQueryParams } from "@/hooks/useAppQuery";
import { Statistics } from "@/types/statistics";
import { OrderItem } from "@/types/types";
import NoData from "../shared/NoData";

interface DataBoxProps {
  columns: any[];
  onClick?: (id: number) => void;
  categories_filter?: boolean;
}

export function DataBox<T extends DataTypes, F extends Statistics>({
  columns,
  queryFn,
  name,
  onClick,
}: DataBoxProps & PaginationProps) {
  const { setSelectedRows } = useSelectedRowsStore();
  const { deleted } = useCheckDeletedPage();
  const { queries, setQueries } = useAppQueryParams();
  const pageIndex = Number(queries.page) || 0;
  const pageSize = Number(queries.limit) || 10;
  const queryKey = useMemo(
    () => [name, { ...queries, deleted }] as [string, QueryParam],
    [name, queries, deleted]
  );

  const { data, isLoading, refetch } = queryFn
    ? queryFn()
    : name && useGetData<T, F>(queryKey);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const handlePageChange = (newPageIndex: number) => {
    setQueries({
      [ENUMs.PARAMS.PAGE]: newPageIndex,
    });
    refetch();
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setQueries({
      [ENUMs.PARAMS.LIMIT]: newPageSize,
      [ENUMs.PARAMS.PAGE]: 0,
    });
    refetch();
  };

  const table = useReactTable<T>({
    data: data?.data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    manualPagination: true,
    rowCount: data?.total || 0,
    state: { sorting, columnVisibility, rowSelection },
    initialState: { pagination: { pageIndex, pageSize } },
  });

  React.useEffect(() => {
    if (!data?.data?.length) return;
    const selectedRows = table.getSelectedRowModel().rows || [];
    const ids = selectedRows.map((r) => r.original.id);
    setSelectedRows(ids);
  }, [rowSelection, table, data, setSelectedRows]);

  const { data: sellItems } = useGetOrderItems(Number(queries.orderId));
  if (isLoading) {
    return (
      <Loading>
        <LoadingTime />
      </Loading>
    );
  }
  return (
    <div className="w-full space-y-4">
      <div className="w-full space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => {
              return (
                <Card
                  onClick={() => onClick?.(row.original.id)}
                  key={row.id}
                  className={cn(
                    `p-0 hover:shadow-lg transition-shadow cursor-pointer ${
                      sellItems?.data.find(
                        (val: OrderItem) => val.variant.id == row.original.id
                      ) && "bg-primary text-white"
                    }`
                  )}>
                  <CardContent className="p-2 space-y-1">
                    {row.getVisibleCells().map((cell) => {
                      if (
                        cell.column.id === "select" ||
                        cell.column.id === "actions"
                      ) {
                        return null;
                      }

                      return (
                        <div key={cell.id} className="space-y-1">
                          <div className="text-base">
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <NoData />
          )}
        </div>
        <DataTablePagination
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          table={table}
        />
      </div>
    </div>
  );
}
