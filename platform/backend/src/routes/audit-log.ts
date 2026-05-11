import {
  createPaginatedResponseSchema,
  PaginationQuerySchema,
  RouteId,
} from "@shared";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { AuditLogModel } from "@/models";
import {
  constructResponseSchema,
  createSortingQuerySchema,
  SelectAuditLogSchema,
} from "@/types";

const auditLogRoutes: FastifyPluginAsyncZod = async (fastify) => {
  fastify.get(
    "/api/audit-logs",
    {
      schema: {
        operationId: RouteId.GetAuditLogs,
        description:
          "Get paginated audit log entries for the organization (admin only)",
        tags: ["Audit Log"],
        querystring: z
          .object({
            startDate: z
              .string()
              .datetime()
              .optional()
              .describe("Filter by start date (ISO 8601)"),
            endDate: z
              .string()
              .datetime()
              .optional()
              .describe("Filter by end date (ISO 8601)"),
            resourceType: z
              .string()
              .optional()
              .describe("Filter by resource type"),
            actorSearch: z
              .string()
              .optional()
              .describe("Search by actor name or email"),
          })
          .merge(PaginationQuerySchema)
          .merge(
            createSortingQuerySchema([
              "createdAt",
              "actorEmail",
              "resourceType",
              "statusCode",
            ] as const),
          ),
        response: constructResponseSchema(
          createPaginatedResponseSchema(SelectAuditLogSchema),
        ),
      },
    },
    async (
      {
        query: {
          startDate,
          endDate,
          resourceType,
          actorSearch,
          limit,
          offset,
          sortBy,
          sortDirection,
        },
        organizationId,
      },
      reply,
    ) => {
      return reply.send(
        await AuditLogModel.findAllPaginated(
          organizationId,
          { limit, offset },
          { sortBy, sortDirection },
          {
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
            resourceType,
            actorSearch,
          },
        ),
      );
    },
  );
};

export default auditLogRoutes;
