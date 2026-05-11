import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { schema } from "@/database";

export const SelectAuditLogSchema = createSelectSchema(schema.auditLogsTable, {
  context: z.record(z.string(), z.unknown()),
});

export const InsertAuditLogSchema = createInsertSchema(schema.auditLogsTable, {
  context: z.record(z.string(), z.unknown()),
}).omit({ id: true, createdAt: true });

export type AuditLog = z.infer<typeof SelectAuditLogSchema>;
export type InsertAuditLog = z.infer<typeof InsertAuditLogSchema>;
