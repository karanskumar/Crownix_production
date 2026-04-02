import { type User, type InsertUser, type PricingRequest, type PricingRequestInput, type PackageUpload, type PackageUploadInput, type PricingRequestStatus, type PackageUploadStatus } from "@shared/schema";
import { randomUUID } from "crypto";
import fs from "fs";
import path from "path";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Pricing Requests
  createPricingRequest(input: PricingRequestInput): Promise<PricingRequest>;
  getPricingRequest(id: string): Promise<PricingRequest | undefined>;
  getAllPricingRequests(): Promise<PricingRequest[]>;
  updatePricingRequestStatus(id: string, status: PricingRequestStatus): Promise<PricingRequest | undefined>;

  // Package Uploads
  createPackageUpload(input: PackageUploadInput, initialStatus?: PackageUploadStatus): Promise<PackageUpload>;
  getPackageUpload(id: string): Promise<PackageUpload | undefined>;
  getAllPackageUploads(): Promise<PackageUpload[]>;
  updatePackageUpload(id: string, input: Partial<PackageUploadInput>): Promise<PackageUpload | undefined>;
  updatePackageUploadStatus(id: string, status: PackageUploadStatus): Promise<PackageUpload | undefined>;
}

interface StorageData {
  users: Record<string, User>;
  pricingRequests: Record<string, PricingRequest>;
  packageUploads: Record<string, PackageUpload>;
}

const DATA_FILE = path.join(process.cwd(), "data", "admin-data.json");

function ensureDataDir() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function loadData(): StorageData {
  ensureDataDir();
  if (!fs.existsSync(DATA_FILE)) {
    return { users: {}, pricingRequests: {}, packageUploads: {} };
  }
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw) as StorageData;
  } catch {
    console.warn("Failed to parse admin-data.json, starting fresh.");
    return { users: {}, pricingRequests: {}, packageUploads: {} };
  }
}

function saveData(data: StorageData) {
  ensureDataDir();
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

export class JsonFileStorage implements IStorage {
  private data: StorageData;

  constructor() {
    this.data = loadData();
    console.log(
      `[storage] Loaded ${Object.keys(this.data.pricingRequests).length} pricing requests, ` +
      `${Object.keys(this.data.packageUploads).length} package uploads from disk.`
    );
  }

  private save() {
    saveData(this.data);
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.data.users[id];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Object.values(this.data.users).find((u) => u.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.data.users[id] = user;
    this.save();
    return user;
  }

  async createPricingRequest(input: PricingRequestInput): Promise<PricingRequest> {
    const id = randomUUID();
    const request: PricingRequest = {
      ...input,
      id,
      status: "Incomplete",
      createdAt: new Date().toISOString(),
    };
    this.data.pricingRequests[id] = request;
    this.save();
    return request;
  }

  async getPricingRequest(id: string): Promise<PricingRequest | undefined> {
    return this.data.pricingRequests[id];
  }

  async getAllPricingRequests(): Promise<PricingRequest[]> {
    return Object.values(this.data.pricingRequests).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async updatePricingRequestStatus(id: string, status: PricingRequestStatus): Promise<PricingRequest | undefined> {
    const request = this.data.pricingRequests[id];
    if (!request) return undefined;
    request.status = status;
    this.save();
    return request;
  }

  async createPackageUpload(input: PackageUploadInput, initialStatus?: PackageUploadStatus): Promise<PackageUpload> {
    const id = randomUUID();
    const upload: PackageUpload = {
      ...input,
      id,
      status: initialStatus || "Pending",
      createdAt: new Date().toISOString(),
    };
    this.data.packageUploads[id] = upload;
    this.save();
    return upload;
  }

  async getPackageUpload(id: string): Promise<PackageUpload | undefined> {
    return this.data.packageUploads[id];
  }

  async getAllPackageUploads(): Promise<PackageUpload[]> {
    return Object.values(this.data.packageUploads).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async updatePackageUpload(id: string, input: Partial<PackageUploadInput>): Promise<PackageUpload | undefined> {
    const upload = this.data.packageUploads[id];
    if (!upload) return undefined;
    Object.assign(upload, input);
    this.save();
    return upload;
  }

  async updatePackageUploadStatus(id: string, status: PackageUploadStatus): Promise<PackageUpload | undefined> {
    const upload = this.data.packageUploads[id];
    if (!upload) return undefined;
    upload.status = status;
    this.save();
    return upload;
  }
}

export const storage = new JsonFileStorage();
