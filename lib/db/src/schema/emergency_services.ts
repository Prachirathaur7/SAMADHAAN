import { pgTable, text, decimal, uuid } from "drizzle-orm/pg-core";

export const emergencyServicesTable = pgTable("emergency_services", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  type: text("type").notNull(), // police | hospital | fire_station | municipal
  lat: decimal("lat", { precision: 9, scale: 6 }).notNull(),
  lng: decimal("lng", { precision: 9, scale: 6 }).notNull(),
  phone: text("phone").notNull(),
});

export type EmergencyService = typeof emergencyServicesTable.$inferSelect;
