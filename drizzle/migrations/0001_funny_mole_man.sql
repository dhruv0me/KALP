CREATE TABLE "campaign_bookmarks" (
	"id" text PRIMARY KEY NOT NULL,
	"campaign_id" text NOT NULL,
	"user_email" text NOT NULL,
	"created_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "campaign_chat_messages" (
	"id" text PRIMARY KEY NOT NULL,
	"campaign_id" text NOT NULL,
	"sender_email" text NOT NULL,
	"sender_name" text,
	"message" text NOT NULL,
	"created_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "campaign_comments" (
	"id" text PRIMARY KEY NOT NULL,
	"campaign_id" text NOT NULL,
	"author_email" text NOT NULL,
	"author_name" text,
	"body" text NOT NULL,
	"created_at" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "campaigns" ADD COLUMN "owner_email" text;--> statement-breakpoint
ALTER TABLE "campaigns" ADD COLUMN "owner_name" text;--> statement-breakpoint
ALTER TABLE "campaigns" ADD COLUMN "owner_contact" text;--> statement-breakpoint
ALTER TABLE "campaigns" ADD COLUMN "restricted_documents" text;--> statement-breakpoint
ALTER TABLE "campaigns" ADD COLUMN "protected_proofs" text;--> statement-breakpoint
ALTER TABLE "campaigns" ADD COLUMN "created_at" text;