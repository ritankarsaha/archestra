import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import logger from "@/logging";
import { AuditLogModel } from "@/models";
import { lookupResource, sanitizeBody } from "./resource-map";

const SKIP_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

export const auditLogPlugin = fp(async (app: FastifyInstance) => {
  app.addHook("onResponse", async (request, reply) => {
    // Only capture mutations on authenticated /api/* routes
    if (
      SKIP_METHODS.has(request.method) ||
      !request.url.startsWith("/api/") ||
      !request.user ||
      !request.organizationId
    ) {
      return;
    }

    // Skip server-side errors
    if (reply.statusCode >= 500) {
      return;
    }

    const routeUrl = request.routeOptions?.url ?? request.url;
    const resource = lookupResource(request.method, routeUrl);

    const params = (request.params ?? {}) as Record<string, string>;
    const resourceId =
      resource?.idParam ? (params[resource.idParam] ?? null) : null;

    const context = sanitizeBody(request.body);

    // Fire-and-forget
    AuditLogModel.create({
      organizationId: request.organizationId,
      actorId: request.user.id,
      actorEmail: request.user.email,
      actorName: request.user.name,
      httpMethod: request.method,
      routePath: routeUrl,
      resourceType: resource?.resourceType ?? null,
      resourceId,
      statusCode: String(reply.statusCode),
      ipAddress: request.ip ?? null,
      context,
    }).catch((error) => {
      logger.error(
        { error: error instanceof Error ? error.message : String(error) },
        "Failed to write audit log entry",
      );
    });
  });
});
