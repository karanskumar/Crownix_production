import { type User, type InsertUser, type PricingRequest, type PricingRequestInput, type PackageUpload, type PackageUploadInput, type PricingRequestStatus, type PackageUploadStatus } from "@shared/schema";
import { randomUUID } from "crypto";

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

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private pricingRequests: Map<string, PricingRequest>;
  private packageUploads: Map<string, PackageUpload>;

  constructor() {
    this.users = new Map();
    this.pricingRequests = new Map();
    this.packageUploads = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
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
    this.pricingRequests.set(id, request);
    return request;
  }

  async getPricingRequest(id: string): Promise<PricingRequest | undefined> {
    return this.pricingRequests.get(id);
  }

  async getAllPricingRequests(): Promise<PricingRequest[]> {
    return Array.from(this.pricingRequests.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async updatePricingRequestStatus(id: string, status: PricingRequestStatus): Promise<PricingRequest | undefined> {
    const request = this.pricingRequests.get(id);
    if (!request) return undefined;
    const updated = { ...request, status };
    this.pricingRequests.set(id, updated);
    return updated;
  }

  async createPackageUpload(input: PackageUploadInput, initialStatus?: PackageUploadStatus): Promise<PackageUpload> {
    const id = randomUUID();
    const upload: PackageUpload = {
      ...input,
      id,
      status: initialStatus || "Pending",
      createdAt: new Date().toISOString(),
    };
    this.packageUploads.set(id, upload);
    return upload;
  }

  async getPackageUpload(id: string): Promise<PackageUpload | undefined> {
    return this.packageUploads.get(id);
  }

  async getAllPackageUploads(): Promise<PackageUpload[]> {
    return Array.from(this.packageUploads.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async updatePackageUpload(id: string, input: Partial<PackageUploadInput>): Promise<PackageUpload | undefined> {
    const upload = this.packageUploads.get(id);
    if (!upload) return undefined;
    const updated = { ...upload, ...input };
    this.packageUploads.set(id, updated);
    return updated;
  }

  async updatePackageUploadStatus(id: string, status: PackageUploadStatus): Promise<PackageUpload | undefined> {
    const upload = this.packageUploads.get(id);
    if (!upload) return undefined;
    const updated = { ...upload, status };
    this.packageUploads.set(id, updated);
    return updated;
  }
}

export const storage = new MemStorage();
