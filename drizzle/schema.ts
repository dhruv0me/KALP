import { pgTable, text, integer, boolean } from "drizzle-orm/pg-core";

// 1. Users Table (Profile & Roles)
export const users = pgTable("kalp_users", {
  id: text("id").primaryKey(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  email: text("email").notNull().unique(),
  profileImageUrl: text("profile_image_url"),
  country: text("country"),
  preferredLanguage: text("preferred_language").default("en"),
  accountStatus: text("account_status").notNull().default("active"), // active, suspended, banned
  verificationStatus: text("verification_status").notNull().default("unverified"), // unverified, pending, verified
  role: text("role").notNull().default("user"), // user, coordinator, admin, super_admin
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at"),
});

// 2. Campaigns Table
export const campaigns = pgTable("campaigns", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  galleryImages: text("gallery_images"), // JSON array of string image URLs
  country: text("country").notNull(),
  category: text("category").notNull(),
  currency: text("currency").default("INR"),
  baseCurrency: text("base_currency").default("INR"),
  targetAmount: integer("target_amount"),
  collectedAmount: integer("collected_amount").default(0),
  donorCount: integer("donor_count").default(0),
  deadline: text("deadline"),
  // Lifecycle: draft -> submitted -> document_verification -> under_review -> changes_required -> resubmitted -> approved -> active -> completed
  // Also: rejected, suspended, cancelled
  status: text("status").notNull().default("draft"),
  approvalStatus: text("approval_status").notNull().default("draft"), // draft, submitted, under_review, changes_required, approved, rejected
  reviewNotes: text("review_notes"),
  coordinatorId: text("coordinator_id"),
  ownerEmail: text("owner_email"),
  ownerName: text("owner_name"),
  ownerContact: text("owner_contact"),
  restrictedDocuments: text("restricted_documents"), // Legacy JSON or summary
  protectedProofs: text("protected_proofs"), // Legacy JSON or summary
  createdAt: text("created_at"),
  updatedAt: text("updated_at"),
});

