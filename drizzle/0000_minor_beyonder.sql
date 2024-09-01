CREATE TABLE IF NOT EXISTS "email_embeddings" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"email_id" text NOT NULL,
	"subject" text NOT NULL,
	"snippet" text NOT NULL,
	"date" timestamp NOT NULL,
	"from" text NOT NULL,
	"to" text NOT NULL,
	"embedding" vector(768) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"picture" text NOT NULL,
	"email" text NOT NULL,
	"grantId" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"lastLogin" timestamp DEFAULT now() NOT NULL,
	"dataLastRefreshed" timestamp DEFAULT now() NOT NULL,
	"embeddingGenerationStatus" text DEFAULT 'not_started' NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "email_embeddings" ADD CONSTRAINT "email_embeddings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "embeddingIndex" ON "email_embeddings" USING hnsw ("embedding" vector_cosine_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "unique_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "grantId_idx" ON "users" USING btree ("grantId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "email_idx" ON "users" USING btree ("email");