import type { PaginationQuery } from "@shared";
import { and, asc, count, desc, eq, gte, ilike, lte, or, type SQL } from "drizzle-orm";
import db, { schema } from "@/database";
import {
  createPaginatedResult,
  type PaginatedResult,
} from "@/database/utils/pagination";
import type { AuditLog, InsertAuditLog, SortingQuery } from "@/types";

class AuditLogModel {
  static async create(data: InsertAuditLog): Promise<AuditLog> {
    const [row] = await db
      .insert(schema.auditLogsTable)
      .values(data)
      .returning();
    return row;
  }

  static async findAllPaginated(
    organizationId: string,
    pagination: PaginationQuery,
    sorting?: SortingQuery,
    filters?: {
      startDate?: Date;
      endDate?: Date;
      resourceType?: string;
      actorSearch?: string;
    },
  ): Promise<PaginatedResult<AuditLog>> {
    const orderByClause = AuditLogModel.getOrderByClause(sorting);

    const conditions: SQL[] = [
      eq(schema.auditLogsTable.organizationId, organizationId),
    ];

    if (filters?.startDate) {
      conditions.push(gte(schema.auditLogsTable.createdAt, filters.startDate));
    }
    if (filters?.endDate) {
      conditions.push(lte(schema.auditLogsTable.createdAt, filters.endDate));
    }
    if (filters?.resourceType) {
      conditions.push(
        eq(schema.auditLogsTable.resourceType, filters.resourceType),
      );
    }
    if (filters?.actorSearch) {
      const pattern = `%${filters.actorSearch.replace(/[%_\\]/g, "\\$&")}%`;
      const actorCondition = or(
        ilike(schema.auditLogsTable.actorEmail, pattern),
        ilike(schema.auditLogsTable.actorName, pattern),
      );
      if (actorCondition) {
        conditions.push(actorCondition);
      }
    }

    const whereClause = and(...conditions);

    const [data, [{ total }]] = await Promise.all([
      db
        .select()
        .from(schema.auditLogsTable)
        .where(whereClause)
        .orderBy(orderByClause)
        .limit(pagination.limit)
        .offset(pagination.offset),
      db
        .select({ total: count() })
        .from(schema.auditLogsTable)
        .where(whereClause),
    ]);

    return createPaginatedResult(data as AuditLog[], Number(total), pagination);
  }

  static async deleteOldRecords(olderThan: Date): Promise<number> {
    const result = await db
      .delete(schema.auditLogsTable)
      .where(lte(schema.auditLogsTable.createdAt, olderThan));
    return result.rowCount ?? 0;
  }

  private static getOrderByClause(sorting?: SortingQuery) {
    const direction = sorting?.sortDirection === "asc" ? asc : desc;
    switch (sorting?.sortBy) {
      case "actorEmail":
        return direction(schema.auditLogsTable.actorEmail);
      case "resourceType":
        return direction(schema.auditLogsTable.resourceType);
      case "statusCode":
        return direction(schema.auditLogsTable.statusCode);
      default:
        return desc(schema.auditLogsTable.createdAt);
    }
  }
}

export default AuditLogModel;
