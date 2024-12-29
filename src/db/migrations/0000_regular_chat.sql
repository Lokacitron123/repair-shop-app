CREATE TABLE "customers" (
	"id" serial PRIMARY KEY NOT NULL,
	"firstName" varchar NOT NULL,
	"lastName" varchar NOT NULL,
	"email" varchar NOT NULL,
	"phone" varchar NOT NULL,
	"address1" varchar NOT NULL,
	"address2" varchar,
	"city" varchar NOT NULL,
	"state" varchar NOT NULL,
	"zip" varchar(10) NOT NULL,
	"notes" text,
	"active" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "customers_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "tickets" (
	"id" serial PRIMARY KEY NOT NULL,
	"customerId" integer NOT NULL,
	"title" varchar NOT NULL,
	"description" text,
	"completed" boolean DEFAULT false NOT NULL,
	"tech" varchar DEFAULT 'unassigned' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_customerId_customers_id_fk" FOREIGN KEY ("customerId") REFERENCES "public"."customers"("id") ON DELETE no action ON UPDATE no action;