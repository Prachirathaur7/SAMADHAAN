import { pgTable, text, integer, decimal } from "drizzle-orm/pg-core";

export const wardsTable = pgTable("wards", {
  wardId: text("ward_id").primaryKey(),
  wardName: text("ward_name").notNull(),
  centerLat: decimal("center_lat", { precision: 9, scale: 6 }).notNull(),
  centerLng: decimal("center_lng", { precision: 9, scale: 6 }).notNull(),
  // boundaryCoords stored as JSON string: [[lat,lng], ...]
  boundaryCoords: text("boundary_coords").notNull().default("[]"),
  zone: text("zone").notNull().default(""),
});

export type Ward = typeof wardsTable.$inferSelect;
