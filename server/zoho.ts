import fs from "fs";
import path from "path";
import type { PackageUpload, FileMeta, PricingRequest } from "@shared/schema";

const ZOHO_CONFIG = {
  accountsUrl: "https://accounts.zoho.in",
  apiDomain: "https://www.zohoapis.in",
  apiVersion: "v8",
};

export async function getZohoAccessToken(): Promise<string> {
  const clientId = process.env.ZOHO_CLIENT_ID;
  const clientSecret = process.env.ZOHO_CLIENT_SECRET;
  const refreshToken = process.env.ZOHO_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("Zoho credentials not configured (ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET, ZOHO_REFRESH_TOKEN)");
  }

  const params = new URLSearchParams({
    refresh_token: refreshToken,
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: "refresh_token",
  });

  const res = await fetch(`${ZOHO_CONFIG.accountsUrl}/oauth/v2/token`, {
    method: "POST",
    body: params,
  });

  const data = await res.json() as { access_token?: string };

  if (!res.ok || !data.access_token) {
    throw new Error(`Zoho access token error: ${JSON.stringify(data)}`);
  }

  return data.access_token;
}

export function mapPackageToZohoProduct(pkg: PackageUpload, pricingRequest?: PricingRequest): Record<string, unknown> {
  const VENDOR_NAME_ID = "1147855000000600719";
  const LAYOUT_ID = "1147855000000599158";

  const fields: Record<string, unknown> = {
    Product_Name: pkg.lotAddress,
    Vendor_Name: VENDOR_NAME_ID,
    Layout: LAYOUT_ID,
  };

  if (pkg.state) fields["State"] = pkg.state;
  if (pkg.stageName) {
    const stageInt = parseInt(pkg.stageName, 10);
    fields["Stage_Batch"] = isNaN(stageInt) ? pkg.stageName : stageInt;
  }
  if (pkg.forecastRegistrationDate) fields["Forecast_Registration_Date"] = pkg.forecastRegistrationDate;
  if (pkg.landSize) fields["Land_Size_m2"] = parseFloat(pkg.landSize) || pkg.landSize;
  if (pkg.landPrice) fields["Land_Price"] = parseFloat(pkg.landPrice) || pkg.landPrice;
  if (pkg.buildSize) fields["Build_Size_m2"] = pkg.buildSize;
  if (pkg.buildPrice) fields["Build_Price"] = parseFloat(pkg.buildPrice) || pkg.buildPrice;
  if (pkg.totalPackagePrice) fields["Total_Package_Price"] = parseFloat(pkg.totalPackagePrice) || pkg.totalPackagePrice;
  if (pkg.productCategory) fields["Product_Category"] = pkg.productCategory;
  if (pkg.propertyType) fields["Property_Type"] = [pkg.propertyType];
  if (pkg.floorPlanName) fields["Floor_Plan_Name"] = pkg.floorPlanName;
  if (pkg.facadeName) fields["Facade_Name"] = pkg.facadeName;
  if (pkg.bedroom != null) fields["Bedroom"] = pkg.bedroom;
  if (pkg.bath != null) fields["Bath"] = pkg.bath;
  if (pkg.living != null) fields["Living"] = pkg.living;
  if (pkg.garage != null) fields["Garage"] = pkg.garage;
  if (pkg.description) fields["Description"] = pkg.description;

  // Land links from the pricing request — stored as a newline-separated text field
  // (cannot be sent as file attachments because Zoho CRM rejects text/plain files)
  if (pricingRequest?.landLinks && pricingRequest.landLinks.length > 0) {
    fields["Land_Link"] = pricingRequest.landLinks.join("\n");
  }

  return fields;
}

export async function createZohoProduct(
  fieldMap: Record<string, unknown>,
  accessToken: string
): Promise<string> {
  const url = `${ZOHO_CONFIG.apiDomain}/crm/${ZOHO_CONFIG.apiVersion}/Products`;

  const payload = { data: [fieldMap] };

  console.log("[zoho] Creating product with payload:", JSON.stringify(fieldMap, null, 2));

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Zoho-oauthtoken ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json() as { data?: Array<{ details?: { id?: string }; status?: string; message?: string; code?: string }> };

  console.log("[zoho] Create product response:", JSON.stringify(data, null, 2));

  if (!res.ok) {
    throw new Error(`Zoho create product error: ${JSON.stringify(data)}`);
  }

  const record = data.data?.[0];

  if (record?.status === "error") {
    throw new Error(`Zoho create product record error: ${JSON.stringify(record)}`);
  }

  const productId = record?.details?.id;

  if (!productId) {
    throw new Error(`Zoho product ID not returned: ${JSON.stringify(data)}`);
  }

  return productId;
}

