import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";
import { projectsTable } from "./projects";

export const filesTable = pgTable("files", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  projectId: text("project_id").references(() => projectsTable.id, { onDelete: "set null" }),
  name: text("name").notNull(),
  size: integer("size").notNull().default(0),         // bytes
  mimeType: text("mime_type").notNull().default("application/octet-stream"),
  contentHash: text("content_hash").notNull(),         // sha256 hex of file content
  storageUrl: text("storage_url").notNull().default(""),
  onChainHash: text("on_chain_hash"),                  // bytes32 hex once anchored
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertFileSchema = createInsertSchema(filesTable).omit({ id: true, createdAt: true });
export type InsertFile = z.infer<typeof insertFileSchema>;
export type File = typeof filesTable.$inferSelect;
