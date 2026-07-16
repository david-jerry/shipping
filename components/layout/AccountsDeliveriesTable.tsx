"use client"

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { type DeliveryRow } from "@/lib/deliveries"

const columnHelper = createColumnHelper<DeliveryRow>()

type AccountsDeliveriesTableProps = {
  deliveries: DeliveryRow[]
  onAdvanceStatus?: (
    deliveryId: string,
    currentStatus: DeliveryRow["status"]
  ) => void
  updatingDeliveryId?: string | null
}

export function AccountsDeliveriesTable({
  deliveries,
  onAdvanceStatus,
  updatingDeliveryId,
}: AccountsDeliveriesTableProps) {
  const baseColumns = [
    columnHelper.accessor("trackingNumber", {
      header: "Tracking",
      cell: (info) => (
        <span className="font-medium text-foreground">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: (info) => {
        const value = info.getValue()
        const tone =
          value === "Delivered"
            ? "bg-emerald-500/10 text-emerald-700"
            : value === "In Transit"
              ? "bg-amber-500/10 text-amber-700"
              : "bg-sky-500/10 text-sky-700"
        return (
          <span
            className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${tone}`}
          >
            {value}
          </span>
        )
      },
    }),
    columnHelper.accessor("pickup", {
      header: "Pickup",
    }),
    columnHelper.accessor("dropoff", {
      header: "Dropoff",
    }),
    columnHelper.accessor("lastKnownLocation", {
      header: "Last Known Location",
      cell: (info) => info.getValue() ?? "No location updates",
    }),
    columnHelper.accessor("locationCount", {
      header: "Checkpoints",
    }),
    columnHelper.accessor("receivedAt", {
      header: "Received",
      cell: (info) => {
        const value = info.getValue()
        return value ? new Date(value).toLocaleDateString() : "-"
      },
    }),
  ]

  const columns = onAdvanceStatus
    ? [
        ...baseColumns,
        columnHelper.display({
          id: "actions",
          header: "Action",
          cell: ({ row }) => {
            const status = row.original.status
            const canAdvance =
              status === "Pending" ||
              status === "Assigned" ||
              status === "In Transit"

            if (!canAdvance) {
              return <span className="text-xs text-muted-foreground">-</span>
            }

            const isPending = updatingDeliveryId === row.original.id

            return (
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={isPending}
                onClick={() => onAdvanceStatus(row.original.id, status)}
              >
                {isPending ? "Updating..." : "Advance"}
              </Button>
            )
          },
        }),
      ]
    : baseColumns

  const table = useReactTable({
    data: deliveries,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <table className="w-full text-left text-sm">
        <thead className="bg-muted/60 text-xs tracking-wide text-muted-foreground uppercase">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="px-4 py-3">
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-t border-border">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3 text-muted-foreground">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr className="border-t border-border">
              <td
                className="px-4 py-6 text-center text-muted-foreground"
                colSpan={columns.length}
              >
                No deliveries found yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
