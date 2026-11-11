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
  ownerEmail: text("owner_email"),
  ownerName: text("owner_name"),
  ownerContact: text("owner_contact"),
  restrictedDocuments: text("restricted_documents"),
  protectedProofs: text("protected_proofs"),
  createdAt: text("created_at"),
});

export const campaignBookmarks = pgTable("campaign_bookmarks", {
  id: text("id").primaryKey(),
  campaignId: text("campaign_id").notNull(),
  userEmail: text("user_email").notNull(),
  createdAt: text("created_at").notNull(),
});

export const campaignComments = pgTable("campaign_comments", {
  id: text("id").primaryKey(),
  campaignId: text("campaign_id").notNull(),
  authorEmail: text("author_email").notNull(),
  authorName: text("author_name"),
  body: text("body").notNull(),
  createdAt: text("created_at").notNull(),
});

export const campaignChatMessages = pgTable("campaign_chat_messages", {
  id: text("id").primaryKey(),
  campaignId: text("campaign_id").notNull(),
  senderEmail: text("sender_email").notNull(),
  senderName: text("sender_name"),
  message: text("message").notNull(),
  createdAt: text("created_at").notNull(),
});
