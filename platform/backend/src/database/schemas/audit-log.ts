import {
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import organizationsTable from "./organization";
import usersTable from "./user";

const auditLogsTable = pgTable(
  "audit_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizationsTable.id, { onDelete: "cascade" }),
    // Nullable to preserve log entries when actor is deleted
    actorId: text("actor_id").references(() => usersTable.id, {
      onDelete: "set null",
    }),
    // Denormalized so history survives user deletion
    actorEmail: varchar("actor_email", { length: 255 }).notNull(),
    actorName: varchar("actor_name", { length: 255 }).notNull(),
    httpMethod: varchar("http_method", { length: 10 }).notNull(),
    // Parameterized path e.g. /api/agents/:agentId
    routePath: text("route_path").notNull(),
    // Derived from resource map e.g. "agent", "profile"
    resourceType: varchar("resource_type", { length: 100 }),
    // Resolved :id param value
    resourceId: text("resource_id"),
    statusCode: varchar("status_code", { length: 3 }).notNull(),
    // Masked IP address
    ipAddress: varchar("ip_address", { length: 45 }),
    // Sanitized request body subset and optional response metadata
    context: jsonb("context").$type<Record<string, unknown>>().notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => ({
    orgCreatedAtIdx: index("audit_logs_org_created_at_idx").on(
      table.organizationId,
      table.createdAt,
    ),
    orgResourceIdx: index("audit_logs_org_resource_idx").on(
      table.organizationId,
      table.resourceType,
      table.resourceId,
    ),
    createdAtIdx: index("audit_logs_created_at_idx").on(table.createdAt),
  }),
);

export default auditLogsTable;
