CREATE TABLE "package_uploads" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"status" text DEFAULT 'Incomplete' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"zoho_product_id" text,
	"zoho_sync_error" text,
	"data" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pricing_requests" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"status" text DEFAULT 'Incomplete' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"data" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
