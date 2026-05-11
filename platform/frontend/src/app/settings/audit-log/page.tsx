import type { archestraApiTypes, ErrorExtended } from "@shared";
import { archestraApiSdk } from "@shared";
import { ServerErrorFallback } from "@/components/error-fallback";
import { DEFAULT_TABLE_LIMIT } from "@/consts";
import { handleApiError } from "@/lib/utils";
import { getServerApiHeaders } from "@/lib/utils/server";
import AuditLogPage from "./page.client";

export const dynamic = "force-dynamic";

export default async function AuditLogPageServer() {
  let initialData: archestraApiTypes.GetAuditLogsResponses["200"] = {
    data: [],
    pagination: {
      currentPage: 1,
      limit: DEFAULT_TABLE_LIMIT,
      total: 0,
      totalPages: 0,
      hasNext: false,
      hasPrev: false,
    },
  };

  try {
    const headers = await getServerApiHeaders();
    const response = await archestraApiSdk.getAuditLogs({
      headers,
      query: {
        limit: DEFAULT_TABLE_LIMIT,
        offset: 0,
        sortBy: "createdAt",
        sortDirection: "desc",
      },
    });
    if (response.error) {
      handleApiError(response.error);
    } else if (response.data) {
      initialData = response.data;
    }
  } catch (error) {
    return <ServerErrorFallback error={error as ErrorExtended} />;
  }

  return <AuditLogPage initialData={initialData} />;
}