// Category label → Zoho upload filename prefix mapping
const FILE_CATEGORY_LABELS: Record<string, string> = {
  floorPlanFiles: "Floor_Plan",
  sitedFloorPlanFiles: "Sited_Floor_Plan",
  areaTableFiles: "Area_Table",
  facadeFiles: "Facade",
  inclusionFiles: "Inclusion",
};

interface CategorisedFile {
  meta?: FileMeta;
  buffer?: Buffer;
  mimetype: string;
  uploadName: string;
}

function buildCategorisedFiles(pkg: PackageUpload, pricingRequest?: PricingRequest): CategorisedFile[] {
  const result: CategorisedFile[] = [];

  const categories: Array<{ key: keyof typeof FILE_CATEGORY_LABELS; files: FileMeta[] | undefined }> = [
    { key: "floorPlanFiles", files: pkg.floorPlanFiles },
    { key: "sitedFloorPlanFiles", files: pkg.sitedFloorPlanFiles },
    { key: "areaTableFiles", files: pkg.areaTableFiles },
    { key: "facadeFiles", files: pkg.facadeFiles },
    { key: "inclusionFiles", files: pkg.inclusionFiles },
  ];

  for (const { key, files } of categories) {
    if (!files || files.length === 0) continue;
    const label = FILE_CATEGORY_LABELS[key];
    files.forEach((meta, idx) => {
      const ext = path.extname(meta.originalName);
      const suffix = files.length > 1 ? `_${idx + 1}` : "";
      result.push({ meta, mimetype: meta.mimetype, uploadName: `${label}${suffix}${ext}` });
    });
  }

  // Pricing request attachments
  if (pricingRequest?.attachments && pricingRequest.attachments.length > 0) {
    pricingRequest.attachments.forEach((meta, idx) => {
      const ext = path.extname(meta.originalName);
      const suffix = pricingRequest.attachments!.length > 1 ? `_${idx + 1}` : "";
      result.push({ meta, mimetype: meta.mimetype, uploadName: `PR_Attachment${suffix}${ext}` });
    });
  }

  // Note: land links are NOT uploaded as a file to Zoho — Zoho's attachment API rejects
  // text files whose content contains bare URLs. Land links remain accessible in the portal.

  return result;
}

// MIME types that Zoho CRM's attachment API rejects — text-based formats trigger
// a validation error ("cannot hold values other than files") regardless of content.
const ZOHO_UNSUPPORTED_MIMETYPES = new Set([
  "text/plain",
  "text/csv",
  "text/html",
  "text/xml",
  "application/xml",
]);

export async function uploadFilesToZohoProduct(
  productId: string,
  categorisedFiles: CategorisedFile[],
  accessToken: string
): Promise<void> {
  for (const { meta, buffer, mimetype, uploadName } of categorisedFiles) {
    try {
      // Skip file types that Zoho CRM's attachment API does not support
      if (ZOHO_UNSUPPORTED_MIMETYPES.has(mimetype)) {
        console.warn(`[zoho] Skipping unsupported file type for Zoho attachment: ${uploadName} (${mimetype})`);
        continue;
      }

      let fileBuffer: Buffer;

      if (buffer) {
        fileBuffer = buffer;
      } else if (meta) {
        const filePath = meta.path;
        if (!filePath || !fs.existsSync(filePath)) {
          console.warn(`[zoho] File not found on disk, skipping: ${uploadName} (${filePath})`);
          continue;
        }
        fileBuffer = fs.readFileSync(filePath);
      } else {
        continue;
      }

      const blob = new Blob([fileBuffer], { type: mimetype });

      const formData = new FormData();
      formData.append("file", blob, uploadName);

      const res = await fetch(
        `${ZOHO_CONFIG.apiDomain}/crm/${ZOHO_CONFIG.apiVersion}/Products/${productId}/Attachments`,
        {
          method: "POST",
          headers: {
            Authorization: `Zoho-oauthtoken ${accessToken}`,
          },
          body: formData,
        }
      );

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        console.error(`[zoho] Failed to upload ${uploadName}: ${JSON.stringify(errData)}`);
      } else {
        console.log(`[zoho] Uploaded file: ${uploadName} (original: ${meta?.originalName ?? uploadName})`);
      }
    } catch (err) {
      console.error(`[zoho] Error uploading file ${uploadName}:`, err);
    }
  }
}

export async function syncPackageToZohoProduct(pkg: PackageUpload, pricingRequest?: PricingRequest): Promise<string> {
  const accessToken = await getZohoAccessToken();
  const fieldMap = mapPackageToZohoProduct(pkg, pricingRequest);
  const productId = await createZohoProduct(fieldMap, accessToken);

  const categorisedFiles = buildCategorisedFiles(pkg, pricingRequest);

  if (categorisedFiles.length > 0) {
    await uploadFilesToZohoProduct(productId, categorisedFiles, accessToken);
  }

  return productId;
}
