"use client";

import type { archestraApiTypes } from "@shared";
import type { ColumnDef, SortingState } from "@tanstack/react-table";
import { ChevronDown, ChevronUp } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { SearchInput } from "@/components/search-input";
import { TableFilters } from "@/components/table-filters";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { DateTimeRangePicker } from "@/components/ui/date-time-range-picker";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { DEFAULT_TABLE_LIMIT } from "@/consts";
import { type AuditLogEntry, useAuditLogs } from "@/lib/audit-log.query";
import { useDateTimeRangePicker } from "@/lib/hooks/use-date-time-range-picker";
import { formatDate } from "@/lib/utils";

type SortBy = NonNullable<
  archestraApiTypes.GetAuditLogsData["query"]
>["sortBy"];

function SortIcon({ isSorted }: { isSorted: "asc" | "desc" | false }) {
  if (isSorted === "asc") return <ChevronUp className="h-3 w-3" />;
  if (isSorted === "desc") return <ChevronDown className="h-3 w-3" />;
  return (
    <div className="text-muted-foreground/50 flex flex-col items-center">
      <ChevronUp className="h-3 w-3" />
      <ChevronDown className="h-3 w-3 mt-[-4px]" />
    </div>
  );
}

function StatusBadge({ code }: { code: string }) {
  const status = Number(code);
  const variant =
    status >= 400 ? "destructive" : status >= 300 ? "secondary" : "default";
  return <Badge variant={variant}>{code}</Badge>;
}

function MethodBadge({ method }: { method: string }) {
  const colors: Record<string, string> = {
    POST: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    PUT: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    PATCH:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    DELETE: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  };
  return (
    <span
      className={`rounded px-1.5 py-0.5 text-xs font-medium ${colors[method] ?? "bg-muted text-muted-foreground"}`}
    >
      {method}
    </span>
  );
}

function DetailRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-2">
      <span className="text-muted-foreground w-20 shrink-0 text-xs uppercase tracking-wide">
        {label}
      </span>
      <span className="text-sm">{children}</span>
    </div>
  );
}

