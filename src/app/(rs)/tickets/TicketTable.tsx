"use client";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { CircleCheckIcon, CircleXIcon } from "lucide-react";

import { useRouter } from "next/navigation";
import { TicketSearchResultsType } from "@/lib/queries/getTicketSearchResults";

type Props = {
  data: TicketSearchResultsType;
};

type RowType = TicketSearchResultsType[0];

export default function TicketTable({ data }: Props) {
  const router = useRouter();

  const columnHeadersArray: Array<keyof RowType> = [
    "ticketDate",
    "title",
    "tech",
    "firstName",
    "lastName",
    "email",
    "completed",
  ];

  const columnHelper = createColumnHelper<RowType>();

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
        header: columnName[0].toUpperCase() + columnName.slice(1), // capitalize first letter
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
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className='mt-6 rounded-lg overflow-hidden border'>
      <Table className='border'>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className='bg-secondary'>
                  <div>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </div>
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
  );
}
