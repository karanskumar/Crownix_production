import {
  type User, type InsertUser,
  type PricingRequest, type PricingRequestInput, type PricingRequestStatus,
  type PackageUpload, type PackageUploadInput, type PackageUploadStatus,
  pricingRequestsTable, packageUploadsTable, users,
} from "@shared/schema";
import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
import fs from "fs";
import path from "path";

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

// ─── JSON file storage (dev / Replit fallback) ───────────────────────────────

interface StorageData {
  users: Record<string, User>;
  pricingRequests: Record<string, PricingRequest>;
  packageUploads: Record<string, PackageUpload>;
}

const DATA_FILE = path.join(process.cwd(), "data", "admin-data.json");

function ensureDataDir() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function loadData(): StorageData {
  ensureDataDir();
  if (!fs.existsSync(DATA_FILE)) return { users: {}, pricingRequests: {}, packageUploads: {} };
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8")) as StorageData;
  } catch {
    console.warn("[storage] Failed to parse admin-data.json, starting fresh.");
    return { users: {}, pricingRequests: {}, packageUploads: {} };
  }
}

function saveData(data: StorageData) {
  ensureDataDir();
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

class JsonFileStorage implements IStorage {
  private data: StorageData;

  constructor() {
    this.data = loadData();
    console.log(
      `[storage] Loaded ${Object.keys(this.data.pricingRequests).length} pricing requests, ` +
      `${Object.keys(this.data.packageUploads).length} package uploads from disk.`
    );
  }

  private save() { saveData(this.data); }

  async getUser(id: string) { return this.data.users[id]; }
  async getUserByUsername(username: string) { return Object.values(this.data.users).find(u => u.username === username); }
  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.data.users[id] = user; this.save(); return user;
  }

  async createPricingRequest(input: PricingRequestInput): Promise<PricingRequest> {
    const id = randomUUID();
    const request: PricingRequest = { ...input, id, status: "Incomplete", createdAt: new Date().toISOString() };
    this.data.pricingRequests[id] = request; this.save(); return request;
  }
  async getPricingRequest(id: string) { return this.data.pricingRequests[id]; }
  async getAllPricingRequests() {
    return Object.values(this.data.pricingRequests).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  async updatePricingRequestStatus(id: string, status: PricingRequestStatus) {
    const r = this.data.pricingRequests[id]; if (!r) return undefined;
    r.status = status; this.save(); return r;
  }

  async createPackageUpload(input: PackageUploadInput, initialStatus: PackageUploadStatus = "Pending"): Promise<PackageUpload> {
    const id = randomUUID();
    const upload: PackageUpload = { ...input, id, status: initialStatus, createdAt: new Date().toISOString() };
    this.data.packageUploads[id] = upload; this.save(); return upload;
  }
  async getPackageUpload(id: string) { return this.data.packageUploads[id]; }
  async findPackageUploadByLot(pricingRequestId: string, lotNumber: string, stageName: string) {
    return Object.values(this.data.packageUploads).find(
      u => u.pricingRequestId === pricingRequestId && u.lotNumber === lotNumber && u.stageName === stageName
    );
  }
  async getAllPackageUploads() {
    return Object.values(this.data.packageUploads).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  async updatePackageUpload(id: string, input: Partial<PackageUploadInput> & { zohoProductId?: string; zohoSyncError?: string | undefined }) {
    const upload = this.data.packageUploads[id]; if (!upload) return undefined;
    Object.assign(upload, input); this.save(); return upload;
  }
  async updatePackageUploadStatus(id: string, status: PackageUploadStatus) {
    const upload = this.data.packageUploads[id]; if (!upload) return undefined;
    upload.status = status; this.save(); return upload;
  }
}

// ─── Singleton — picks PostgresStorage in production, JsonFileStorage in dev ─

let _storage: IStorage | undefined;

function createStorage(): IStorage {
  if (process.env.NODE_ENV === "production" && process.env.DATABASE_URL) {
    const { db } = require("./db") as { db: ReturnType<typeof import("drizzle-orm/neon-serverless").drizzle> };
    console.log("[storage] Using PostgreSQL storage");
    return new PostgresStorage(db);
  }
  console.log("[storage] Using JSON file storage (dev mode)");
  return new JsonFileStorage();
}

export const storage: IStorage = new Proxy({} as IStorage, {
  get(_target, prop) {
    if (!_storage) _storage = createStorage();
    return (_storage as any)[prop];
  },
});
