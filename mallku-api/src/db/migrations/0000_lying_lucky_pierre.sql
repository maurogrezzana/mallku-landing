CREATE TYPE "public"."booking_status" AS ENUM('pending', 'confirmed', 'paid', 'completed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."booking_tipo" AS ENUM('fecha-fija', 'personalizada');--> statement-breakpoint
CREATE TYPE "public"."date_status" AS ENUM('disponible', 'pocos-cupos', 'completo', 'cancelado');--> statement-breakpoint
CREATE TYPE "public"."lead_status" AS ENUM('new', 'contacted', 'qualified', 'converted', 'lost');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('pending', 'partial', 'paid', 'refunded');--> statement-breakpoint
CREATE TYPE "public"."propuesta_estado" AS ENUM('pendiente', 'aprobada', 'rechazada');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('admin', 'staff', 'viewer');--> statement-breakpoint
CREATE TABLE "bookings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"booking_number" varchar(20) NOT NULL,
	"tipo" "booking_tipo" NOT NULL,
	"date_id" uuid,
	"excursion_id" uuid,
	"lead_id" uuid,
	"nombre_completo" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"telefono" varchar(50) NOT NULL,
	"dni" varchar(20),
	"cantidad_personas" integer NOT NULL,
	"precio_total" integer,
	"fecha_propuesta" timestamp,
	"estado_propuesta" "propuesta_estado",
	"motivo_rechazo" text,
	"status" "booking_status" DEFAULT 'pending' NOT NULL,
	"payment_status" "payment_status" DEFAULT 'pending' NOT NULL,
	"senia_pagada" integer DEFAULT 0,
	"payment_reference" varchar(255),
	"notas_cliente" text,
	"notas_internas" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"confirmed_at" timestamp,
	"completed_at" timestamp,
	"cancelled_at" timestamp,
	CONSTRAINT "bookings_booking_number_unique" UNIQUE("booking_number")
);
--> statement-breakpoint
CREATE TABLE "dates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"excursion_id" uuid NOT NULL,
	"fecha" timestamp NOT NULL,
	"hora_salida" varchar(10),
	"cupos_totales" integer NOT NULL,
	"cupos_reservados" integer DEFAULT 0 NOT NULL,
	"estado" date_status DEFAULT 'disponible' NOT NULL,
	"precio_override" integer,
	"notas" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" varchar(100) NOT NULL,
	"lead_id" uuid,
	"event_type" varchar(50) NOT NULL,
	"event_name" varchar(100) NOT NULL,
	"properties" jsonb DEFAULT '{}'::jsonb,
	"page_url" varchar(500),
	"referrer" varchar(500),
	"user_agent" varchar(500),
	"country" varchar(100),
	"city" varchar(100),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "excursions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(100) NOT NULL,
	"titulo" varchar(255) NOT NULL,
	"subtitulo" varchar(255),
	"descripcion" text,
	"descripcion_larga" jsonb DEFAULT '[]'::jsonb,
	"duracion" varchar(100),
	"precio_base" integer,
	"grupo_max" integer,
	"dificultad" varchar(50),
	"highlights" jsonb DEFAULT '[]'::jsonb,
	"itinerario" jsonb DEFAULT '[]'::jsonb,
	"incluye" jsonb DEFAULT '[]'::jsonb,
	"no_incluye" jsonb DEFAULT '[]'::jsonb,
	"recomendaciones" jsonb DEFAULT '[]'::jsonb,
	"imagen_principal" varchar(500),
	"galeria" jsonb DEFAULT '[]'::jsonb,
	"is_active" boolean DEFAULT true NOT NULL,
	"orden" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "excursions_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nombre" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"telefono" varchar(50),
	"excursion_interes" varchar(255),
	"mensaje" text,
	"status" "lead_status" DEFAULT 'new' NOT NULL,
	"assigned_to" uuid,
	"source" varchar(100),
	"utm_source" varchar(100),
	"utm_medium" varchar(100),
	"utm_campaign" varchar(100),
	"tags" jsonb DEFAULT '[]'::jsonb,
	"notas" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"contacted_at" timestamp,
	"converted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "newsletter_subscribers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"nombre" varchar(255),
	"is_active" boolean DEFAULT true NOT NULL,
	"source" varchar(100),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"unsubscribed_at" timestamp,
	CONSTRAINT "newsletter_subscribers_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"full_name" varchar(255) NOT NULL,
	"role" "user_role" DEFAULT 'staff' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"last_login_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_date_id_dates_id_fk" FOREIGN KEY ("date_id") REFERENCES "public"."dates"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_excursion_id_excursions_id_fk" FOREIGN KEY ("excursion_id") REFERENCES "public"."excursions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dates" ADD CONSTRAINT "dates_excursion_id_excursions_id_fk" FOREIGN KEY ("excursion_id") REFERENCES "public"."excursions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leads" ADD CONSTRAINT "leads_assigned_to_users_id_fk" FOREIGN KEY ("assigned_to") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;