"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { convertCurrency, formatDate } from "@/lib/utils";
import { TOrderPaymentStatus, TOrderTableItem } from "@/typings";
import { Badge } from "@/components/ui/badge";
import AdminOrdersActionButton from "./AdminOrdersActionButton";

type AdminOrdersTableProps = {
  orders: TOrderTableItem[];
};
export function AdminOrdersTable({ orders }: AdminOrdersTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const columns: ColumnDef<TOrderTableItem>[] = [
    {
      accessorKey: "orderNumber",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Order
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => {
        const orderNumber: string = row.getValue("orderNumber");
        return <div className="px-3 capitalize">#{orderNumber}</div>;
      },
    },
    {
      accessorKey: "customerName",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Customer
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="px-3 capitalize">{row.getValue("customerName")}</div>
      ),
    },

    {
      accessorKey: "status",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Order Status
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => {
        const status = row.getValue("status") as TOrderTableItem["status"];

        const statusConfig: Record<
          TOrderTableItem["status"],
          { label: string; className: string }
        > = {
          PENDING: {
            label: "Pending",
            className: "bg-gray-500 text-white",
          },
          CONFIRMED: {
            label: "Confirmed",
            className: "bg-blue-500 text-white",
          },
          PREPARING: {
            label: "Preparing",
            className: "bg-yellow-500 text-white",
          },
          READY_FOR_PICKUP: {
            label: "Ready for Pickup",
            className: "bg-indigo-500 text-white",
          },
          OUT_FOR_DELIVERY: {
            label: "Out for Delivery",
            className: "bg-purple-500 text-white",
          },
          COMPLETED: {
            label: "Completed",
            className: "bg-green-600 text-white",
          },
          CANCELLED: {
            label: "Cancelled",
            className: "bg-red-600 text-white",
          },
        };

        const { label, className } = statusConfig[status];

        return (
          <div className="px-3">
            <Badge className={className}>{label}</Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "totalAmount",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Total
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="px-3 capitalize">
          {convertCurrency(row.getValue("totalAmount"))}
        </div>
      ),
    },
    {
      accessorKey: "paymentStatus",
      header: "Payment Status",
      cell: ({ row }) => {
        const paymentStatus = row.getValue(
          "paymentStatus"
        ) as TOrderPaymentStatus;
        switch (paymentStatus) {
          case "PAID":
            return <Badge className="bg-green-600 text-white">Paid</Badge>;
          case "UNPAID":
            return <Badge className="bg-red-600 text-white">Unpaid</Badge>;
          case "REFUNDED":
            return <Badge className="bg-orange-600 text-white">Refunded</Badge>;
        }
      },
    },
    {
      accessorKey: "referenceNumber",
      header: "Reference No.",
      cell: ({ row }) => <div>{row.getValue("referenceNumber")}</div>,
    },
    {
      accessorKey: "storeName",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Branch
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="px-3 capitalize">{row.getValue("storeName")}</div>
      ),
    },
    {
      accessorKey: "orderType",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Order Type
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="px-3 capitalize">{row.getValue("orderType")}</div>
      ),
    },
    {
      accessorKey: "isFulfilled",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Fulfillment
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => {
        const isFulfulled = row.getValue("isFulfilled");
        return (
          <div className="px-3">
            {isFulfulled ? (
              <Badge className="text-green-600 bg-transparent border border-green-600">
                <div className="bg-green-600 w-2 rounded-full aspect-square" />{" "}
                Fulfilled
              </Badge>
            ) : (
              <Badge className="text-red-600 bg-transparent border border-red-600">
                <div className="bg-red-600 w-2 rounded-full aspect-square" />{" "}
                Unfulfilled
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Created At
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="px-3">
          {formatDate(new Date(row.getValue("createdAt")), true)}
        </div>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const orderData = row.original;
        return <AdminOrdersActionButton orderData={orderData} />;
      },
    },
  ];
  const table = useReactTable({
    data: orders || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });
  return (
    <div className="w-full space-y-4 text-nowrap overflow-x-auto">
      <div className="gap-4 grid sm:grid-cols-3 2xl:flex items-center w-full">
        <Input
          placeholder="Filter by customer..."
          value={
            (table.getColumn("customerName")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("customerName")?.setFilterValue(event.target.value)
          }
          className="w-full sm:max-w-sm"
        />

        <div className="items-center gap-4 flex ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="rounded-md border text-nowrap">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
