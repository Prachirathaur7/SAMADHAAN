import { pgTable, text, decimal, real, integer, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const complaintsTable = pgTable("complaints", {
  id: uuid("id").primaryKey().defaultRandom(),
  lat: decimal("lat", { precision: 9, scale: 6 }).notNull(),
  lng: decimal("lng", { precision: 9, scale: 6 }).notNull(),
  category: text("category").notNull(), // road | water | garbage | drainage | electricity | other
  severity: text("severity").notNull().default("medium"), // low | medium | high | critical
  status: text("status").notNull().default("open"), // open | assigned | in_progress | resolved
  description: text("description").notNull(),
  wardId: text("ward_id").notNull().default(""),
  wardName: text("ward_name").notNull().default(""),
  reporterCount: integer("reporter_count").notNull().default(1),
  imageUrl: text("image_url"),
  aiCategory: text("ai_category"),
  aiDepartment: text("ai_department"),
  aiConfidence: real("ai_confidence"),
  aiSummary: text("ai_summary"),
  aiModel: text("ai_model"),
  aiSource: text("ai_source"),
  aiDuplicateOf: uuid("ai_duplicate_of"),
  aiDuplicateScore: real("ai_duplicate_score"),
  reportedAt: timestamp("reported_at").notNull().defaultNow(),
});

export const insertComplaintSchema = createInsertSchema(complaintsTable).omit({
  id: true,
  reportedAt: true,
  reporterCount: true,
});

export type InsertComplaint = z.infer<typeof insertComplaintSchema>;
export type Complaint = typeof complaintsTable.$inferSelect;
