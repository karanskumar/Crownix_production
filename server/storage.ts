import {
  type User, type InsertUser,
  type PricingRequest, type PricingRequestInput, type PricingRequestStatus,
  type PackageUpload, type PackageUploadInput, type PackageUploadStatus,
  pricingRequestsTable, packageUploadsTable, users,
} from "@shared/schema";
import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  createPricingRequest(input: PricingRequestInput): Promise<PricingRequest>;
  getPricingRequest(id: string): Promise<PricingRequest | undefined>;
  getAllPricingRequests(): Promise<PricingRequest[]>;
  updatePricingRequestStatus(id: string, status: PricingRequestStatus): Promise<PricingRequest | undefined>;

  createPackageUpload(input: PackageUploadInput, initialStatus?: PackageUploadStatus): Promise<PackageUpload>;
  getPackageUpload(id: string): Promise<PackageUpload | undefined>;
  findPackageUploadByLot(pricingRequestId: string, lotNumber: string, stageName: string): Promise<PackageUpload | undefined>;
  getAllPackageUploads(): Promise<PackageUpload[]>;
  updatePackageUpload(id: string, input: Partial<PackageUploadInput> & { zohoProductId?: string; zohoSyncError?: string | undefined }): Promise<PackageUpload | undefined>;
  updatePackageUploadStatus(id: string, status: PackageUploadStatus): Promise<PackageUpload | undefined>;
}

// ─── Helper: row → domain object ───────────────────────────────────────────

function rowToPricingRequest(row: typeof pricingRequestsTable.$inferSelect): PricingRequest {
  const data = row.data as Omit<PricingRequestInput, never>;
  return {
    ...(data as PricingRequestInput),
    id: row.id,
    status: row.status as PricingRequestStatus,
    createdAt: row.createdAt.toISOString(),
  };
}

function rowToPackageUpload(row: typeof packageUploadsTable.$inferSelect): PackageUpload {
  const data = row.data as PackageUploadInput;
  return {
    ...data,
    id: row.id,
    status: row.status as PackageUploadStatus,
    createdAt: row.createdAt.toISOString(),
    zohoProductId: row.zohoProductId ?? undefined,
    zohoSyncError: row.zohoSyncError ?? undefined,
  };
}

// ─── PostgreSQL implementation ──────────────────────────────────────────────

export class PostgresStorage implements IStorage {
  private db: ReturnType<typeof import("drizzle-orm/neon-serverless").drizzle>;

  constructor(db: ReturnType<typeof import("drizzle-orm/neon-serverless").drizzle>) {
    this.db = db;
  }

  async getUser(id: string): Promise<User | undefined> {
    const rows = await this.db.select().from(users).where(eq(users.id, id));
    return rows[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const rows = await this.db.select().from(users).where(eq(users.username, username));
    return rows[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const rows = await this.db.insert(users).values({ ...insertUser, id: randomUUID() }).returning();
    return rows[0];
  }

  async createPricingRequest(input: PricingRequestInput): Promise<PricingRequest> {
    const id = randomUUID();
    const rows = await this.db.insert(pricingRequestsTable).values({
      id,
      status: "Incomplete",
      data: input as any,
    }).returning();
    return rowToPricingRequest(rows[0]);
  }

  async getPricingRequest(id: string): Promise<PricingRequest | undefined> {
    const rows = await this.db.select().from(pricingRequestsTable).where(eq(pricingRequestsTable.id, id));
    return rows[0] ? rowToPricingRequest(rows[0]) : undefined;
  }

  async getAllPricingRequests(): Promise<PricingRequest[]> {
    const rows = await this.db.select().from(pricingRequestsTable)
      .orderBy(pricingRequestsTable.createdAt);
    return rows.map(rowToPricingRequest).reverse();
  }

  async updatePricingRequestStatus(id: string, status: PricingRequestStatus): Promise<PricingRequest | undefined> {
    const rows = await this.db.update(pricingRequestsTable)
      .set({ status })
      .where(eq(pricingRequestsTable.id, id))
      .returning();
    return rows[0] ? rowToPricingRequest(rows[0]) : undefined;
  }

  async createPackageUpload(input: PackageUploadInput, initialStatus: PackageUploadStatus = "Pending"): Promise<PackageUpload> {
    const id = randomUUID();
    const rows = await this.db.insert(packageUploadsTable).values({
      id,
      status: initialStatus,
      data: input as any,
    }).returning();
    return rowToPackageUpload(rows[0]);
  }

  async getPackageUpload(id: string): Promise<PackageUpload | undefined> {
    const rows = await this.db.select().from(packageUploadsTable).where(eq(packageUploadsTable.id, id));
    return rows[0] ? rowToPackageUpload(rows[0]) : undefined;
  }

  async findPackageUploadByLot(pricingRequestId: string, lotNumber: string, stageName: string): Promise<PackageUpload | undefined> {
    const all = await this.getAllPackageUploads();
    return all.find(u =>
      u.pricingRequestId === pricingRequestId &&
      u.lotNumber === lotNumber &&
      u.stageName === stageName
    );
  }

  async getAllPackageUploads(): Promise<PackageUpload[]> {
    const rows = await this.db.select().from(packageUploadsTable)
      .orderBy(packageUploadsTable.createdAt);
    return rows.map(rowToPackageUpload).reverse();
  }

  async updatePackageUpload(
    id: string,
    input: Partial<PackageUploadInput> & { zohoProductId?: string; zohoSyncError?: string | undefined }
  ): Promise<PackageUpload | undefined> {
    const existing = await this.getPackageUpload(id);
    if (!existing) return undefined;

    const { zohoProductId, zohoSyncError, ...dataFields } = input;

    const mergedData = { ...existing, ...dataFields };
    const { id: _id, status: _status, createdAt: _createdAt, zohoProductId: _zpid, zohoSyncError: _zse, ...cleanData } = mergedData;

    const setFields: Record<string, any> = { data: cleanData as any };
    if (zohoProductId !== undefined) setFields.zohoProductId = zohoProductId;
    if ("zohoSyncError" in input) setFields.zohoSyncError = zohoSyncError ?? null;

    const rows = await this.db.update(packageUploadsTable)
      .set(setFields)
      .where(eq(packageUploadsTable.id, id))
      .returning();
    return rows[0] ? rowToPackageUpload(rows[0]) : undefined;
  }

  async updatePackageUploadStatus(id: string, status: PackageUploadStatus): Promise<PackageUpload | undefined> {
    const rows = await this.db.update(packageUploadsTable)
      .set({ status })
      .where(eq(packageUploadsTable.id, id))
      .returning();
    return rows[0] ? rowToPackageUpload(rows[0]) : undefined;
  }
}

// ─── Singleton ───────────────────────────────────────────────────────────────
// Imported lazily to avoid crashing at module load if DATABASE_URL is absent
// (e.g. during frontend-only builds).

let _storage: IStorage | undefined;

function createStorage(): IStorage {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is required. Set it in your environment variables.");
  }
  const { db } = require("./db") as { db: ReturnType<typeof import("drizzle-orm/neon-serverless").drizzle> };
  return new PostgresStorage(db);
}

export const storage: IStorage = new Proxy({} as IStorage, {
  get(_target, prop) {
    if (!_storage) _storage = createStorage();
    return (_storage as any)[prop];
  },
});
