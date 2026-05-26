import fs from "fs";
import path from "path";
import type { PackageUpload, FileMeta } from "@shared/schema";

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

export function mapPackageToZohoProduct(pkg: PackageUpload): Record<string, unknown> {
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
  packageFiles: "Package",
};

interface CategorisedFile {
  meta: FileMeta;
  uploadName: string;
}

function buildCategorisedFiles(pkg: PackageUpload): CategorisedFile[] {
  const result: CategorisedFile[] = [];

  const categories: Array<{ key: keyof typeof FILE_CATEGORY_LABELS; files: FileMeta[] | undefined }> = [
    { key: "floorPlanFiles", files: pkg.floorPlanFiles },
    { key: "sitedFloorPlanFiles", files: pkg.sitedFloorPlanFiles },
    { key: "areaTableFiles", files: pkg.areaTableFiles },
    { key: "facadeFiles", files: pkg.facadeFiles },
    { key: "inclusionFiles", files: pkg.inclusionFiles },
    { key: "packageFiles", files: pkg.packageFiles },
  ];

  for (const { key, files } of categories) {
    if (!files || files.length === 0) continue;
    const label = FILE_CATEGORY_LABELS[key];
    files.forEach((meta, idx) => {
      const ext = path.extname(meta.originalName); // e.g. ".pdf"
      const suffix = files.length > 1 ? `_${idx + 1}` : "";
      const uploadName = `${label}${suffix}${ext}`;
      result.push({ meta, uploadName });
    });
  }

  return result;
}

export async function uploadFilesToZohoProduct(
  productId: string,
  categorisedFiles: CategorisedFile[],
  accessToken: string
): Promise<void> {
  for (const { meta, uploadName } of categorisedFiles) {
    try {
      const filePath = meta.path;

      if (!filePath || !fs.existsSync(filePath)) {
        console.warn(`[zoho] File not found on disk, skipping: ${uploadName} (${filePath})`);
        continue;
      }

      const fileBuffer = fs.readFileSync(filePath);
      const blob = new Blob([fileBuffer], { type: meta.mimetype });

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
        console.log(`[zoho] Uploaded file: ${uploadName} (original: ${meta.originalName})`);
      }
    } catch (err) {
      console.error(`[zoho] Error uploading file ${uploadName}:`, err);
    }
  }
}

export async function syncPackageToZohoProduct(pkg: PackageUpload): Promise<string | null> {
  try {
    const accessToken = await getZohoAccessToken();
    const fieldMap = mapPackageToZohoProduct(pkg);
    const productId = await createZohoProduct(fieldMap, accessToken);

    const categorisedFiles = buildCategorisedFiles(pkg);

    if (categorisedFiles.length > 0) {
      await uploadFilesToZohoProduct(productId, categorisedFiles, accessToken);
    }

    return productId;
  } catch (err) {
    console.error("[zoho] syncPackageToZohoProduct failed:", err);
    return null;
  }
}
