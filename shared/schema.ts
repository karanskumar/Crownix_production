import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const contactSubmissionSchema = z.object({
  name: z.string().min(1, "Name is required"),
  company: z.string().optional(),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  message: z.string().min(1, "Message is required"),
  recaptchaToken: z.string().min(1, "reCAPTCHA token is required"),
});

export type ContactSubmission = z.infer<typeof contactSubmissionSchema>;

// Admin / Pricing & Package Portal schemas

export type AdminRole = "admin" | "state";
export type StateCode = "NSW" | "QLD" | "VIC";

export interface AdminSession {
  username: string;
  role: AdminRole;
  state?: StateCode;
}

// Lot within a stage
export const lotSchema = z.object({
  lotNumber: z.string().min(1, "Lot number is required"),
  landSize: z.string().min(1, "Land size is required"),
  price: z.string().min(1, "Price is required"),
  floorPlans: z.array(z.string()).min(1, "At least one floor plan is required"),
});

export type Lot = z.infer<typeof lotSchema>;

// Stage within a pricing request
export const stageSchema = z.object({
  stageName: z.string().min(1, "Stage name is required"),
  registration: z.string().optional(),
  lots: z.array(lotSchema).min(1, "At least one lot is required"),
});

export type Stage = z.infer<typeof stageSchema>;

// Additional costs
export const additionalCostsSchema = z.object({
  landBdmExpense: z.string().default("2500"),
  independentInspection: z.string().default("1200"),
  additionalMarketing: z.string().optional(),
});

export type AdditionalCosts = z.infer<typeof additionalCostsSchema>;

// File attachment metadata
export const fileMetaSchema = z.object({
  originalName: z.string(),
  filename: z.string(),
  mimetype: z.string(),
  size: z.number(),
  path: z.string(),
});

export type FileMeta = z.infer<typeof fileMetaSchema>;

// Pricing request
export const pricingRequestSchema = z.object({
  state: z.enum(["NSW", "QLD", "VIC"]),
  suburb: z.string().min(1, "Suburb is required"),
  estate: z.string().min(1, "Estate is required"),
  stages: z.array(stageSchema).min(1, "At least one stage is required"),
  additionalCosts: additionalCostsSchema,
  landLinks: z.array(z.string()).optional(),
  attachments: z.array(fileMetaSchema).optional(),
});

export type PricingRequestInput = z.infer<typeof pricingRequestSchema>;

export type PricingRequestStatus = "Incomplete" | "Pending" | "Approved";

export interface PricingRequest extends PricingRequestInput {
  id: string;
  status: PricingRequestStatus;
  createdAt: string;
}

// Package upload
export const packageUploadSchema = z.object({
  pricingRequestId: z.string().optional(),
  lotNumber: z.string().optional(),
  stageName: z.string().optional(),
  lotAddress: z.string().min(1, "Lot address is required"),
  landSize: z.string().min(1, "Land size is required"),
  landPrice: z.string().min(1, "Land price is required"),
  buildSize: z.string().optional(),
  buildPrice: z.string().optional(),
  totalPackagePrice: z.string().optional(),
  productCategory: z.string().optional(),
  forecastRegistrationDate: z.string().optional(),
  propertyType: z.string().optional(),
  floorPlanName: z.string().optional(),
  facadeName: z.string().optional(),
  bedroom: z.number().optional(),
  bath: z.number().optional(),
  living: z.number().optional(),
  garage: z.number().optional(),
  description: z.string().optional(),
  state: z.enum(["NSW", "QLD", "VIC"]).optional(),
  floorPlanFiles: z.array(fileMetaSchema).optional(),
  sitedFloorPlanFiles: z.array(fileMetaSchema).optional(),
  areaTableFiles: z.array(fileMetaSchema).optional(),
  facadeFiles: z.array(fileMetaSchema).optional(),
  inclusionFiles: z.array(fileMetaSchema).optional(),
  packageFiles: z.array(fileMetaSchema).optional(),
});

export type PackageUploadInput = z.infer<typeof packageUploadSchema>;

export type PackageUploadStatus = "Incomplete" | "Pending" | "Approved";

export interface PackageUpload extends PackageUploadInput {
  id: string;
  status: PackageUploadStatus;
  createdAt: string;
  zohoProductId?: string;
  zohoSyncError?: string;
}

// ─── PostgreSQL tables (used by PostgresStorage) ────────────────────────────

export const pricingRequestsTable = pgTable("pricing_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  status: text("status").notNull().default("Incomplete"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  data: jsonb("data").notNull(),
});

export const packageUploadsTable = pgTable("package_uploads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  status: text("status").notNull().default("Incomplete"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  zohoProductId: text("zoho_product_id"),
  zohoSyncError: text("zoho_sync_error"),
  data: jsonb("data").notNull(),
});
