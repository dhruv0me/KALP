import { pgTable, text, integer } from "drizzle-orm/pg-core";

export const campaigns = pgTable("campaigns", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  country: text("country").notNull(),
  category: text("category").notNull(),
  currency: text("currency"),
  targetAmount: integer("target_amount"),
  collectedAmount: integer("collected_amount"),
  donorCount: integer("donor_count"),
  deadline: text("deadline"),
  status: text("status").notNull().default("draft"),
});