export default function AuditLogPage({
  initialData,
}: {
  initialData?: archestraApiTypes.GetAuditLogsResponses["200"];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const startDateFromUrl = searchParams.get("startDate");
  const endDateFromUrl = searchParams.get("endDate");
  const actorSearchFromUrl = searchParams.get("actorSearch") ?? "";
  const resourceTypeFromUrl = searchParams.get("resourceType") ?? "";

  const [actorSearch, setActorSearch] = useState(actorSearchFromUrl);
  const [resourceTypeFilter, setResourceTypeFilter] =
    useState(resourceTypeFromUrl);
  const [selectedEntry, setSelectedEntry] = useState<AuditLogEntry | null>(
    null,
  );
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: DEFAULT_TABLE_LIMIT,
  });
  const [sorting, setSorting] = useState<SortingState>([
    { id: "createdAt", desc: true },
  ]);

  const updateUrlParams = useCallback(
    (params: Record<string, string | null>) => {
      const next = new URLSearchParams(searchParams.toString());
      for (const [k, v] of Object.entries(params)) {
        if (v) {
          next.set(k, v);
        } else {
          next.delete(k);
        }
      }
      router.push(`${pathname}?${next.toString()}`);
    },
    [searchParams, pathname, router],
  );

  const dateTimePicker = useDateTimeRangePicker({
    startDateFromUrl,
    endDateFromUrl,
    onDateRangeChange: useCallback(
      ({ startDate, endDate }) => {
        setPagination((p) => ({ ...p, pageIndex: 0 }));
        updateUrlParams({ startDate, endDate });
      },
      [updateUrlParams],
    ),
  });

  const sortBy = (sorting[0]?.id as SortBy) ?? "createdAt";
  const sortDirection = sorting[0]?.desc === false ? "asc" : "desc";

  const { data, isLoading } = useAuditLogs({
    startDate: dateTimePicker.startDateParam,
    endDate: dateTimePicker.endDateParam,
    resourceType: resourceTypeFilter || undefined,
    actorSearch: actorSearch || undefined,
    limit: pagination.pageSize,
    offset: pagination.pageIndex * pagination.pageSize,
    sortBy,
    sortDirection,
  });

  const rows = data?.data ?? initialData?.data ?? [];
  const paginationMeta = data?.pagination ?? initialData?.pagination;

  const columns: ColumnDef<AuditLogEntry>[] = [
    {
      id: "createdAt",
      header: ({ column }) => (
        <button
          type="button"
          className="flex items-center gap-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Time
          <SortIcon isSorted={column.getIsSorted()} />
        </button>
      ),
      cell: ({ row }) =>
        formatDate({ date: row.original.createdAt }),
    },
    {
      id: "actor",
      header: "Actor",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{row.original.actorName}</span>
          <span className="text-muted-foreground text-xs">
            {row.original.actorEmail}
          </span>
        </div>
      ),
    },
    {
      id: "action",
      header: "Action",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <MethodBadge method={row.original.httpMethod} />
          <span className="text-muted-foreground max-w-[240px] truncate font-mono text-xs">
            {row.original.routePath}
          </span>
        </div>
      ),
    },
    {
      id: "resourceType",
      header: ({ column }) => (
        <button
          type="button"
          className="flex items-center gap-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Resource
          <SortIcon isSorted={column.getIsSorted()} />
        </button>
      ),
      cell: ({ row }) =>
        row.original.resourceType ? (
          <span className="text-sm">
            {row.original.resourceType}
            {row.original.resourceId && (
              <span className="text-muted-foreground ml-1 font-mono text-xs">
                ({row.original.resourceId.slice(0, 8)}…)
              </span>
            )}
          </span>
        ) : (
          <span className="text-muted-foreground text-sm">—</span>
        ),
    },
    {
      id: "statusCode",
      header: ({ column }) => (
        <button
          type="button"
          className="flex items-center gap-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <SortIcon isSorted={column.getIsSorted()} />
        </button>
      ),
      cell: ({ row }) => <StatusBadge code={row.original.statusCode} />,
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <TableFilters>
        <DateTimeRangePicker {...dateTimePicker} />
        <SearchInput
          placeholder="Search actor…"
          value={actorSearch}
          onChange={(v) => {
            setActorSearch(v);
            setPagination((p) => ({ ...p, pageIndex: 0 }));
            updateUrlParams({ actorSearch: v || null });
          }}
        />
        <SearchInput
          placeholder="Resource type…"
          value={resourceTypeFilter}
          onChange={(v) => {
            setResourceTypeFilter(v);
            setPagination((p) => ({ ...p, pageIndex: 0 }));
            updateUrlParams({ resourceType: v || null });
          }}
        />
      </TableFilters>

      <DataTable
        columns={columns}
        data={rows}
        isLoading={isLoading}
        manualPagination
        pagination={
          paginationMeta
            ? {
                pageIndex: pagination.pageIndex,
                pageSize: pagination.pageSize,
                total: paginationMeta.total,
              }
            : undefined
        }
        onPaginationChange={(newPagination) => {
          setPagination(newPagination);
        }}
        manualSorting
        sorting={sorting}
        onSortingChange={setSorting}
        onRowClick={(row) => setSelectedEntry(row)}
      />

      <Sheet
        open={!!selectedEntry}
        onOpenChange={(open) => !open && setSelectedEntry(null)}
      >
        <SheetContent className="w-[480px] overflow-y-auto">
          {selectedEntry && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <MethodBadge method={selectedEntry.httpMethod} />
                  <StatusBadge code={selectedEntry.statusCode} />
                </SheetTitle>
              </SheetHeader>
              <div className="mt-4 flex flex-col gap-3">
                <DetailRow label="Time">
                  {formatDate({
                    date: selectedEntry.createdAt,
                    dateFormat: "MM/dd/yyyy HH:mm:ss",
                  })}
                </DetailRow>
                <DetailRow label="Actor">
                  {selectedEntry.actorName} ({selectedEntry.actorEmail})
                </DetailRow>
                <DetailRow label="Route">{selectedEntry.routePath}</DetailRow>
                {selectedEntry.resourceType && (
                  <DetailRow label="Resource">
                    {selectedEntry.resourceType}
                    {selectedEntry.resourceId &&
                      ` · ${selectedEntry.resourceId}`}
                  </DetailRow>
                )}
                {selectedEntry.ipAddress && (
                  <DetailRow label="IP">{selectedEntry.ipAddress}</DetailRow>
                )}
                {Object.keys(selectedEntry.context).length > 0 && (
                  <div>
                    <span className="text-muted-foreground text-xs uppercase tracking-wide">
                      Context
                    </span>
                    <pre className="bg-muted mt-1 overflow-x-auto whitespace-pre-wrap break-all rounded p-3 text-xs">
                      {JSON.stringify(selectedEntry.context, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
