CREATE TABLE "campaigns" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"image_url" text,
	"country" text NOT NULL,
	"category" text NOT NULL,
	"currency" text,
	"target_amount" integer,
	"collected_amount" integer,
	"donor_count" integer,
	"deadline" text,
	"status" text DEFAULT 'draft' NOT NULL
);
