CREATE TABLE "audit_logs" (
	"id" text PRIMARY KEY NOT NULL,
	"actor_email" text NOT NULL,
	"action_type" text NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" text NOT NULL,
	"details" text,
	"ip_address" text,
	"created_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "campaign_expenses" (
	"id" text PRIMARY KEY NOT NULL,
	"campaign_id" text NOT NULL,
	"milestone_id" text,
	"description" text NOT NULL,
	"amount" integer NOT NULL,
	"currency" text DEFAULT 'INR' NOT NULL,
	"uploaded_receipts" text,
	"verification_status" text DEFAULT 'submitted' NOT NULL,
	"admin_approval_details" text,
	"submitted_by_email" text,
	"created_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "campaign_members" (
	"id" text PRIMARY KEY NOT NULL,
	"campaign_id" text NOT NULL,
	"user_id" text,
	"user_email" text NOT NULL,
	"user_name" text,
	"role" text DEFAULT 'member' NOT NULL,
	"permissions" text,
	"created_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "campaign_milestones" (
	"id" text PRIMARY KEY NOT NULL,
	"campaign_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"proposed_budget" integer NOT NULL,
	"deadline" text,
	"completion_status" text DEFAULT 'pending' NOT NULL,
	"approval_status" text DEFAULT 'pending' NOT NULL,
	"supporting_documents" text,
	"created_at" text NOT NULL,
	"updated_at" text
);
--> statement-breakpoint
CREATE TABLE "campaign_reviews" (
	"id" text PRIMARY KEY NOT NULL,
	"campaign_id" text NOT NULL,
	"reviewer_email" text NOT NULL,
	"rating" integer NOT NULL,
	"comment" text,
	"created_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "campaign_updates" (
	"id" text PRIMARY KEY NOT NULL,
	"campaign_id" text NOT NULL,
	"author_email" text NOT NULL,
	"author_name" text,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"images" text,
	"created_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "complaints" (
	"id" text PRIMARY KEY NOT NULL,
	"campaign_id" text NOT NULL,
	"reporter_email" text NOT NULL,
	"subject" text NOT NULL,
	"description" text NOT NULL,
	"evidence_urls" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"resolution_notes" text,
	"created_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "campaign_documents" (
	"id" text PRIMARY KEY NOT NULL,
	"campaign_id" text NOT NULL,
	"uploader_email" text NOT NULL,
	"document_type" text NOT NULL,
	"title" text NOT NULL,
	"file_url" text NOT NULL,
	"is_private" boolean DEFAULT true NOT NULL,
	"verification_status" text DEFAULT 'pending' NOT NULL,
	"created_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "donations" (
	"id" text PRIMARY KEY NOT NULL,
	"donor_id" text,
	"donor_email" text,
	"donor_name" text,
	"campaign_id" text NOT NULL,
	"original_amount" integer NOT NULL,
	"original_currency" text DEFAULT 'INR' NOT NULL,
	"converted_amount" integer NOT NULL,
	"base_currency" text DEFAULT 'INR' NOT NULL,
	"exchange_rate_at_donation" text DEFAULT '1.0' NOT NULL,
	"payment_status" text DEFAULT 'pending' NOT NULL,
	"transaction_reference" text NOT NULL,
	"gateway_reference" text,
	"privacy_preference" text DEFAULT 'public' NOT NULL,
	"created_at" text NOT NULL,
	CONSTRAINT "donations_transaction_reference_unique" UNIQUE("transaction_reference")
);
--> statement-breakpoint
CREATE TABLE "exchange_rate_records" (
	"id" text PRIMARY KEY NOT NULL,
	"from_currency" text NOT NULL,
	"to_currency" text NOT NULL,
	"rate" text NOT NULL,
	"effective_date" text NOT NULL,
	"created_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "campaign_notifications" (
	"id" text PRIMARY KEY NOT NULL,
	"user_email" text NOT NULL,
	"type" text NOT NULL,
	"title" text NOT NULL,
	"message" text NOT NULL,
	"link" text,
	"is_read" boolean DEFAULT false NOT NULL,
	"created_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payment_records" (
	"id" text PRIMARY KEY NOT NULL,
	"donation_id" text NOT NULL,
	"campaign_id" text NOT NULL,
	"payment_method" text NOT NULL,
	"gateway" text NOT NULL,
	"gateway_transaction_id" text,
	"status" text NOT NULL,
	"raw_response" text,
	"created_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "refund_requests" (
	"id" text PRIMARY KEY NOT NULL,
	"donation_id" text NOT NULL,
	"campaign_id" text NOT NULL,
	"donor_email" text NOT NULL,
	"reason" text NOT NULL,
	"amount" integer NOT NULL,
	"currency" text DEFAULT 'INR' NOT NULL,
	"status" text DEFAULT 'requested' NOT NULL,
	"processed_at" text,
	"created_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "kalp_users" (
	"id" text PRIMARY KEY NOT NULL,
	"first_name" text,
	"last_name" text,
	"email" text NOT NULL,
	"profile_image_url" text,
	"country" text,
	"preferred_language" text DEFAULT 'en',
	"account_status" text DEFAULT 'active' NOT NULL,
	"verification_status" text DEFAULT 'unverified' NOT NULL,
	"role" text DEFAULT 'user' NOT NULL,
	"created_at" text NOT NULL,
	"updated_at" text,
	CONSTRAINT "kalp_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "campaigns" ALTER COLUMN "currency" SET DEFAULT 'INR';--> statement-breakpoint
ALTER TABLE "campaigns" ALTER COLUMN "collected_amount" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "campaigns" ALTER COLUMN "donor_count" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "campaigns" ADD COLUMN "gallery_images" text;--> statement-breakpoint
ALTER TABLE "campaigns" ADD COLUMN "base_currency" text DEFAULT 'INR';--> statement-breakpoint
ALTER TABLE "campaigns" ADD COLUMN "approval_status" text DEFAULT 'draft' NOT NULL;--> statement-breakpoint
ALTER TABLE "campaigns" ADD COLUMN "review_notes" text;--> statement-breakpoint
ALTER TABLE "campaigns" ADD COLUMN "coordinator_id" text;--> statement-breakpoint
ALTER TABLE "campaigns" ADD COLUMN "updated_at" text;