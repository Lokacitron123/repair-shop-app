"use client";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnFiltersState,
  getPaginationRowModel,
  getFilteredRowModel,
  getFacetedUniqueValues,
  SortingState,
  getSortedRowModel,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  CircleCheckIcon,
  CircleXIcon,
  X,
  ArrowDown,
  ArrowUpDown,
  ArrowUp,
} from "lucide-react";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { usePolling } from "@/hooks/usePolling";
import { TicketSearchResultsType } from "@/lib/queries/getTicketSearchResults";
import { Button } from "@/components/ui/button";
import Filter from "@/components/react-table/Filter";

type Props = {
  data: TicketSearchResultsType;
};

type RowType = TicketSearchResultsType[0];

export default function TicketTable({ data }: Props) {
  const router = useRouter();

  const searchParams = useSearchParams();

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "ticketDate",
      desc: false, // falls for ascending
    },
  ]);

  // Refreshes datatable - live updates
  usePolling(searchParams.get("searchText"), 500000);

  const columnHeadersArray: Array<keyof RowType> = [
    "ticketDate",
    "title",
    "tech",
    "firstName",
    "lastName",
    "email",
    "completed",
  ];

  const columnWidths = {
    completed: 150,
    ticketDate: 150,
    title: 250,
    tech: 150,
    email: 250,
  };

  const columnHelper = createColumnHelper<RowType>();

  const pageIndex = useMemo(() => {
    const page = searchParams.get("page");
    return page ? parseInt(page) - 1 : 0;
  }, [searchParams]);

  const columns = columnHeadersArray.map((columnName) => {
    return columnHelper.accessor(
      // Transformational function for data
      (row) => {
        const value = row[columnName];

        if (columnName === "ticketDate" && value instanceof Date) {
          return value.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          });
        }
        if (columnName === "completed") {
          // turn boolean to string data
          return value ? "COMPLETED" : "OPEN";
        }
        return value;
      },

      {
        id: columnName,
        size:
          columnWidths[columnName as keyof typeof columnWidths] ?? undefined,
        header: ({ column }) => {
          return (
            <Button
              variant='ghost'
              className='pl-1 w-full flex justify-between'
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              {columnName[0].toUpperCase() + columnName.slice(1)}

              {column.getIsSorted() === "asc" ? (
                <ArrowUp className='ml-2 h-4 w-4' />
              ) : column.getIsSorted() === "desc" ? (
                <ArrowDown className='ml-2 h-4 w-4' />
              ) : (
                <ArrowUpDown className='ml-2 h-4 w-4' />
              )}
            </Button>
          );
        },
        cell: ({ getValue }) => {
          // Presentational component
          const value = getValue();
          if (columnName === "completed") {
            return (
              <div className='grid place-content-center'>
                {value === "OPEN" ? (
                  <CircleXIcon className='opacity-25' />
                ) : (
                  <CircleCheckIcon className='text-green-600' />
                )}
              </div>
            );
          }
          return value;
        },
      }
    );
  });

  const table = useReactTable({
    data,
    columns,
    state: {
      columnFilters,
      sorting,
      pagination: {
        pageIndex,
        pageSize: 10,
      },
    },
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className='mt-6'>
      <div className='p-2 flex gap-1'>
        <Button
          variant={"outline"}
          onClick={() => table.resetSorting()}
          disabled={sorting[0]?.desc === undefined}
        >
          Clear Sorting
          <X className=' h-4 w-4' />
        </Button>
        <Button variant={"outline"} onClick={() => router.refresh()}>
          Refresh Table
          <X className=' h-4 w-4' />
        </Button>
        <Button
          variant={"outline"}
          onClick={() => table.resetColumnFilters()}
          disabled={columnFilters.length === 0}
        >
          Clear Filters
          <X className=' h-4 w-4' />
        </Button>
      </div>
      <div className=' rounded-lg overflow-hidden border'>
        <Table className='border'>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className='bg-secondary p-1'
                    style={{ width: header.getSize() }}
                  >
                    <div>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </div>
                    {header.column.getCanFilter() ? (
                      <div className='grid place-content-center'>
                        <Filter
                          column={header.column}
                          filteredRows={table
                            .getFilteredRowModel()
                            .rows.map((row) => row.getValue(header.column.id))}
                        />
                      </div>
                    ) : null}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className='cursor-pointer hover:bg-border/25 dark:hover:bg-ring/40'
                onClick={() =>
                  router.push(`/tickets/form?ticketId=${row.original.id}`)
                }
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className='border'>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className='flex justify-between items-center p-2'>
        <div className='flex basis-1/3 items-center'>
          <p className='whitespace-nowrap font-bold'>
            {`Page ${
              table.getState().pagination.pageIndex + 1
            } of ${table.getPageCount()}`}{" "}
            {`[${table.getFilteredRowModel().rows.length} ${
              table.getFilteredRowModel().rows.length !== 1
                ? "total results"
                : "result"
            }]`}
          </p>
        </div>
        <div className='space-x-1'>
          <Button
            variant={"outline"}
            onClick={() => {
              const newIndex = table.getState().pagination.pageIndex - 1;
              table.setPageIndex(newIndex);
              const params = new URLSearchParams(searchParams.toString());
              params.set("page", (newIndex + 1).toString());
              router.replace(`?${params.toString()}`, { scroll: false });
            }}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>

          <Button
            variant={"outline"}
            onClick={() => {
              const newIndex = table.getState().pagination.pageIndex + 1;
              table.setPageIndex(newIndex);
              const params = new URLSearchParams(searchParams.toString());
              params.set("page", (newIndex + 1).toString());
              router.replace(`?${params.toString()}`, { scroll: false });
            }}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