// 3. Campaign Milestones Table
export const campaignMilestones = pgTable("campaign_milestones", {
  id: text("id").primaryKey(),
  campaignId: text("campaign_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  proposedBudget: integer("proposed_budget").notNull(),
  deadline: text("deadline"),
  completionStatus: text("completion_status").notNull().default("pending"), // pending, in_progress, completed
  approvalStatus: text("approval_status").notNull().default("pending"), // pending, approved, rejected
  supportingDocuments: text("supporting_documents"), // JSON array of document references
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at"),
});

// 4. Donations Table
export const donations = pgTable("donations", {
  id: text("id").primaryKey(),
  donorId: text("donor_id"),
  donorEmail: text("donor_email"),
  donorName: text("donor_name"),
  campaignId: text("campaign_id").notNull(),
  originalAmount: integer("original_amount").notNull(),
  originalCurrency: text("original_currency").notNull().default("INR"),
  convertedAmount: integer("converted_amount").notNull(),
  baseCurrency: text("base_currency").notNull().default("INR"),
  exchangeRateAtDonation: text("exchange_rate_at_donation").notNull().default("1.0"),
  paymentStatus: text("payment_status").notNull().default("pending"), // pending, processing, completed, failed, refunded
  transactionReference: text("transaction_reference").notNull().unique(),
  gatewayReference: text("gateway_reference"),
  privacyPreference: text("privacy_preference").notNull().default("public"), // public, anonymous, name_only
  createdAt: text("created_at").notNull(),
});

// 5. Campaign Expenses Table
export const campaignExpenses = pgTable("campaign_expenses", {
  id: text("id").primaryKey(),
  campaignId: text("campaign_id").notNull(),
  milestoneId: text("milestone_id"),
  description: text("description").notNull(),
  amount: integer("amount").notNull(),
  currency: text("currency").notNull().default("INR"),
  uploadedReceipts: text("uploaded_receipts"), // JSON array of receipt file URLs
  verificationStatus: text("verification_status").notNull().default("submitted"), // submitted, under_verification, verified, rejected
  adminApprovalDetails: text("admin_approval_details"), // JSON: { approvedBy, approvedAt, notes }
  submittedByEmail: text("submitted_by_email"),
  createdAt: text("created_at").notNull(),
});

// 6. Campaign Members Table (Platform limit: max 3 members per campaign)
export const campaignMembers = pgTable("campaign_members", {
  id: text("id").primaryKey(),
  campaignId: text("campaign_id").notNull(),
  userId: text("user_id"),
  userEmail: text("user_email").notNull(),
  userName: text("user_name"),
  role: text("role").notNull().default("member"), // coordinator, co_organizer, member
  permissions: text("permissions"), // JSON array of permitted capabilities
  createdAt: text("created_at").notNull(),
});

// 7. Campaign Updates Table
export const campaignUpdates = pgTable("campaign_updates", {
  id: text("id").primaryKey(),
  campaignId: text("campaign_id").notNull(),
  authorEmail: text("author_email").notNull(),
  authorName: text("author_name"),
  title: text("title").notNull(),
  content: text("content").notNull(),
  images: text("images"), // JSON array of image URLs
  createdAt: text("created_at").notNull(),
});

// 8. Campaign Documents Table
export const documents = pgTable("campaign_documents", {
  id: text("id").primaryKey(),
  campaignId: text("campaign_id").notNull(),
  uploaderEmail: text("uploader_email").notNull(),
  documentType: text("document_type").notNull(), // proposal, identity_proof, budget_quote, permission_letter, milestone_proof
  title: text("title").notNull(),
  fileUrl: text("file_url").notNull(),
  isPrivate: boolean("is_private").notNull().default(true),
  verificationStatus: text("verification_status").notNull().default("pending"), // pending, verified, rejected
  createdAt: text("created_at").notNull(),
});

// 9. Campaign Bookmarks Table
export const campaignBookmarks = pgTable("campaign_bookmarks", {
  id: text("id").primaryKey(),
  campaignId: text("campaign_id").notNull(),
  userEmail: text("user_email").notNull(),
  createdAt: text("created_at").notNull(),
});

// 10. Campaign Comments Table
export const campaignComments = pgTable("campaign_comments", {
  id: text("id").primaryKey(),
  campaignId: text("campaign_id").notNull(),
  authorEmail: text("author_email").notNull(),
  authorName: text("author_name"),
  body: text("body").notNull(),
  createdAt: text("created_at").notNull(),
});

// 11. Campaign Chat Messages Table (Supporter group chats)
export const campaignChatMessages = pgTable("campaign_chat_messages", {
  id: text("id").primaryKey(),
  campaignId: text("campaign_id").notNull(),
  senderEmail: text("sender_email").notNull(),
  senderName: text("sender_name"),
  message: text("message").notNull(),
  createdAt: text("created_at").notNull(),
});

// 12. Complaints Table
export const complaints = pgTable("complaints", {
  id: text("id").primaryKey(),
  campaignId: text("campaign_id").notNull(),
  reporterEmail: text("reporter_email").notNull(),
  subject: text("subject").notNull(),
  description: text("description").notNull(),
  evidenceUrls: text("evidence_urls"), // JSON array of evidence links
  status: text("status").notNull().default("pending"), // pending, investigating, resolved, dismissed
  resolutionNotes: text("resolution_notes"),
  createdAt: text("created_at").notNull(),
});

// 13. Refund Requests Table
export const refundRequests = pgTable("refund_requests", {
  id: text("id").primaryKey(),
  donationId: text("donation_id").notNull(),
  campaignId: text("campaign_id").notNull(),
  donorEmail: text("donor_email").notNull(),
  reason: text("reason").notNull(),
  amount: integer("amount").notNull(),
  currency: text("currency").notNull().default("INR"),
  status: text("status").notNull().default("requested"), // requested, approved, rejected, processed
  processedAt: text("processed_at"),
  createdAt: text("created_at").notNull(),
});

// 14. Campaign Notifications Table
export const notifications = pgTable("campaign_notifications", {
  id: text("id").primaryKey(),
  userEmail: text("user_email").notNull(),
  type: text("type").notNull(), // campaign_update, donation_received, milestone_approved, system
  title: text("title").notNull(),
  message: text("message").notNull(),
  link: text("link"),
  isRead: boolean("is_read").notNull().default(false),
  createdAt: text("created_at").notNull(),
});

// 15. Campaign Reviews Table
export const campaignReviews = pgTable("campaign_reviews", {
  id: text("id").primaryKey(),
  campaignId: text("campaign_id").notNull(),
  reviewerEmail: text("reviewer_email").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: text("created_at").notNull(),
});

// 16. Audit Logs Table
export const auditLogs = pgTable("audit_logs", {
  id: text("id").primaryKey(),
  actorEmail: text("actor_email").notNull(),
  actionType: text("action_type").notNull(),
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id").notNull(),
  details: text("details"), // JSON formatted string with action parameters
  ipAddress: text("ip_address"),
  createdAt: text("created_at").notNull(),
});

// 17. Exchange Rate Records Table (Historical records, never overwritten)
export const exchangeRateRecords = pgTable("exchange_rate_records", {
  id: text("id").primaryKey(),
  fromCurrency: text("from_currency").notNull(),
  toCurrency: text("to_currency").notNull(),
  rate: text("rate").notNull(),
  effectiveDate: text("effective_date").notNull(),
  createdAt: text("created_at").notNull(),
});

// 18. Payment Records Table
export const paymentRecords = pgTable("payment_records", {
  id: text("id").primaryKey(),
  donationId: text("donation_id").notNull(),
  campaignId: text("campaign_id").notNull(),
  paymentMethod: text("payment_method").notNull(), // upi, card, netbanking, crypto_prep
  gateway: text("gateway").notNull(), // razorpay, stripe, mock_ledger
  gatewayTransactionId: text("gateway_transaction_id"),
  status: text("status").notNull(), // created, captured, failed, refunded
  rawResponse: text("raw_response"),
  createdAt: text("created_at").notNull(),
});
