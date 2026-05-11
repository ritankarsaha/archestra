"use client";

import { type archestraApiTypes, archestraApiSdk } from "@shared";
import { useQuery } from "@tanstack/react-query";
import { useHasPermissions } from "@/lib/auth/auth.query";
import { handleApiError } from "@/lib/utils";

export type AuditLogEntry =
  archestraApiTypes.GetAuditLogsResponses["200"]["data"][number];

export type AuditLogFilters = {
  startDate?: string;
  endDate?: string;
  resourceType?: string;
  actorSearch?: string;
  limit: number;
  offset: number;
  sortBy?: archestraApiTypes.GetAuditLogsData["query"]["sortBy"];
  sortDirection?: "asc" | "desc";
};

export function useAuditLogs(filters: AuditLogFilters) {
  const { data: canRead } = useHasPermissions({ auditLog: ["read"] });

  return useQuery({
    queryKey: ["audit-logs", filters],
    enabled: !!canRead,
    queryFn: async () => {
      const response = await archestraApiSdk.getAuditLogs({ query: filters });
      if (response.error) {
        handleApiError(response.error);
        return {
          data: [],
          pagination: {
            currentPage: 1,
            limit: filters.limit,
            total: 0,
            totalPages: 0,
            hasNext: false,
            hasPrev: false,
          },
        } as archestraApiTypes.GetAuditLogsResponses["200"];
      }
      return response.data!;
    },
  });
}
